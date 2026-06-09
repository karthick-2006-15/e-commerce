const express     = require('express');
const orderRouter = express.Router();
const Order       = require('../models/Order');
const { auth, isAdmin } = require('../middleware/auth');
const axios       = require('axios');
const crypto      = require('crypto');

// ── Shiprocket helpers ────────────────────────────────────────
const SHIPROCKET_BASE = 'https://apiv2.shiprocket.in/v1/external';
let _srToken        = null;
let _srTokenExpiry  = null;
let _loginInProgress = null; // prevents parallel login calls

const cleanPhone = (phone) => String(phone || '').replace(/\D/g, '').slice(-10);

async function getSRToken() {
  // Return cached token if still valid
  if (_srToken && _srTokenExpiry && Date.now() < _srTokenExpiry) {
    return _srToken;
  }

  // If login already happening, wait for it — don't start another
  if (_loginInProgress) {
    return _loginInProgress;
  }

  _loginInProgress = axios.post(`${SHIPROCKET_BASE}/auth/login`, {
    email:    process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  }).then(res => {
    _srToken        = res.data.token;
    _srTokenExpiry  = Date.now() + 23 * 60 * 60 * 1000; // 23 hours
    _loginInProgress = null;
    console.log('✅ Shiprocket token obtained');
    return _srToken;
  }).catch(err => {
    _loginInProgress = null;
    _srToken        = null;
    _srTokenExpiry  = null;
    throw new Error(`Shiprocket login failed: ${err.response?.data?.message || err.message}`);
  });

  return _loginInProgress;
}

async function pushToShiprocket(order) {
  const token     = await getSRToken();
  const orderDate = new Date(order.createdAt).toISOString().split('T')[0];

  const payload = {
    order_id:              order.orderId,
    order_date:            orderDate,
    pickup_location:       'work',
    billing_customer_name: order.address.firstName,
    billing_last_name:     order.address.lastName  || '',
    billing_address:       order.address.line1,
    billing_address_2:     order.address.line2     || '',
    billing_city:          order.address.city,
    billing_pincode:       order.address.pincode,
    billing_state:         order.address.state,
    billing_country:       'India',
    billing_email:         order.address.email     || process.env.SHIPROCKET_EMAIL,
    billing_phone:         cleanPhone(order.address.phone),
    shipping_is_billing:   true,
    payment_method:        order.payment?.method === 'cod' ? 'COD' : 'Prepaid',
    sub_total:             order.subtotal,
    length:                20,
    breadth:               15,
    height:                10,
    weight:                0.5,
    order_items: order.items.map(i => ({
      name:          i.name,
      sku:           `SKU-${i.id || i._id}`,
      units:         i.qty  || 1,
      selling_price: i.price,
      discount:      0,
      tax:           0,
    })),
  };

  const r = await axios.post(
    `${SHIPROCKET_BASE}/orders/create/adhoc`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return {
    shipmentId:  r.data.shipment_id,
    srOrderId:   r.data.order_id,
    awb:         r.data.awb_code    || null,
    courierName: r.data.courier_name || null,
  };
}
// ─────────────────────────────────────────────────────────────

const Product     = require('../models/Product');
const Counter     = require('../models/Counter');

// ── PLACE ORDER ───────────────────────────────────────────────
orderRouter.post('/', auth, async (req, res) => {
  try {
    const { items, address, payment, deliverySlot, mongoOrderId } = req.body;

    // --- VERIFICATION OF EXISTING PENDING ORDER ---
    if (mongoOrderId && payment && payment.method === 'online') {
      const order = await Order.findOne({ orderId: mongoOrderId });
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(payment.razorpay_order_id + '|' + payment.razorpay_payment_id)
        .digest('hex');

      if (generatedSignature !== payment.razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Payment verification failed' });
      }

      order.status = 'confirmed';
      order.payment = payment;
      await order.save();

      // Push to Shiprocket
      try {
        const sr = await pushToShiprocket(order);
        order.shiprocketShipmentId = sr.shipmentId;
        order.awbCode = sr.awb;
        order.courierName = sr.courierName;
        await order.save();
      } catch (srErr) {
        console.error('⚠️ Shiprocket push failed:', srErr.message);
      }

      return res.json({ success: true, order });
    }
    // ----------------------------------------------

    if (!items || !items.length)
      return res.status(400).json({ success: false, message: 'No items in order' });

    // Server-side price calculation and stock verification
    let subtotal = 0;
    const validatedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.id || item._id);
      if (!product) throw new Error(`Product ${item.name || item.id} not found`);
      
      const qty = item.qty || 1;
      if (product.stock !== undefined && product.stock < qty) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      subtotal += product.price * qty;
      validatedItems.push({ ...item, price: product.price, name: product.name });
      
      // Decrement stock
      if (product.stock !== undefined) {
        await Product.findByIdAndUpdate(product._id, { $inc: { stock: -qty } });
      }
    }

    const deliveryCharge = subtotal >= 499 ? 0 : 49;
    const total          = subtotal + deliveryCharge;

    // Atomic Order ID Generation
    const counter = await Counter.findOneAndUpdate(
      { _id: 'orderId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const orderId = `SWM-2024-${String(counter.seq + 125).padStart(5, '0')}`;

    const order = await Order.create({
      orderId,
      userId:            req.user.id,
      items:             validatedItems,
      address,
      payment:           payment || { method: 'cod' },
      deliverySlot:      deliverySlot || '',
      subtotal,
      deliveryCharge,
      total,
      status:            'confirmed',
      estimatedDelivery: new Date(Date.now() + 4 * 3600000).toISOString(),
    });

    // ── Push to Shiprocket ────────────────────────────────────
    try {
      const sr = await pushToShiprocket(order);
      console.log('✅ Shiprocket order created:', sr);

      await Order.findByIdAndUpdate(order._id, {
        shiprocketShipmentId: sr.shipmentId,
        awbCode:              sr.awb,
        courierName:          sr.courierName,
      });
    } catch (srErr) {
      console.error('⚠️  Shiprocket push failed (order still saved):',
        srErr.response?.data || srErr.message);
    }
    // ─────────────────────────────────────────────────────────

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('Order error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── MY ORDERS ─────────────────────────────────────────────────
orderRouter.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── ALL ORDERS — Admin ────────────────────────────────────────
orderRouter.get('/all', auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── TRACK ORDER ───────────────────────────────────────────────
orderRouter.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── UPDATE STATUS — Admin ─────────────────────────────────────
orderRouter.put('/:orderId', auth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const oldStatus = order.status;
    order.status = req.body.status;
    
    // Process Razorpay Refund if cancelled
    if (order.status === 'cancelled' && oldStatus !== 'cancelled' && order.payment?.razorpay_payment_id) {
      const Razorpay = require('razorpay');
      const rzp = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      
      try {
        await rzp.payments.refund(order.payment.razorpay_payment_id, {
          "amount": Math.round(order.total * 100)
        });
        order.payment.refund_status = 'processed';
      } catch (err) {
        console.error('Refund failed:', err);
        order.payment.refund_status = 'failed';
      }
    }

    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = orderRouter;
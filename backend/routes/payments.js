const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const { auth } = require('../middleware/auth');
const crypto = require('crypto');
const Order = require('../models/Order');

const Product = require('../models/Product');
const Counter = require('../models/Counter');

router.post('/create-order', auth, async (req, res) => {
  try {
    const { orderData } = req.body;
    if (!orderData || !orderData.items || !orderData.items.length) {
      return res.status(400).json({ success: false, message: 'Invalid order data' });
    }

    let subtotal = 0;
    const validatedItems = [];
    for (const item of orderData.items) {
      const product = await Product.findById(item.id || item._id);
      if (!product) throw new Error(`Product ${item.name || item.id} not found`);
      
      const qty = item.qty || 1;
      if (product.stock !== undefined && product.stock < qty) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      subtotal += product.price * qty;
      validatedItems.push({ ...item, price: product.price, name: product.name });
    }

    const deliveryCharge = subtotal >= 499 ? 0 : 49;
    const total          = subtotal + deliveryCharge;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: "rcpt_" + Date.now()
    };
    const rzpOrder = await instance.orders.create(options);

    // Atomic Order ID
    const counter = await Counter.findOneAndUpdate(
      { _id: 'orderId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const orderId = `SWM-2024-${String(counter.seq + 125).padStart(5, '0')}`;

    const order = await Order.create({
      orderId,
      userId: req.user.id,
      items: validatedItems,
      address: orderData.address,
      payment: { method: 'online', razorpay_order_id: rzpOrder.id },
      deliverySlot: orderData.deliverySlot || '',
      subtotal,
      deliveryCharge,
      total,
      status: 'pending', // Important fix for abandoned carts
      estimatedDelivery: new Date(Date.now() + 4 * 3600000).toISOString(),
    });

    res.json({ success: true, razorpayOrderId: rzpOrder.id, mongoOrderId: order.orderId });
  } catch (err) {
    console.error('Razorpay Order Creation Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/webhook', async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
  
  const signature = req.headers['x-razorpay-signature'];
  if (!signature) return res.status(400).send('No signature');

  const expectedSignature = crypto.createHmac('sha256', secret)
    .update(req.rawBody || '')
    .digest('hex');

  if (expectedSignature !== signature) {
    return res.status(400).send('Invalid signature');
  }

  const event = req.body.event;
  if (event === 'payment.captured') {
    const payment = req.body.payload.payment.entity;
    const rzpOrderId = payment.order_id;
    // We would need to match the razorpay_order_id stored when creating order
    // Since Swamy Bakery creates order AFTER payment via frontend, 
    // we should update status if we find an order with this razorpay_order_id.
    // If we want webhooks to create the order, the cart details must be passed in notes.
    // For now, we update the payment object if order exists, or log if it doesn't.
    try {
      await Order.findOneAndUpdate(
        { "payment.razorpay_order_id": rzpOrderId },
        { status: 'confirmed' }
      );
    } catch (e) {
      console.error('Webhook error:', e);
    }
  }

  res.json({ status: 'ok' });
});

module.exports = router;

const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const SHIPROCKET_BASE = 'https://apiv2.shiprocket.in/v1/external';

// ── Token cache — login ONCE, reuse for 23 hours ─────────────
let cachedToken    = null;
let tokenExpiresAt = null;
let loginInProgress = null; // prevents parallel login calls

const cleanPhone = (phone) => String(phone || '').replace(/\D/g, '').slice(-10);

async function getToken() {
  // Return cached token if still valid
  if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  // If a login is already in progress, wait for it instead of starting another
  if (loginInProgress) {
    return loginInProgress;
  }

  // Start fresh login
  loginInProgress = axios.post(`${SHIPROCKET_BASE}/auth/login`, {
    email:    process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  }).then(res => {
    cachedToken    = res.data.token;
    tokenExpiresAt = Date.now() + 23 * 60 * 60 * 1000; // 23 hours
    loginInProgress = null;
    console.log('✅ Shiprocket token refreshed');
    return cachedToken;
  }).catch(err => {
    loginInProgress = null;
    cachedToken    = null;
    tokenExpiresAt = null;
    throw new Error(`Shiprocket login failed: ${err.response?.data?.message || err.message}`);
  });

  return loginInProgress;
}

// ── POST /api/shiprocket/check-delivery ──────────────────────
router.post('/check-delivery', async (req, res) => {
  const { pincode, weight = 0.5 } = req.body;
  if (!pincode) return res.status(400).json({ success: false, message: 'Pincode is required' });

  try {
    const token = await getToken();
    const r = await axios.get(`${SHIPROCKET_BASE}/courier/serviceability/`, {
      params: {
        pickup_postcode:   process.env.BAKERY_PINCODE || '629802',
        delivery_postcode: pincode,
        weight,
        cod: 1,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    const couriers = (r.data?.data?.available_courier_companies || []).map(c => ({
      id:            c.courier_company_id,
      name:          c.courier_name,
      estimatedDays: c.estimated_delivery_days,
      codCharge:     c.cod_charges,
      freightCharge: c.freight_charge,
      rating:        c.rating,
    }));

    res.json({ success: true, pincode, deliveryAvailable: couriers.length > 0, couriers });
  } catch (err) {
    console.error('Shiprocket check-delivery error:', err.response?.data || err.message);
    res.status(500).json({ success: false, message: err.message, detail: err.response?.data });
  }
});

// ── POST /api/shiprocket/create-order ────────────────────────
router.post('/create-order', async (req, res) => {
  const { order } = req.body;
  if (!order?.orderId) return res.status(400).json({ success: false, message: 'Order object is required' });

  try {
    const token = await getToken();

    const orderDate = order.createdAt
      ? new Date(order.createdAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const r = await axios.post(`${SHIPROCKET_BASE}/orders/create/adhoc`, {
      order_id:              order.orderId,
      order_date:            orderDate,
      pickup_location:       'work',
      billing_customer_name: order.address.firstName,
      billing_last_name:     order.address.lastName || '',
      billing_address:       order.address.line1,
      billing_address_2:     order.address.line2 || '',
      billing_city:          order.address.city,
      billing_pincode:       order.address.pincode,
      billing_state:         order.address.state,
      billing_country:       'India',
      billing_email:         order.address.email || process.env.SHIPROCKET_EMAIL,
      billing_phone:         cleanPhone(order.address.phone),
      shipping_is_billing:   true,
      order_items: order.items.map(i => ({
        name:          i.name,
        sku:           `SKU-${i.id || i._id}`,
        units:         i.qty  || 1,
        selling_price: i.price,
        discount:      0,
        tax:           0,
      })),
      payment_method: order.payment?.method === 'cod' ? 'COD' : 'Prepaid',
      sub_total:      order.subtotal,
      length:         20,
      breadth:        15,
      height:         10,
      weight:         0.5,
    }, { headers: { Authorization: `Bearer ${token}` } });

    console.log('✅ Shiprocket order created via route:', r.data);

    res.json({
      success:     true,
      shipmentId:  r.data.shipment_id,
      orderId:     r.data.order_id,
      awb:         r.data.awb_code    || null,
      courierName: r.data.courier_name || null,
    });
  } catch (err) {
    console.error('Shiprocket create-order error:', err.response?.data || err.message);
    res.status(500).json({ success: false, message: err.message, detail: err.response?.data });
  }
});

// ── GET /api/shiprocket/track/:awb ───────────────────────────
router.get('/track/:awb', async (req, res) => {
  const { awb } = req.params;

  try {
    const token = await getToken();
    const r = await axios.get(`${SHIPROCKET_BASE}/courier/track/awb/${awb}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const t = r.data?.tracking_data;
    res.json({
      success:       true,
      awb,
      currentStatus: t?.shipment_track?.[0]?.current_status || 'Unknown',
      estimatedDate: t?.shipment_track?.[0]?.etd            || null,
      history:       t?.shipment_track_activities            || [],
    });
  } catch (err) {
    console.error('Shiprocket track error:', err.response?.data || err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
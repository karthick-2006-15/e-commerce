// debug-test.js
// Run this from your backend folder: node debug-test.js

require('dotenv').config();
const axios = require('axios');

const SHIPROCKET_BASE = 'https://apiv2.shiprocket.in/v1/external';

async function runDiagnostics() {
  console.log('\n========================================');
  console.log('  SWAMY BAKERY — SHIPROCKET DIAGNOSTICS');
  console.log('========================================\n');

  // ── STEP 1: Check .env values ──────────────────────────────
  console.log('STEP 1: Checking .env values...');
  console.log('  PORT            :', process.env.PORT       || '(not set — will use 5000)');
  console.log('  SHIPROCKET_EMAIL:', process.env.SHIPROCKET_EMAIL  || '❌ MISSING');
  console.log('  SHIPROCKET_PASS :', process.env.SHIPROCKET_PASSWORD ? '✅ Set' : '❌ MISSING');
  console.log('  MONGO_URI       :', process.env.MONGO_URI   || '❌ MISSING');

  if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
    console.log('\n❌ STOP: SHIPROCKET_EMAIL or SHIPROCKET_PASSWORD missing in .env\n');
    process.exit(1);
  }

  // ── STEP 2: Test Shiprocket Login ──────────────────────────
  console.log('\nSTEP 2: Testing Shiprocket login...');
  let token;
  try {
    const res = await axios.post(`${SHIPROCKET_BASE}/auth/login`, {
      email:    process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });
    token = res.data.token;
    console.log('  ✅ Login SUCCESS — token received');
  } catch (err) {
    console.log('  ❌ Login FAILED:', err.response?.data || err.message);
    console.log('\n  FIX: Check SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in .env');
    console.log('       The API user may be blocked — reset password in Shiprocket dashboard\n');
    process.exit(1);
  }

  // ── STEP 3: Test Pickup Location ───────────────────────────
  console.log('\nSTEP 3: Checking pickup addresses in your Shiprocket account...');
  try {
    const res = await axios.get(`${SHIPROCKET_BASE}/settings/company/pickup`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const addresses = res.data?.data?.shipping_address || [];
    if (addresses.length === 0) {
      console.log('  ❌ No pickup addresses found!');
      console.log('  FIX: Go to Shiprocket → Settings → Manage Addresses → Add "work"');
    } else {
      console.log('  ✅ Pickup addresses found:');
      addresses.forEach(a => {
        console.log(`     - "${a.pickup_location}" (${a.city}, ${a.pin_code})`);
      });
      const hasWork = addresses.some(a => a.pickup_location === 'work');
      if (!hasWork) {
        console.log('  ⚠️  WARNING: No address named "work" — your code uses pickup_location: "work"');
        console.log('  FIX: Rename your pickup address to "work" OR update orders.js to match the name above');
      } else {
        console.log('  ✅ "work" pickup location exists — OK');
      }
    }
  } catch (err) {
    console.log('  ⚠️  Could not fetch pickup addresses:', err.response?.data || err.message);
  }

  // ── STEP 4: Test creating a real order ─────────────────────
  console.log('\nSTEP 4: Creating a test order in Shiprocket...');
  const testOrderId = `DEBUG-${Date.now()}`;
  try {
    const r = await axios.post(`${SHIPROCKET_BASE}/orders/create/adhoc`, {
      order_id:              testOrderId,
      order_date:            new Date().toISOString().split('T')[0],
      pickup_location:       'work',
      billing_customer_name: 'Test',
      billing_last_name:     'User',
      billing_address:       '123 Test Street',
      billing_city:          'Chennai',
      billing_pincode:       '600001',
      billing_state:         'Tamil Nadu',
      billing_country:       'India',
      billing_email:         'test@test.com',
      billing_phone:         '9080729355',
      shipping_is_billing:   true,
      payment_method:        'COD',
      sub_total:             100,
      length: 20, breadth: 15, height: 10, weight: 0.5,
      order_items: [{ name: 'Chips', sku: 'SKU-1', units: 1, selling_price: 100, discount: 0, tax: 0 }],
    }, { headers: { Authorization: `Bearer ${token}` } });

    console.log('  ✅ Order created in Shiprocket!');
    console.log('  shipment_id :', r.data.shipment_id);
    console.log('  order_id    :', r.data.order_id);
    console.log('  Check Shiprocket dashboard → Orders for:', testOrderId);
  } catch (err) {
    console.log('  ❌ Order creation FAILED');
    console.log('  Error:', JSON.stringify(err.response?.data || err.message, null, 2));
    console.log('\n  Common fixes:');
    console.log('  - "pickup location not found" → rename address to "work" in Shiprocket dashboard');
    console.log('  - "KYC pending" → complete KYC in Shiprocket dashboard');
    console.log('  - "duplicate order_id" → ignore, means a previous test already worked');
  }

  // ── STEP 5: Test your local backend ────────────────────────
  console.log('\nSTEP 5: Testing your local backend /api/shiprocket/create-order...');
  const port = process.env.PORT || 5000;
  try {
    const res = await axios.post(`http://localhost:${port}/api/shiprocket/create-order`, {
      order: {
        orderId:   `LOCAL-${Date.now()}`,
        createdAt: new Date().toISOString(),
        address: {
          firstName: 'Test', lastName: 'User',
          line1: '123 Test Street', city: 'Chennai',
          pincode: '600001', state: 'Tamil Nadu',
          email: 'test@test.com', phone: '9080729355',
        },
        items:   [{ name: 'Chips', id: '1', qty: 1, price: 100 }],
        payment: { method: 'cod' },
        subtotal: 100,
      }
    });
    console.log('  ✅ Local backend Shiprocket route works!', res.data);
  } catch (err) {
    console.log('  ❌ Local backend call FAILED');
    if (err.code === 'ECONNREFUSED') {
      console.log('  → Server is NOT running on port', port);
      console.log('  FIX: Start server first with: node server.js');
    } else {
      console.log('  Error:', err.response?.data || err.message);
    }
  }

  console.log('\n========================================');
  console.log('  DIAGNOSTICS COMPLETE');
  console.log('========================================\n');
}

runDiagnostics();

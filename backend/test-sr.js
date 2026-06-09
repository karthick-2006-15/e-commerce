require('dotenv').config();
const axios = require('axios');

async function testSR() {
  try {
    const res = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD
    });
    console.log("Login successful! Token:", res.data.token.slice(0, 20) + '...');
    
    // Now fetch pickup locations
    const locRes = await axios.get('https://apiv2.shiprocket.in/v1/external/settings/company/pickup', {
      headers: { Authorization: `Bearer ${res.data.token}` }
    });
    
    console.log("Pickup Locations:", locRes.data.data.shipping_address.map(l => l.pickup_location));
  } catch (err) {
    console.error("Shiprocket test failed:");
    console.error(err.response ? err.response.data : err.message);
  }
}

testSR();

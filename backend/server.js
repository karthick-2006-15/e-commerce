const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const mongoose  = require('mongoose');
const rateLimit = require('express-rate-limit');
const morgan    = require('morgan');
const path      = require('path');
const helmet    = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })); // allow Unsplash images
app.use(cors({ origin: '*' })); // Should restrict in prod, e.g. ['https://swamybakery.in']
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; }
}));
app.use(mongoSanitize());
app.use(morgan('dev'));

// ─── Routes (registered ONCE) ────────────────────────────────
app.use('/api/coupons',    require('./routes/coupons'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/users',      require('./routes/users'));
app.use('/api/shiprocket', require('./routes/shiprocket'));
app.use('/api/payments',   require('./routes/payments'));

// ─── Rate Limiter (after routes so internal calls aren't blocked) ──
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// ─── DB Connection ────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ─── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Swamy Bakery API is running 🍰' });
});

app.get('/api/config', (req, res) => {
  res.json({ success: true, razorpayKeyId: process.env.RAZORPAY_KEY_ID });
});

// ─── Serve Frontend ───────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── 404 Handler for API only, otherwise serve index.html ─────
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🍰 Swamy Bakery API running at http://localhost:${PORT}`);
});

module.exports = app;
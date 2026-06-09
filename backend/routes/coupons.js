const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { auth, isAdmin } = require('../middleware/auth');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discount: Number,
  type: { type: String, enum: ['percent', 'flat'], default: 'percent' },
  min: { type: Number, default: 0 },
  uses: { type: Number, default: 0 },
  maxUses: { type: Number, default: 100 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json({ coupons });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.create({ ...req.body, code: req.body.code.toUpperCase() });
    res.json({ coupon });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ coupon });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { auth, isAdmin } = require('../middleware/auth');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  emoji: { type: String, default: '📦' },
  image: { type: String, default: '' },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ categories });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json({ category });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ category });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
// routes/products.js — MongoDB version
const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');
const { auth, isAdmin } = require('../middleware/auth');

// ── GET ALL PRODUCTS ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sortBy } = req.query;
    const filter = {};
    if (category) {
      const escaped = category.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      filter.category = { $regex: new RegExp(escaped, 'i') };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    let sort = {};
    if (sortBy === 'price_asc')  sort = { price:  1 };
    if (sortBy === 'price_desc') sort = { price: -1 };
    if (sortBy === 'rating')     sort = { rating: -1 };

    const products = await Product.find(filter).sort(sort);
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET SINGLE PRODUCT ───────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── ADD PRODUCT ──────────────────────────────────────────────
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { name, category, price, oldPrice, weight, badge, rating, emoji, image, desc, description, ingredients, tags } = req.body;
    if (!name || !price) return res.status(400).json({ success: false, message: 'Name and price are required' });

    const product = await Product.create({
      name,
      category:    category    || 'General',
      price:       parseFloat(price),
      oldPrice:    parseFloat(oldPrice) || 0,
      weight:      weight      || '',
      badge:       badge       || '',
      rating:      parseFloat(rating)   || 4.5,
      emoji:       emoji       || '🍰',
      image:       image       || '',
      description: desc || description || '',
      ingredients: ingredients || '',
      tags:        tags        || [],
      reviews:     0,
    });
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── UPDATE PRODUCT ───────────────────────────────────────────
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { name, category, price, oldPrice, weight, badge, rating, emoji, image, desc, description, ingredients, tags } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...(name        && { name }),
        ...(category    && { category }),
        ...(price       && { price: parseFloat(price) }),
        ...(oldPrice !== undefined && { oldPrice: parseFloat(oldPrice) }),
        ...(weight      !== undefined && { weight }),
        ...(badge       !== undefined && { badge }),
        ...(rating      && { rating: parseFloat(rating) }),
        ...(emoji       !== undefined && { emoji }),
        ...(image       !== undefined && { image }),
        ...((desc || description) && { description: desc || description }),
        ...(ingredients !== undefined && { ingredients }),
        ...(tags        && { tags }),
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE PRODUCT ───────────────────────────────────────────
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: `Product "${deleted.name}" deleted successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String, required: true },
  price:       { type: Number, required: true },
  oldPrice:    { type: Number, default: 0 },
  weight:      { type: String, default: '' },
  badge:       { type: String, default: '' },
  rating:      { type: Number, default: 4.5 },
  reviews:     { type: Number, default: 0 },
  emoji:       { type: String, default: '🍰' },
  image:       { type: String, default: '' },
  description: { type: String, default: '' },
  tags:        { type: [String], default: [] },
  stock:       { type: Number, default: 100 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
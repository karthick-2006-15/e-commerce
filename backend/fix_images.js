const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Product = require('./models/Product');

async function fixImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const placeholder = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop';

    // Update Products
    const products = await Product.find({ image: { $regex: 'pexels' } });
    for (let p of products) {
      p.image = placeholder;
      await p.save();
    }
    console.log(`Updated ${products.length} products`);

  } catch (e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
}

fixImages();

const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  emoji: { type: String, default: '📦' },
  image: { type: String, default: '' },
}, { timestamps: true });
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const categories = [
  { name: 'Murukku', emoji: '🥨', image: 'https://images.pexels.com/photos/14842188/pexels-photo-14842188.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Mixture', emoji: '🥣', image: 'https://images.pexels.com/photos/11111603/pexels-photo-11111603.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Sweets', emoji: '🍡', image: 'https://images.pexels.com/photos/8991448/pexels-photo-8991448.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Cakes', emoji: '🎂', image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Cookies', emoji: '🍪', image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=800' }
];

const products = [
  {
    name: 'Butter Murukku Premium',
    category: 'Murukku',
    price: 199,
    pricePerKg: 796,
    oldPrice: 249,
    weight: '250g',
    badge: 'Bestseller',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/14842188/pexels-photo-14842188.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Our signature melt-in-the-mouth butter murukku made with pure ghee and rice flour. Perfect for festive snacking.',
    reviews: 421
  },
  {
    name: 'Spicy Madras Mixture',
    category: 'Mixture',
    price: 159,
    pricePerKg: 636,
    oldPrice: 189,
    weight: '250g',
    badge: 'Spicy',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/11111603/pexels-photo-11111603.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'A fiery, crunchy mix of roasted peanuts, sev, boondi, and curry leaves. Best enjoyed with a hot cup of filter coffee.',
    reviews: 315
  },
  {
    name: 'Pure Ghee Mysore Pak',
    category: 'Sweets',
    price: 349,
    pricePerKg: 1396,
    oldPrice: 399,
    weight: '250g',
    badge: 'Premium',
    rating: 5.0,
    image: 'https://images.pexels.com/photos/8991448/pexels-photo-8991448.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'The royal sweet of South India. Rich, porous, and loaded with pure aromatic ghee that melts instantly in your mouth.',
    reviews: 512
  },
  {
    name: 'Classic Black Forest Cake',
    category: 'Cakes',
    price: 699,
    pricePerKg: 1398,
    oldPrice: 799,
    weight: '500g',
    badge: 'Fresh',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Layers of moist chocolate sponge, fresh whipped cream, and tart cherries, topped with chocolate shavings.',
    reviews: 189
  },
  {
    name: 'Almond Butter Cookies',
    category: 'Cookies',
    price: 189,
    pricePerKg: 756,
    oldPrice: 220,
    weight: '250g',
    badge: 'Eggless',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Crunchy on the outside, chewy on the inside. Baked with real California almonds and rich butter.',
    reviews: 245
  },
  {
    name: 'Ribbon Pakoda',
    category: 'Murukku',
    price: 149,
    pricePerKg: 596,
    oldPrice: 179,
    weight: '250g',
    badge: '',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/13015562/pexels-photo-13015562.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Crispy flat rice flour ribbons spiced with chili powder and asafoetida. A traditional tea-time favorite.',
    reviews: 178
  },
  {
    name: 'Motichoor Ladoo',
    category: 'Sweets',
    price: 249,
    pricePerKg: 996,
    oldPrice: 299,
    weight: '250g',
    badge: 'Festive',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/14022416/pexels-photo-14022416.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Tiny golden pearls of gram flour fried in ghee and soaked in saffron-infused sugar syrup.',
    reviews: 388
  },
  {
    name: 'Garlic Karasev',
    category: 'Mixture',
    price: 139,
    pricePerKg: 556,
    oldPrice: 159,
    weight: '250g',
    badge: 'Spicy',
    rating: 4.5,
    image: 'https://images.pexels.com/photos/16043297/pexels-photo-16043297.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Thick, crunchy strands of besan generously flavored with crushed garlic and black pepper.',
    reviews: 142
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data.');

    await Category.insertMany(categories);
    console.log('Categories seeded.');

    await Product.insertMany(products);
    console.log('Products seeded.');

    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
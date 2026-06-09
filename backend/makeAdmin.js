const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const email = process.argv[2];

if (!email) {
  console.error('Please provide an email: node makeAdmin.js <email>');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.error('User not found!');
      process.exit(1);
    }
    user.role = 'admin';
    await user.save();
    console.log(`Successfully made ${user.email} an admin!`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

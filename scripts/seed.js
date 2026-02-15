const mongoose = require('mongoose');
const User = require('../src/models/User');
const Transaction = require('../src/models/Transaction');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Seeding data...');

  // Seed test user
  const user = new User({ username: 'testuser', email: 'test@example.com', password: 'password123' });
  await user.save();

  // Seed transaction
  const tx = new Transaction({ fromUser: user._id, toUser: user._id, amount: 0.1, type: 'tip' });
  await tx.save();

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch(console.error);

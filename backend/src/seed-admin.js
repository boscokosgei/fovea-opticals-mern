// backend/src/seed-admin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@foveaoptical.co.ke' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@foveaoptical.co.ke',
      password: 'admin123', // Will be hashed automatically
      role: 'admin',
      phone: '+254 700 000000'
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@foveaoptical.co.ke');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Change this password immediately!');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
// backend/test-connection.js
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
  try {
    console.log('🔗 Testing MongoDB Atlas connection...');
    console.log('Connection string:', MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://username:password@'));
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas');
    
    // Check if we can perform operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('✅ Connection test completed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Check your MongoDB Atlas connection string');
    console.log('2. Make sure your IP is whitelisted in Network Access');
    console.log('3. Verify your database user has correct permissions');
    console.log('4. Check if the cluster is running in MongoDB Atlas');
    process.exit(1);
  }
}

testConnection();
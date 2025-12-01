// backend/src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Import Routes
const authRoutes = require('./routes/auth');
const { auth, adminAuth } = require('./middleware/auth');

//Routes

// MongoDB Connection with better error handling
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

console.log('🔗 Attempting to connect to MongoDB Atlas...');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.log('💡 Tips:');
  console.log('1. Check if your IP is whitelisted in MongoDB Atlas');
  console.log('2. Verify your connection string includes the database name');
  console.log('3. Check your username and password');
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', require('./routes/services'));
app.use('/api/opticians', require('./routes/opticians'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/admin', adminAuth, require('./routes/admin')); // Admin only

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Fovea Opticals API is running!',
    database: 'MongoDB Atlas',
    timestamp: new Date().toISOString()
  });
});

// Health check with database status
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({ 
      status: 'OK', 
      message: 'Backend is running',
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Backend error',
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for: http://localhost:3000`);
  console.log(`🗄️  Database: MongoDB Atlas`);
});
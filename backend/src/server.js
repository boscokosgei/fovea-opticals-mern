// backend/src/server.js - UPDATED FOR PRODUCTION
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// CORS Configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'https://fovea-opticals-frontend.onrender.com', // Your frontend on Render
  'https://fovea-opticals-mern.onrender.com' // Your backend on Render
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this for form data
app.use(cookieParser());

// Import Routes
const authRoutes = require('./routes/auth');

// MongoDB Connection with better error handling
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  console.error('💡 Please check your .env file');
  process.exit(1);
}

console.log('🔗 Attempting to connect to MongoDB Atlas...');
// Add at the top of server.js, before mongoose.connect()
console.log('🔍 Deployment Diagnostics:');
console.log('- Mongoose version:', require('mongoose').version);
console.log('- Node version:', process.version);
console.log('- MONGODB_URI present:', !!process.env.MONGODB_URI);
console.log('- MONGODB_URI starts with:', process.env.MONGODB_URI ? 
  process.env.MONGODB_URI.substring(0, 50) + '...' : 'MISSING');
console.log('- NODE_ENV:', process.env.NODE_ENV);
// Add explicit strictQuery setting for mongoose 6
mongoose.set('strictQuery', false);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Timeout after 5s
  socketTimeoutMS: 45000, // Close sockets after 45s
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB Atlas');
  
  // Monitor connection events
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });
  
  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
  });
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.log('\n💡 Troubleshooting tips:');
  console.log('1. Check your MongoDB Atlas connection string');
  console.log('2. Verify your username and password');
  console.log('3. Check if your IP is whitelisted in MongoDB Atlas');
  console.log('4. Ensure network connectivity');
  console.log('Connection string (masked):', 
    MONGODB_URI.replace(/mongodb\+srv:\/\/[^:]+:[^@]+@/, 'mongodb+srv://USER:PASSWORD@')
  );
  process.exit(1);
});

// Routes - Use conditional imports to avoid crashes if files don't exist
app.use('/api/auth', authRoutes);
app.use('/api/test', require('./routes/testRoutes'));
app.use('/api/test-email', require('./routes/emailTest'));

// Conditionally load other routes if they exist
try {
  const servicesRoutes = require('./routes/services');
  app.use('/api/services', servicesRoutes);
  console.log('✅ Services routes loaded');
} catch (error) {
  console.warn('⚠️  Services routes not found:', error.message);
}

try {
  const opticiansRoutes = require('./routes/opticians');
  app.use('/api/opticians', opticiansRoutes);
  console.log('✅ Opticians routes loaded');
} catch (error) {
  console.warn('⚠️  Opticians routes not found:', error.message);
}

try {
  const appointmentsRoutes = require('./routes/appointments');
  app.use('/api/appointments', appointmentsRoutes);
  console.log('✅ Appointments routes loaded');
} catch (error) {
  console.warn('⚠️  Appointments routes not found:', error.message);
}

try {
  // Comment out admin routes for now if middleware doesn't exist
  // const { adminAuth } = require('./middleware/auth');
  // const adminRoutes = require('./routes/admin');
  // app.use('/api/admin', adminAuth, adminRoutes);
  // console.log('✅ Admin routes loaded');
} catch (error) {
  console.warn('⚠️  Admin routes not loaded:', error.message);
}

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Fovea Opticals API is running!',
    database: 'MongoDB Atlas',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      services: '/api/services',
      opticians: '/api/opticians',
      appointments: '/api/appointments',
      health: '/api/health'
    }
  });
});

// Health check with database status
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const statusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({ 
      status: 'OK', 
      message: 'Backend is running',
      database: statusMap[dbStatus] || 'unknown',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Backend error',
      error: error.message 
    });
  }
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  
  const statusCode = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong!' 
    : err.message;
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📡 API available at http://localhost:${PORT}`);
});
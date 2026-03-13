// backend/src/models/Opticia n.js - CORRECTED VERSION
const mongoose = require('mongoose');

const opticianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  // FIX 1: Change from Number to String for experience
  experience: {
    type: String,  // Changed from Number to String
    default: ''
  },
  // FIX 2: Use 'specialization' consistently (not 'specialty')
  specialization: {
    type: String,
    required: [true, 'Specialization is required']
  },
  qualification: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  availableDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  consultationFee: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Optician', opticianSchema);
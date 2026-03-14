// backend/src/models/Service.js - CORRECTED VERSION
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['eye-exams', 'glasses', 'contacts', 'children', 'corporate', 'surgery']
  },
  duration: {
    type: Number,  // This expects a Number (like 60, 90, 120)
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  features: [{
    type: String
  }],
  icon: {
    type: String,
    default: '👁️'
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

module.exports = mongoose.model('Service', serviceSchema);
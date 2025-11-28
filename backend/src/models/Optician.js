// backend/src/models/Optician.js
const mongoose = require('mongoose');

const opticianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialty: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Optician', opticianSchema);
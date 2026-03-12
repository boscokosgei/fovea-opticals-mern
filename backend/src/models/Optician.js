// backend/src/models/Optician.js
const mongoose = require('mongoose');

const opticianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is Required'],
    trim: true
  },
  specialty: {
    type: String,
    required: [true, 'Specialization is required'],
  },
  bio: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  experience: {
    type: Number,
    required: true,
    min: 0
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
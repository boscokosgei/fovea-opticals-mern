// backend/src/routes/opticians.js
const express = require('express');
const Optician = require('../models/Optician');
const router = express.Router();

// GET all opticians
router.get('/', async (req, res) => {
  try {
    console.log('👓 Fetching all opticians...');
    const opticians = await Optician.find().sort({ name: 1 });
    console.log(`✅ Found ${opticians.length} opticians`);
    res.json(opticians);
  } catch (error) {
    console.error('❌ Error fetching opticians:', error);
    res.status(500).json({ 
      error: 'Failed to fetch opticians',
      details: error.message 
    });
  }
});

// GET single optician
router.get('/:id', async (req, res) => {
  try {
    const optician = await Optician.findById(req.params.id);
    if (!optician) {
      return res.status(404).json({ error: 'Optician not found' });
    }
    res.json(optician);
  } catch (error) {
    console.error('Error fetching optician:', error);
    res.status(500).json({ error: error.message });
  }
});

// ADD THIS MISSING POST ROUTE
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creating new optician:', req.body);
    
    // Validate required fields
    const { name, email, phone, specialization } = req.body;
    if (!name || !email || !phone || !specialization) {
      return res.status(400).json({ 
        error: 'Name, email, phone, and specialization are required' 
      });
    }

    // Check if optician with same email exists
    const existingOptician = await Optician.findOne({ email });
    if (existingOptician) {
      return res.status(400).json({ 
        error: 'Optician with this email already exists' 
      });
    }

    const optician = new Optician({
      name,
      email,
      phone,
      specialization,
      experience: req.body.experience || '',
      qualification: req.body.qualification || '',
      bio: req.body.bio || '',
      image: req.body.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      availableDays: req.body.availableDays || [],
      consultationFee: req.body.consultationFee || 0,
      isActive: true
    });

    await optician.save();
    console.log('✅ Optician created:', optician.name);
    
    res.status(201).json(optician);
  } catch (error) {
    console.error('❌ Error creating optician:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'Optician with this email already exists' 
      });
    }
    
    res.status(400).json({ error: error.message });
  }
});

// PUT update optician
router.put('/:id', async (req, res) => {
  try {
    const optician = await Optician.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!optician) {
      return res.status(404).json({ error: 'Optician not found' });
    }
    res.json(optician);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE optician
router.delete('/:id', async (req, res) => {
  try {
    const optician = await Optician.findByIdAndDelete(req.params.id);
    if (!optician) {
      return res.status(404).json({ error: 'Optician not found' });
    }
    res.json({ message: 'Optician deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
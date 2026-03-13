// backend/src/routes/opticians.js
const express = require('express');
const Optician = require('../models/Optician');
const upload = require('../middleware/upload');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Serve uploaded files statically
router.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

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
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('📝 Creating new optician:', req.body);
    console.log('📸 File uploaded:', req.file);

    //Build image URL
    let imageUrl = '';
    if (req.file) {
      // For production, use full URL
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      imageUrl = `${baseUrl}/api/opticians/uploads/${req.file.filename}`;
    }
    
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
      image: imageUrl || req.body.image || '',
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
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const optician = await Optician.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!optician) {
      return res.status(404).json({ error: 'Optician not found' });
    }
     // Update fields
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      specialization: req.body.specialization,
      experience: req.body.experience,
      qualification: req.body.qualification,
      bio: req.body.bio,
      consultationFee: Number(req.body.consultationFee) || 0,
      availableDays: req.body.availableDays ? JSON.parse(req.body.availableDays) : []
    };
    // Handle image upload
    if (req.file) {
      // Delete old image if it exists and is from our uploads
      if (optician.image && optician.image.includes('/uploads/')) {
        const oldImagePath = path.join(__dirname, '../../uploads', path.basename(optician.image));
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
      
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      updateData.image = `${baseUrl}/api/opticians/uploads/${req.file.filename}`;
    }

    const updatedOptician = await Optician.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(optician);
  } catch (error) {
    console.error('Error updating optician:', error);
    
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
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
    // Delete associated image
    if (optician.image && optician.image.includes('/uploads/')) {
      const imagePath = path.join(__dirname, '../../uploads', path.basename(optician.image));
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image file:', err);
      });
    }
    await Optician.findByIdAndDelete(req.params.id);
    res.json({ message: 'Optician deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
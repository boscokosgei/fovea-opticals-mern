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

module.exports = router;
// backend/src/routes/services.js
const express = require('express');
const Service = require('../models/Service');
const router = express.Router();

// GET all services
router.get('/', async (req, res) => {
  try {
    console.log('📋 Fetching all services...');
    const services = await Service.find().sort({ name: 1 });
    console.log(`✅ Found ${services.length} services`);
    res.json(services);
  } catch (error) {
    console.error('❌ Error fetching services:', error);
    res.status(500).json({ 
      error: 'Failed to fetch services',
      details: error.message 
    });
  }
});

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: error.message });
  }
});

// CREATE service (for admin/seeding)
router.post('/', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
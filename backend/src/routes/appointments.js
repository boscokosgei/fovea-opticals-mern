// backend/src/routes/appointments.js
const express = require('express');
const Appointment = require('../models/Appointment');
const router = express.Router();

// GET all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('service')
      .populate('optician')
      .sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: error.message });
  }
});

// CREATE appointment
router.post('/', async (req, res) => {
  try {
    console.log('📅 Creating new appointment:', req.body);
    const appointment = new Appointment(req.body);
    await appointment.save();
    
    // Populate the saved appointment with service and optician details
    await appointment.populate('service');
    await appointment.populate('optician');
    
    console.log('✅ Appointment created successfully');
    res.status(201).json(appointment);
  } catch (error) {
    console.error('❌ Error creating appointment:', error);
    res.status(400).json({ 
      error: 'Failed to create appointment',
      details: error.message 
    });
  }
});

module.exports = router;
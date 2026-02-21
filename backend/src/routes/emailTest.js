const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

// Test registration email
router.post('/test-registration', async (req, res) => {
  try {
    const result = await emailService.sendRegistrationNotification({
      name: 'Test User',
      email: 'test@example.com',
      phone: '+254712345678'
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Test registration email sent to info@foveaopticals.com'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test appointment email
router.post('/test-appointment', async (req, res) => {
  try {
    const result = await emailService.sendAppointmentNotification({
      clientName: 'Test Client',
      clientEmail: 'test@example.com',
      clientPhone: '+254712345678',
      date: 'Monday, December 23, 2024',
      time: '10:30 AM',
      service: 'Comprehensive Eye Exam',
      optician: 'Dr. Smith',
      notes: 'First time patient'
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Test appointment email sent to info@foveaopticals.com'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test client confirmation
router.post('/test-confirmation', async (req, res) => {
  try {
    const result = await emailService.sendClientConfirmation('test@example.com', {
      clientName: 'Test Client',
      date: 'Monday, December 23, 2024',
      time: '10:30 AM',
      service: 'Comprehensive Eye Exam',
      optician: 'Dr. Smith'
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Test confirmation email sent to test@example.com'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
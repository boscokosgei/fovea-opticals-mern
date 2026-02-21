const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');
const simpleEmailService = require('../services/emailServiceSimple'); 


// Simple test Route
router.get('/simple-test', async (req, res) => {
  try {
    console.log('📧 Simple test endpoint called');
    const result = await simpleEmailService.sendTest();
    res.json(result);
  } catch (error) {
    console.error('❌ Simple test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    });
  }
});
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
// router.post('/test-appointment', async (req, res) => {
//   try {
//     const result = await emailService.sendAppointmentNotification({
//       clientName: 'Test Client',
//       clientEmail: 'test@example.com',
//       clientPhone: '+254712345678',
//       date: 'Monday, December 23, 2024',
//       time: '10:30 AM',
//       service: 'Comprehensive Eye Exam',
//       optician: 'Dr. Smith',
//       notes: 'First time patient'
//     });

//     if (result.success) {
//       res.json({
//         success: true,
//         message: 'Test appointment email sent to info@foveaopticals.com'
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         error: result.error
//       });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// backend/src/routes/emailTest.js - UPDATE THIS
router.post('/test-appointment', async (req, res) => {
  try {
    console.log('📧 Test appointment email requested');
    
    const result = await emailService.sendAppointmentNotification({
      clientName: 'Test Client',
      clientEmail: 'test@example.com',
      clientPhone: '+254712345678',
      date: 'Monday, February 22, 2026',
      time: '10:30 AM',
      service: 'Comprehensive Eye Exam',
      optician: 'Dr. Smith',
      notes: 'Test from debugging'
    });
    
    console.log('Email result:', result);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Test email sent',
        data: result 
      });
    } else {
      // Send the actual error back
      res.status(500).json({ 
        success: false, 
        error: result.error,
        details: result 
      });
    }
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    });
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
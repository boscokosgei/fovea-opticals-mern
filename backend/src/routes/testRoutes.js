// backend/src/routes/testRoutes.js
const express = require('express');
const router = express.Router();
const { sendNewClientNotification } = require('../services/emailService');

// Test endpoint: POST /api/test/email
router.post('/email', async (req, res) => {
  try {
    const result = await sendNewClientNotification({
      _id: 'test_123',
      name: 'Test Client',
      email: 'test@example.com',
      phone: '+254712345678'
    });
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Test email sent successfully to info@foveaopticals.com',
        details: result 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send email',
        error: result.error,
        code: result.code 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router;
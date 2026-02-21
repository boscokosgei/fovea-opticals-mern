const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');


// Add to backend/src/routes/emailTest.js
router.get('/diagnose', async (req, res) => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      ZOHO_EMAIL: process.env.ZOHO_EMAIL ? '✅ Set' : '❌ Missing',
      ZOHO_APP_PASSWORD: process.env.ZOHO_APP_PASSWORD ? '✅ Set' : '❌ Missing',
      NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL ? '✅ Set' : '❌ Missing'
    },
    smtpTests: {},
    auth: null
  };

  const net = require('net');
  const nodemailer = require('nodemailer');

  // Test SMTP connectivity
  const smtpServers = [
    { host: 'smtp.zoho.com', port: 465, name: 'Zoho Main SSL' },
    { host: 'smtp.zoho.com', port: 587, name: 'Zoho Main TLS' },
    { host: 'smtppro.zoho.com', port: 465, name: 'Zoho Pro SSL' }
  ];

  for (const server of smtpServers) {
    try {
      await new Promise((resolve, reject) => {
        const socket = net.createConnection(server.port, server.host);
        socket.setTimeout(5000);
        socket.once('connect', () => { socket.destroy(); resolve(); });
        socket.once('timeout', () => { socket.destroy(); reject(new Error('Timeout')); });
        socket.once('error', reject);
      });
      diagnostics.smtpTests[server.name] = '✅ Reachable';
    } catch (error) {
      diagnostics.smtpTests[server.name] = `❌ ${error.message}`;
    }
  }

  // Test authentication (non-blocking)
  if (process.env.ZOHO_EMAIL && process.env.ZOHO_APP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.ZOHO_EMAIL,
          pass: process.env.ZOHO_APP_PASSWORD
        },
        connectionTimeout: 5000
      });
      await transporter.verify();
      diagnostics.auth = '✅ Authentication successful';
    } catch (error) {
      diagnostics.auth = `❌ ${error.message}`;
    }
  }

  res.json(diagnostics);
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
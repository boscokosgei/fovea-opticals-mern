const User = require('../models/User');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService'); // ADD THIS LINE

// ... existing code ...

// UPDATE YOUR REGISTER FUNCTION
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      role: role || 'client'
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 🎯 SEND REGISTRATION NOTIFICATION EMAIL (non-blocking)
    emailService.sendRegistrationNotification({
      name: user.name,
      email: user.email,
      phone: user.phone
    }).then(result => {
      if (result.success) {
        console.log(`✅ Registration email sent for: ${user.email}`);
      } else {
        console.log(`⚠️ Registration email failed:`, result.error);
      }
    }).catch(err => {
      console.error('Email error (non-blocking):', err);
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};
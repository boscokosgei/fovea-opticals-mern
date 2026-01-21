// Add at the top
const { sendNewClientNotification } = require('../services/emailService');

// In your register function, AFTER user is saved:
const register = async (req, res) => {
  try {
    // ... your existing registration code ...
    
    // After user is successfully saved:
    const newUser = await user.save();
    const token = generateToken(newUser._id);
    
    // 🎯 SEND EMAIL NOTIFICATION (non-blocking)
    sendNewClientNotification({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone
    }).then(emailResult => {
      if (emailResult.success) {
        console.log(`📧 Email sent for new client: ${newUser.email}`);
      } else {
        console.log(`⚠️ Email failed (registration still successful):`, emailResult.error);
        // Log to database or error tracking service if needed
      }
    }).catch(emailError => {
      console.error('⚠️ Email promise rejected:', emailError);
      // Don't throw - registration should succeed even if email fails
    });
    
    // Send response to client immediately
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
    
  } catch (error) {
    // ... your existing error handling ...
  }
};
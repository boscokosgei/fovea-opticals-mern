const Appointment = require('../models/Appointment');
const User = require('../models/User');
const emailService = require('../services/emailService'); // ADD THIS LINE

// CREATE APPOINTMENT
exports.createAppointment = async (req, res) => {
  try {
    const { date, time, service, optician, notes } = req.body;
    const userId = req.user.id;

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      date,
      time,
      optician,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Create appointment
    const appointment = new Appointment({
      user: userId,
      date,
      time,
      service,
      optician,
      notes,
      status: 'confirmed'
    });

    await appointment.save();

    // Format date for email
    const formattedDate = new Date(date).toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // 🎯 SEND TWO EMAILS (both non-blocking)
    const appointmentData = {
      clientName: user.name,
      clientEmail: user.email,
      clientPhone: user.phone,
      date: formattedDate,
      time: time,
      service: service,
      optician: optician || 'Any available',
      notes: notes || '',
      bookingId: appointment._id.toString().slice(-6)
    };

    // 1. Send notification to admin (info@foveaopticals.com)
    emailService.sendAppointmentNotification(appointmentData)
      .then(result => {
        if (result.success) {
          console.log(`✅ Admin notified for appointment: ${user.name}`);
        }
      })
      .catch(err => console.error('Admin email error:', err));

    // 2. Send confirmation to client
    emailService.sendClientConfirmation(user.email, appointmentData)
      .then(result => {
        if (result.success) {
          console.log(`✅ Confirmation sent to: ${user.email}`);
        }
      })
      .catch(err => console.error('Client email error:', err));

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully. Check your email for confirmation.',
      appointment: {
        id: appointment._id,
        date: appointment.date,
        time: appointment.time,
        service: appointment.service,
        status: appointment.status
      }
    });

  } catch (error) {
    console.error('Appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking appointment',
      error: error.message
    });
  }
};
// backend/src/services/emailServiceSimple.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@foveaopticals.com',
    pass: process.env.ZOHO_APP_PASSWORD // Add this to Render
  }
});

const sendAppointmentEmail = async (appointmentData) => {
  try {
    await transporter.sendMail({
      from: '"Fovea Optical" <info@foveaopticals.com>',
      to: 'info@foveaopticals.com',
      subject: `New Appointment: ${appointmentData.clientName}`,
      html: `<h1>New Appointment</h1><p>${appointmentData.clientName} booked an appointment.</p>`
    });
    
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendAppointmentEmail };
// backend/src/services/emailService.js - ENHANCED VERSION
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.initialized = false;
    this.transporter = null;
    this.fallbackTransporter = null;
    this.initTransporter();
  }

  initTransporter() {
    try {
      // Primary transporter (Zoho)
      this.transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.ZOHO_EMAIL,
          pass: process.env.ZOHO_APP_PASSWORD
        },
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,
        socketTimeout: 10000,
        debug: true // Enable debug logs
      });

      // Fallback transporter (alternative Zoho server)
      this.fallbackTransporter = nodemailer.createTransport({
        host: 'smtppro.zoho.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.ZOHO_EMAIL,
          pass: process.env.ZOHO_APP_PASSWORD
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000
      });

      this.initialized = true;
      console.log('✅ Email service initialized with Zoho SMTP');
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
    }
  }

  /**
   * Send email with retry logic
   */
  async sendMail(mailOptions, retryCount = 2) {
    if (!this.initialized) {
      return { success: false, error: 'Email service not initialized' };
    }

    let lastError = null;
    
    // Try primary transporter
    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        console.log(`📤 Attempt ${attempt} to send email via primary...`);
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`✅ Email sent (attempt ${attempt}):`, info.messageId);
        return { success: true, messageId: info.messageId };
      } catch (error) {
        lastError = error;
        console.log(`⚠️ Attempt ${attempt} failed:`, error.message);
        
        if (attempt < retryCount) {
          console.log(`⏳ Waiting 2 seconds before retry...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    // Try fallback transporter if primary fails
    if (this.fallbackTransporter) {
      try {
        console.log(`📤 Trying fallback SMTP server...`);
        const info = await this.fallbackTransporter.sendMail(mailOptions);
        console.log(`✅ Email sent via fallback:`, info.messageId);
        return { success: true, messageId: info.messageId };
      } catch (fallbackError) {
        console.log(`❌ Fallback also failed:`, fallbackError.message);
        lastError = fallbackError;
      }
    }

    console.error(`❌ All email attempts failed:`, lastError.message);
    return { 
      success: false, 
      error: lastError.message,
      code: lastError.code 
    };
  }

  /**
   * Send registration notification to admin
   */
  async sendRegistrationNotification(userData) {
    const mailOptions = {
      from: `"Fovea Optical" <${process.env.ZOHO_EMAIL}>`,
      to: process.env.NOTIFICATION_EMAIL || 'info@foveaopticals.com',
      subject: `🎉 New User Registered: ${userData.name}`,
      html: this.getRegistrationHTML(userData)
    };

    return this.sendMail(mailOptions);
  }

  /**
   * Send appointment notification to admin
   */
  async sendAppointmentNotification(appointmentData) {
    const mailOptions = {
      from: `"Fovea Optical" <${process.env.ZOHO_EMAIL}>`,
      to: process.env.NOTIFICATION_EMAIL || 'info@foveaopticals.com',
      subject: `📅 New Appointment: ${appointmentData.clientName}`,
      html: this.getAppointmentHTML(appointmentData)
    };

    return this.sendMail(mailOptions);
  }

  /**
   * Send confirmation email to client
   */
  async sendClientConfirmation(clientEmail, appointmentData) {
    const mailOptions = {
      from: `"Fovea Optical" <${process.env.ZOHO_EMAIL}>`,
      to: clientEmail,
      subject: `✅ Your Appointment Confirmation - Fovea Optical`,
      html: this.getClientConfirmationHTML(appointmentData)
    };

    return this.sendMail(mailOptions);
  }

  // HTML templates (keep your existing templates here)
  getRegistrationHTML(userData) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>🎉 New User Registration</h2>
        <p><strong>Name:</strong> ${userData.name}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Phone:</strong> ${userData.phone || 'Not provided'}</p>
        <p><strong>Registered:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p><em>Automated from Fovea Optical</em></p>
      </div>
    `;
  }

  getAppointmentHTML(appointmentData) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>📅 New Appointment Booking</h2>
        <p><strong>Client:</strong> ${appointmentData.clientName}</p>
        <p><strong>Email:</strong> ${appointmentData.clientEmail}</p>
        <p><strong>Phone:</strong> ${appointmentData.clientPhone || 'Not provided'}</p>
        <p><strong>Date:</strong> ${appointmentData.date}</p>
        <p><strong>Time:</strong> ${appointmentData.time}</p>
        <p><strong>Service:</strong> ${appointmentData.service}</p>
        <p><strong>Optician:</strong> ${appointmentData.optician || 'Any'}</p>
        ${appointmentData.notes ? `<p><strong>Notes:</strong> ${appointmentData.notes}</p>` : ''}
        <hr>
        <p><em>Automated from Fovea Optical</em></p>
      </div>
    `;
  }

  getClientConfirmationHTML(appointmentData) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>✅ Appointment Confirmed</h2>
        <p>Dear ${appointmentData.clientName},</p>
        <p>Your appointment at <strong>Fovea Optical</strong> has been confirmed:</p>
        <p><strong>Date:</strong> ${appointmentData.date}</p>
        <p><strong>Time:</strong> ${appointmentData.time}</p>
        <p><strong>Service:</strong> ${appointmentData.service}</p>
        ${appointmentData.optician ? `<p><strong>Optician:</strong> ${appointmentData.optician}</p>` : ''}
        <hr>
        <p>Thank you for choosing Fovea Optical!</p>
      </div>
    `;
  }
}

module.exports = new EmailService();
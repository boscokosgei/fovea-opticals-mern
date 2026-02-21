// backend/src/services/emailService.js
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_APP_PASSWORD
      }
    });
    console.log('✅ Email service initialized');
  }

  /**
   * Send registration notification to admin
   */
  async sendRegistrationNotification(userData) {
    try {
      const mailOptions = {
        from: `"Fovea Optical" <${process.env.ZOHO_EMAIL}>`,
        to: process.env.NOTIFICATION_EMAIL,
        subject: `🎉 New User Registered: ${userData.name}`,
        html: this.getRegistrationHTML(userData)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Registration email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Registration email failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send appointment booking notification to admin
   */
  async sendAppointmentNotification(appointmentData) {
    try {
      const mailOptions = {
        from: `"Fovea Optical" <${process.env.ZOHO_EMAIL}>`,
        to: process.env.NOTIFICATION_EMAIL,
        subject: `📅 New Appointment: ${appointmentData.clientName}`,
        html: this.getAppointmentHTML(appointmentData)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Appointment email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Appointment email failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send confirmation email to client (optional)
   */
  async sendClientConfirmation(clientEmail, appointmentData) {
    try {
      const mailOptions = {
        from: `"Fovea Optical" <${process.env.ZOHO_EMAIL}>`,
        to: clientEmail,
        subject: `✅ Your Appointment Confirmation - Fovea Optical`,
        html: this.getClientConfirmationHTML(appointmentData)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Client confirmation sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Client confirmation failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * HTML template for registration notification
   */
  getRegistrationHTML(userData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; }
          .header { background: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #F8FAFC; padding: 25px; border-radius: 0 0 8px 8px; }
          .details { background: white; border-radius: 6px; padding: 20px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 10px 0; border-bottom: 1px solid #E2E8F0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 style="margin: 0;">🎉 New User Registration</h2>
          <p style="margin: 5px 0 0 0;">Fovea Optical Website</p>
        </div>
        
        <div class="content">
          <p><strong>A new user has registered on the website:</strong></p>
          
          <div class="details">
            <h3 style="margin-top: 0;">User Details</h3>
            <table>
              <tr><td><strong>Name:</strong></td><td>${userData.name}</td></tr>
              <tr><td><strong>Email:</strong></td><td><a href="mailto:${userData.email}">${userData.email}</a></td></tr>
              <tr><td><strong>Phone:</strong></td><td>${userData.phone || 'Not provided'}</td></tr>
              <tr><td><strong>Registered:</strong></td><td>${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}</td></tr>
            </table>
          </div>
          
          <a href="mailto:${userData.email}" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reply to User</a>
          
          <div style="margin-top: 30px; color: #64748B; font-size: 14px;">
            <p><em>This is an automated notification from your Fovea Optical website.</em></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * HTML template for appointment notification
   */
  getAppointmentHTML(appointmentData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; }
          .header { background: #10B981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #F0FDF4; padding: 25px; border-radius: 0 0 8px 8px; }
          .details { background: white; border-radius: 6px; padding: 20px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 10px 0; border-bottom: 1px solid #E2E8F0; }
          .urgent { background: #FEF3C7; padding: 10px; border-radius: 6px; border-left: 4px solid #F59E0B; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 style="margin: 0;">📅 New Appointment Booking</h2>
          <p style="margin: 5px 0 0 0;">Fovea Optical</p>
        </div>
        
        <div class="content">
          <p><strong>A new appointment has been booked:</strong></p>
          
          <div class="details">
            <h3 style="margin-top: 0;">Appointment Details</h3>
            <table>
              <tr><td><strong>Client:</strong></td><td>${appointmentData.clientName}</td></tr>
              <tr><td><strong>Email:</strong></td><td><a href="mailto:${appointmentData.clientEmail}">${appointmentData.clientEmail}</a></td></tr>
              <tr><td><strong>Phone:</strong></td><td>${appointmentData.clientPhone || 'Not provided'}</td></tr>
              <tr><td><strong>Date:</strong></td><td>${appointmentData.date}</td></tr>
              <tr><td><strong>Time:</strong></td><td>${appointmentData.time}</td></tr>
              <tr><td><strong>Service:</strong></td><td>${appointmentData.service}</td></tr>
              <tr><td><strong>Optician:</strong></td><td>${appointmentData.optician || 'Any available'}</td></tr>
              ${appointmentData.notes ? `<tr><td><strong>Notes:</strong></td><td>${appointmentData.notes}</td></tr>` : ''}
            </table>
          </div>
          
          <div style="margin-top: 30px; color: #64748B; font-size: 14px;">
            <p><em>Automated notification from Fovea Optical booking system</em></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * HTML template for client confirmation
   */
  getClientConfirmationHTML(appointmentData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background: #10B981; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #F0FDF4; padding: 30px; border-radius: 0 0 8px 8px; }
          .details { background: white; border-radius: 8px; padding: 25px; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #D1FAE5; color: #64748B; font-size: 14px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0;">✅ Appointment Confirmed</h1>
        </div>
        
        <div class="content">
          <p>Dear ${appointmentData.clientName},</p>
          <p>Your appointment at <strong>Fovea Optical</strong> has been confirmed.</p>
          
          <div class="details">
            <h3 style="margin-top: 0; color: #059669;">Appointment Details</h3>
            <p><strong>Date:</strong> ${appointmentData.date}</p>
            <p><strong>Time:</strong> ${appointmentData.time}</p>
            <p><strong>Service:</strong> ${appointmentData.service}</p>
            ${appointmentData.optician ? `<p><strong>Optician:</strong> ${appointmentData.optician}</p>` : ''}
            ${appointmentData.notes ? `<p><strong>Notes:</strong> ${appointmentData.notes}</p>` : ''}
          </div>
          
          <p><strong>Location:</strong><br>
          Fovea Optical<br>
          [Your Address Here]<br>
          Eldoret, Kenya</p>
          
          <p><strong>Need to reschedule?</strong><br>
          Call us at [Your Phone] or reply to this email.</p>
          
          <div class="footer">
            <p>We look forward to seeing you!</p>
            <p><strong>Fovea Optical</strong><br>
            Bringing Vision to Life</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
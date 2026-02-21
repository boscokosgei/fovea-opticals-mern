const emailjs = require('@emailjs/nodejs');

class EmailService {
  constructor() {
    this.serviceId = process.env.EMAILJS_SERVICE_ID;
    this.templateId = process.env.EMAILJS_TEMPLATE_ID;
    this.publicKey = process.env.EMAILJS_PUBLIC_KEY;
    this.privateKey = process.env.EMAILJS_PRIVATE_KEY;
  }

  async sendAppointmentNotification(appointmentData) {
    try {
      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        {
          to_email: 'info@foveaopticals.com',
          client_name: appointmentData.clientName,
          client_email: appointmentData.clientEmail,
          client_phone: appointmentData.clientPhone || 'Not provided',
          appointment_date: appointmentData.date,
          appointment_time: appointmentData.time,
          service: appointmentData.service,
          optician: appointmentData.optician || 'Any available'
        },
        {
          publicKey: this.publicKey,
          privateKey: this.privateKey,
        }
      );
      
      console.log('✅ Email sent via EmailJS:', response.text);
      return { success: true, data: response };
      
    } catch (error) {
      console.error('❌ EmailJS error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendRegistrationNotification(userData) {
    try {
      const response = await emailjs.send(
        this.serviceId,
        this.templateId, // You might want a different template
        {
          to_email: 'info@foveaopticals.com',
          client_name: userData.name,
          client_email: userData.email,
          client_phone: userData.phone || 'Not provided',
          registration_date: new Date().toLocaleString()
        },
        {
          publicKey: this.publicKey,
          privateKey: this.privateKey,
        }
      );
      
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
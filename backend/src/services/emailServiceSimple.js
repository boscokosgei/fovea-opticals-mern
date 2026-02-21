// backend/src/services/emailServiceSimple.js
const emailjs = require('@emailjs/nodejs');

class SimpleEmailService {
  async sendTest() {
    try {
      console.log('🔍 EmailJS Config Check:');
      console.log('- Service ID:', process.env.EMAILJS_SERVICE_ID ? '✅ Set' : '❌ Missing');
      console.log('- Template ID:', process.env.EMAILJS_TEMPLATE_ID ? '✅ Set' : '❌ Missing');
      console.log('- Public Key:', process.env.EMAILJS_PUBLIC_KEY ? '✅ Set' : '❌ Missing');
      console.log('- Private Key:', process.env.EMAILJS_PRIVATE_KEY ? '✅ Set' : '❌ Missing');

      const response = await emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID,
        {
          to_email: 'info@foveaopticals.com',
          from_name: 'Fovea Optical System',
          message: 'This is a test email from your Render backend',
          reply_to: 'info@foveaopticals.com'
        },
        {
          publicKey: process.env.EMAILJS_PUBLIC_KEY,
          privateKey: process.env.EMAILJS_PRIVATE_KEY,
        }
      );
      
      console.log('✅ EmailJS Success:', response);
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ EmailJS Error:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      return { success: false, error: error.message };
    }
  }
}

module.exports = new SimpleEmailService();
// backend/src/services/emailServiceSimple.js
const emailjs = require('@emailjs/nodejs');

class SimpleEmailService {
  async sendTest() {
    // Check all required variables first
    const required = ['EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID', 'EMAILJS_PUBLIC_KEY', 'EMAILJS_PRIVATE_KEY'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.error('❌ Missing environment variables:', missing);
      return { 
        success: false, 
        error: `Missing environment variables: ${missing.join(', ')}` 
      };
    }

    console.log('📤 Sending test email via EmailJS...');
    console.log('Using Service ID:', process.env.EMAILJS_SERVICE_ID);
    console.log('Using Template ID:', process.env.EMAILJS_TEMPLATE_ID);

    try {
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
      
      console.log('✅ EmailJS Success:', response.status, response.text);
      return { 
        success: true, 
        message: 'Email sent successfully',
        data: response 
      };
    } catch (error) {
      console.error('❌ EmailJS Detailed Error:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      
      return { 
        success: false, 
        error: error.message,
        details: error.response?.data || 'No additional details'
      };
    }
  }
}

module.exports = new SimpleEmailService();
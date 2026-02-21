// Create a temporary test file: backend/src/test-emailjs.js
const emailjs = require('@emailjs/nodejs');

async function testEmailJS() {
  try {
    console.log('Testing EmailJS with minimal config...');
    
    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email: 'info@foveaopticals.com',
        message: 'Test from Render',
        from_name: 'System Test'
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );
    
    console.log('✅ Success:', result);
    return true;
  } catch (error) {
    console.error('❌ Failed:', error);
    return false;
  }
}

testEmailJS();
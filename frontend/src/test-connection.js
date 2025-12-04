// frontend/src/test-connection.js
import axios from 'axios';

const testConnection = async () => {
  try {
    console.log('Testing connection to backend...');
    
    const response = await axios.get('http://localhost:5000/api/auth');
    console.log('Backend is reachable:', response.data);
    
    // Test registration
    const testData = {
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      password: "123456",
      phone: "0712345678"
    };
    
    console.log('Testing registration with:', testData);
    
    const regResponse = await axios.post('http://localhost:5000/api/auth/register', testData);
    console.log('Registration test successful:', regResponse.data);
    
  } catch (error) {
    console.error('Connection test failed:');
    console.log('Error:', error.message);
    console.log('Response:', error.response?.data);
    console.log('Status:', error.response?.status);
  }
};

// Run this in browser console
const axios = require('axios');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

async function getTokens() {
  console.log('🔑 Generating Zoho OAuth tokens...\n');
  
  // Get user input
  readline.question('Enter ZOHO_CLIENT_ID: ', (clientId) => {
    readline.question('Enter ZOHO_CLIENT_SECRET: ', async (clientSecret) => {
      readline.question('Enter authorization code (see Step 2 below): ', async (authCode) => {
        
        try {
          const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
            params: {
              code: authCode,
              client_id: clientId,
              client_secret: clientSecret,
              redirect_uri: 'https://foveaopticals.com', // Your domain
              grant_type: 'authorization_code'
            }
          });
          
          console.log('\n✅ TOKENS GENERATED SUCCESSFULLY!\n');
          console.log('========================================');
          console.log('ZOHO_ACCESS_TOKEN:', response.data.access_token);
          console.log('ZOHO_REFRESH_TOKEN:', response.data.refresh_token);
          console.log('========================================\n');
          console.log('Add these to your Render environment variables.');
          
        } catch (error) {
          console.error('\n❌ Error:', error.response?.data || error.message);
        }
        
        readline.close();
      });
    });
  });
}

getTokens();

// exchangeCode.js
const { google } = require('googleapis');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// 👇 Paste the code you got from the browser
const code = '4/0AVMBsJg7IRr5Rn6RhvzKApyjLeW2Y972QTWqqfwW1G4yoiPnfhY42__6115MyPsOyXPz6g';

oAuth2Client.getToken(code, (err, token) => {
  if (err) return console.error('❌ Error retrieving token', err);
  console.log('✅ Access Token:', token.access_token);
  console.log('🔁 Refresh Token:', token.refresh_token);
});
//http://localhost:3000/oauth2callback?code=4/0AVMBsJg7IRr5Rn6RhvzKApyjLeW2Y972QTWqqfwW1G4yoiPnfhY42__6115MyPsOyXPz6g&scope=https://www.googleapis.com/auth/calendar
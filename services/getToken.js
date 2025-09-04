// getToken.js
require('dotenv').config(); // ✅ Load .env file

console.log('🔍 DEBUG: Checking env values...');
console.log('CLIENT_ID:', process.env.CLIENT_ID);
console.log('CLIENT_SECRET:', process.env.CLIENT_SECRET);
console.log('REDIRECT_URI:', process.env.REDIRECT_URI);

const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);



const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent',
});

console.log('\n🔗 Visit this URL to authorize your app:\n', authUrl);

// utils/emailTemplate.js
function resetPasswordEmailTemplate(email, resetLink, language = "en") {
  const content = {
    en: {
      greeting: `Hi ${email},`,
      instruction: "You requested to reset your password. Click the button below. This link will expire in 10 minutes.",
      button: "Reset Password",
      ignore: "If you didn’t request this, you can ignore this email.",
      wishes: "Best wishes,",
      company: "Amariatek Team"
    },
    hi: {
      greeting: `नमस्ते ${email},`,
      instruction: "आपने पासवर्ड रीसेट करने का अनुरोध किया है। नीचे दिए गए बटन पर क्लिक करें। यह लिंक 10 मिनट में समाप्त हो जाएगा।",
      button: "पासवर्ड रीसेट करें",
      ignore: "यदि आपने अनुरोध नहीं किया, तो आप इसे अनदेखा कर सकते हैं।",
      wishes: "शुभकामनाएँ,",
      company: "YourAppName टीम"
    }
  };

  const t = content[language] || content.en;

  return `
    <div style="font-family: Arial; background-color: #f4f4f4; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px;">
        <div style="text-align: center;">
          <img src="https://yourdomain.com/logo.png" style="height: 60px;" alt="Logo" />
        </div>
        <h2>${t.greeting}</h2>
        <p>${t.instruction}</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" style="padding: 12px 25px; background: #007BFF; color: white; text-decoration: none; border-radius: 5px;">
            ${t.button}
          </a>
        </div>
        <p>${t.ignore}</p>
        <hr/>
        <p>${t.wishes}<br><strong>${t.company}</strong></p>
      </div>
    </div>
  `;
}

module.exports = resetPasswordEmailTemplate;

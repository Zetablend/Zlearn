// controllers/authController.js
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const transporter = require('../../config/mail');
const { User } = require('../../models');
const resetPasswordEmailTemplate = require('../../utility/emailTemplate');

exports.forgotPassword = async (req, res) => {
  const user = req.user;
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = Date.now() + 10 * 60 * 1000; // 10 min

  user.resetToken = token;
  user.resetTokenExpiry = new Date(expiry);
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Reset Your Password",
    html: resetPasswordEmailTemplate(user.email, resetLink, "en"), // or "hi"
  });

  res.json({ message: "Reset link sent to your email" });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    where: {
      resetToken: token,
      resetTokenExpiry: { [Op.gt]: new Date() },
    },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  res.json({ message: "Password reset successfully" });
};

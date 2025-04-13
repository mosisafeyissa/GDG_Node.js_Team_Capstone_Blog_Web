//path to this file is src/services/sendEmail.js
const sendResetEmail = (email, resetToken) => {
  console.log(`Password reset link: http://frontend.com/reset-password?token=${resetToken}`);
  console.log(`Sent to: ${email}`);
};

module.exports = sendResetEmail; 
//path to this file is src/services/generatePasswordResetToken.js
const crypto = require('crypto');

const generatePasswordResetToken = () => {
  const resetToken = crypto.randomBytes(20).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const expiresAt = Date.now() + 3600000; 
  return { resetToken, hashedToken, expiresAt };
};

module.exports = { generatePasswordResetToken };
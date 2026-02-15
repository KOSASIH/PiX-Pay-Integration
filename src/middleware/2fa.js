const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');
const winston = require('winston');

const logger = winston.createLogger({ level: 'info', transports: [new winston.transports.Console()] });

const require2FA = async (req, res, next) => {
  const config = require('../../config/' + (process.env.NODE_ENV || 'development'));
  if (!config.enable2FA) return next();

  const user = req.user;
  if (!user.twoFactorSecret) {
    return res.status(403).send({ error: '2FA not set up' });
  }

  const token = req.headers['x-2fa-token'];
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token
  });

  if (!verified) {
    return res.status(401).send({ error: 'Invalid 2FA token' });
  }

  next();
};

const setup2FA = async (req, res) => {
  const user = req.user;
  const secret = speakeasy.generateSecret({ name: 'PiX Pay', issuer: 'KOSASIH' });
  user.twoFactorSecret = secret.base32;
  await user.save();

  qrcode.toDataURL(secret.otpauth_url, (err, qrCodeUrl) => {
    if (err) return res.status(500).send({ error: 'QR code generation failed' });
    res.send({ secret: secret.base32, qrCodeUrl });
  });
};

module.exports = { require2FA, setup2FA };

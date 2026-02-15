module.exports = {
  port: 3000,
  mongoUri: 'mongodb://localhost:27017/pixpay',
  jwtSecret: 'dev_secret',
  piApiKey: 'dev_pi_key',
  xApiKey: 'dev_x_key',
  openaiApiKey: 'dev_openai_key',
  rateLimit: { windowMs: 15 * 60 * 1000, max: 100 },
  logging: { level: 'info', file: 'logs/dev.log' },
  corsOrigin: ['http://localhost:3000'],
  enable2FA: false,
  monitoring: false
};

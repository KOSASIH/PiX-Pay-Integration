const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const AdvancedAIEngine = require('../ai/advanced-ai-engine');
const { auth, require2FA } = require('../middleware/auth');
const winston = require('winston');

const logger = winston.createLogger({ level: 'info', transports: [new winston.transports.Console()] });
const router = new express.Router();
const aiEngine = new AdvancedAIEngine();

// Middleware: Admin check (simple role-based)
const isAdmin = (req, res, next) => {
  if (req.user.username !== 'admin') return res.status(403).send({ error: 'Admin access required' });
  next();
};

router.get('/users', auth, require2FA, isAdmin, async (req, res) => {
  const users = await User.find().select('-password');
  res.send(users);
});

router.post('/bulk-tip', auth, require2FA, isAdmin, async (req, res) => {
  const { recipients, amount } = req.body;
  const results = [];
  for (const recipientId of recipients) {
    const tx = new Transaction({ fromUser: req.user._id, toUser: recipientId, amount, type: 'bulk' });
    await tx.save();
    results.push(tx);
  }
  logger.info(`Bulk tip sent to ${recipients.length} users`);
  res.send({ results });
});

router.get('/analytics', auth, require2FA, isAdmin, async (req, res) => {
  const anomalies = await aiEngine.anomalyDetection(await Transaction.find().limit(100));
  res.send({ anomalies });
});

router.post('/train-ai', auth, require2FA, isAdmin, async (req, res) => {
  await aiEngine.trainModel();
  res.send({ message: 'AI model trained' });
});

module.exports = router;

const express = require('express');
const XClient = require('../x-api/x-client');
const WalletManager = require('../wallet/wallet-manager');
const AIEngine = require('../ai/ai-engine');
const User = require('../models/User');
const winston = require('winston');

const logger = winston.createLogger({ level: 'info', transports: [new winston.transports.Console()] });
const router = new express.Router();
const xClient = new XClient();
const walletManager = new WalletManager();
const aiEngine = new AIEngine();

router.post('/x', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-twitter-webhooks-signature'];
    const payload = JSON.parse(req.body);
    const result = await xClient.handleWebhook(payload, signature);
    if (result.processed && payload.tweet_create_events) {
      // Trigger mining for tweet engagement
      const user = await User.findOne({ xUserId: payload.for_user_id });
      if (user) {
        const reward = 0.01; // Base reward
        await walletManager.updateBalance(user._id, reward);
        logger.info(`Webhook mining reward for user ${user._id}: ${reward}`);
      }
    }
    res.status(200).send('OK');
  } catch (error) {
    logger.error('Webhook processing failed:', error);
    res.status(400).send('Error');
  }
});

module.exports = router;

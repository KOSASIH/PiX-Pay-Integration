const express = require('express');
const WalletManager = require('../wallet/wallet-manager');
const AIEngine = require('../ai/ai-engine');
const { auth } = require('../middleware/auth');
const winston = require('winston');

const logger = winston.createLogger({ level: 'info', transports: [new winston.transports.Console()] });
const router = new express.Router();
const walletManager = new WalletManager();
const aiEngine = new AIEngine();

router.post('/link', auth, async (req, res) => {
  const result = await walletManager.linkAccounts(req.user._id, req.body.piUserId, req.body.xUserId);
  if (result.success) {
    logger.info(`Wallet linked for user ${req.user._id}`);
  }
  res.send(result);
});

router.get('/balance', auth, async (req, res) => {
  try {
    const balance = await walletManager.getBalance(req.user._id);
    res.send({ balance });
  } catch (error) {
    logger.error('Balance fetch failed:', error);
    res.status(500).send({ error: error.message });
  }
});

router.post('/mine', auth, async (req, res) => {
  try {
    const user = req.user;
    const tweets = await require('../x-api/x-client').prototype.getUserTweets(user.xUserId);
    const engagement = require('../x-api/x-client').prototype.calculateEngagement(tweets);
    const aiPrediction = (await aiEngine.predictTrends(user._id)).predictedNextTip;
    const reward = require('../pi-integration/pi-client').prototype.calculateMiningReward(engagement, aiPrediction);
    await walletManager.updateBalance(user._id, reward);
    logger.info(`Mining reward for user ${user._id}: ${reward}`);
    res.send({ reward, engagement });
  } catch (error) {
    logger.error('Mining failed:', error);
    res.status(500).send({ error: 'Mining failed' });
  }
});

module.exports = router;

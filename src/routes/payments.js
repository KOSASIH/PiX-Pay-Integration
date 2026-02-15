const express = require('express');
const TransactionHandler = require('../payments/transaction-handler');
const AIEngine = require('../ai/ai-engine');
const { auth } = require('../middleware/auth');
const winston = require('winston');

const logger = winston.createLogger({ level: 'info', transports: [new winston.transports.Console()] });
const router = new express.Router();
const txHandler = new TransactionHandler();
const aiEngine = new AIEngine();

router.post('/tip', auth, async (req, res) => {
  const fraudCheck = await aiEngine.detectFraud(req.body);
  if (fraudCheck.flag) return res.status(403).send({ error: 'Transaction flagged as risky', risk: fraudCheck.risk });
  const result = await txHandler.processTip(req.user._id, req.body.toUserId, req.body.amount, req.body.tweetId);
  if (result.success) {
    logger.info(`Tip sent by user ${req.user._id}`);
  }
  res.send(result);
});

router.get('/history', auth, async (req, res) => {
  const history = await txHandler.getTransactionHistory(req.user._id);
  res.send(history);
});

router.post('/suggest', auth, async (req, res) => {
  const suggestion = await aiEngine.suggestPayment({ userId: req.user._id, ...req.body.userData }, req.body.tweetContent);
  res.send({ suggestion });
});

router.get('/report', auth, async (req, res) => {
  const report = await aiEngine.generateReport(req.user._id);
  res.send({ report });
});

module.exports = router;

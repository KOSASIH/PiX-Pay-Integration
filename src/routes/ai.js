const express = require('express');
const NLPEngine = require('../ai/nlp-engine');
const Chatbot = require('../ai/chatbot');
const MarketPredictor = require('../ai/market-predictor');
const DynamicPricing = require('../ai/dynamic-pricing');
const PiVerifier = require('../ai/pi-verifier');
const { auth } = require('../middleware/auth');
const winston = require('winston');

const logger = winston.createLogger({ level: 'info', transports: [new winston.transports.Console()] });
const router = new express.Router();
const nlpEngine = new NLPEngine();
const chatbot = new Chatbot();
const marketPredictor = new MarketPredictor();
const dynamicPricing = new DynamicPricing();
const piVerifier = new PiVerifier();

// Existing routes
router.post('/sentiment', auth, async (req, res) => {
  const { text } = req.body;
  const result = await nlpEngine.analyzeSentiment(text);
  res.send(result);
});

router.post('/chat', auth, async (req, res) => {
  const { message } = req.body;
  const reply = await chatbot.respond(req.user._id, message);
  res.send({ reply });
});

router.get('/market-trend', auth, async (req, res) => {
  const trend = await marketPredictor.predictTrend();
  res.send(trend);
});

router.post('/dynamic-price', auth, async (req, res) => {
  const { engagement, timeOfDay, demand } = req.body;
  const price = await dynamicPricing.calculatePrice(engagement, timeOfDay, demand);
  res.send({ price });
});

router.post('/train-models', auth, async (req, res) => {
  if (req.user.username !== 'admin') return res.status(403).send({ error: 'Admin only' });
  await marketPredictor.trainOnHistoricalData();
  await dynamicPricing.trainPricingModel(req.body.trainingData || []);
  res.send({ message: 'Models trained' });
});

// New PiVerifier routes for autonomous regulation
router.post('/verify-pi', auth, async (req, res) => {
  const { piId, origin, history } = req.body;
  const result = await piVerifier.verifyPiOrigin(piId, origin, history);
  res.send(result);
});

router.get('/stable-value', auth, async (req, res) => {
  res.send({ value: piVerifier.getStableValue() });
});

router.post('/monitor', auth, async (req, res) => {
  const { transactions } = req.body;
  await piVerifier.monitorTransactions(transactions);
  res.send({ message: 'Monitoring completed autonomously' });
});

router.get('/insights', auth, async (req, res) => {
  const insights = piVerifier.getInsights();
  res.send(insights);
});

router.post('/flag-source', auth, async (req, res) => {
  if (req.user.username !== 'admin') return res.status(403).send({ error: 'Admin only' });
  const { hash, flag } = req.body;
  piVerifier.flagSource(hash, flag);
  res.send({ message: 'Source flagged/unflagged autonomously' });
});

module.exports = router;

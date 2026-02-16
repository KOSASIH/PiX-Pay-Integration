const express = require('express');
const NLPEngine = require('../ai/nlp-engine');
const Chatbot = require('../ai/chatbot');
const MarketPredictor = require('../ai/market-predictor');
const DynamicPricing = require('../ai/dynamic-pricing');
const { auth } = require('../middleware/auth');
const winston = require('winston');

const logger = winston.createLogger({ level: 'info', transports: [new winston.transports.Console()] });
const router = new express.Router();
const nlpEngine = new NLPEngine();
const chatbot = new Chatbot();
const marketPredictor = new MarketPredictor();
const dynamicPricing = new DynamicPricing();

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

module.exports = router;

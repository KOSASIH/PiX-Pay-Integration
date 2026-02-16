const tf = require('@tensorflow/tfjs-node');
const axios = require('axios');
const winston = require('winston');

const logger = winston.createLogger({ level: 'info', transports: [new winston.transports.Console()] });

class MarketPredictor {
  constructor() {
    this.model = null;
    this.loadModel();
  }

  async loadModel() {
    this.model = tf.sequential();
    this.model.add(tf.layers.lstm({ inputShape: [10, 1], units: 50, returnSequences: true })); // Time series for price prediction
    this.model.add(tf.layers.lstm({ units: 50 }));
    this.model.add(tf.layers.dense({ units: 1 }));
    this.model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
    logger.info('Market prediction model loaded');
  }

  async fetchPiData() {
    // Simulate fetching Pi Coin price data (replace with real API)
    const prices = Array.from({ length: 100 }, () => Math.random() * 0.1 + 0.01); // Mock data
    return prices;
  }

  async predictTrend() {
    const data = await this.fetchPiData();
    const xs = tf.tensor2d([data.slice(0, 10)], [1, 10, 1]);
    const prediction = this.model.predict(xs).dataSync()[0];
    logger.info(`Predicted Pi trend: ${prediction}`);
    return { predictedPrice: prediction, trend: prediction > data[data.length - 1] ? 'up' : 'down' };
  }

  async trainOnHistoricalData() {
    const data = await this.fetchPiData();
    const xs = tf.tensor2d(data.slice(0, 90).map((_, i) => data.slice(i, i + 10)), [80, 10, 1]);
    const ys = tf.tensor1d(data.slice(10, 90));
    await this.model.fit(xs, ys, { epochs: 10 });
    logger.info('Market model trained');
  }
}

module.exports = MarketPredictor;

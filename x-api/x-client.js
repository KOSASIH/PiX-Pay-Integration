const { TwitterApi } = require('twitter-api-v2');
const winston = require('winston');
const crypto = require('crypto');
require('dotenv').config();

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/x.log' })
  ]
});

class XClient {
  constructor() {
    this.client = new TwitterApi({
      appKey: process.env.X_API_KEY,
      appSecret: process.env.X_API_SECRET,
      accessToken: process.env.X_BEARER_TOKEN,
    });
    this.rwClient = this.client.readWrite;
  }

  async getUserTweets(userId, count = 10) {
    try {
      const tweets = await this.client.v2.userTimeline(userId, { max_results: count });
      return tweets.data;
    } catch (error) {
      logger.error('Failed to fetch X tweets:', error);
      return [];
    }
  }

  async sendDirectMessage(recipientId, message) {
    try {
      const dm = await this.rwClient.v2.sendDm(recipientId, { text: message });
      logger.info(`DM sent to ${recipientId}`);
      return dm;
    } catch (error) {
      logger.error('Failed to send X DM:', error);
      throw error;
    }
  }

  async handleWebhook(payload, signature) {
    const expectedSignature = crypto.createHmac('sha256', process.env.X_WEBHOOK_SECRET).update(JSON.stringify(payload)).digest('hex');
    if (signature !== `sha256=${expectedSignature}`) {
      throw new Error('Invalid webhook signature');
    }
    logger.info('X webhook processed:', payload);
    // Trigger mining or notifications
    return { processed: true, event: payload };
  }

  calculateEngagement(tweets) {
    return tweets.reduce((score, tweet) => score + (tweet.public_metrics?.like_count || 0) + (tweet.public_metrics?.retweet_count || 0), 0);
  }
}

module.exports = XClient;

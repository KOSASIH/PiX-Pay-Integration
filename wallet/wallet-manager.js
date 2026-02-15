const PiClient = require('../pi-integration/pi-client');
const XClient = require('../x-api/x-client');
const User = require('../models/User');
const winston = require('winston');
const crypto = require('crypto');

const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()]
});

class WalletManager {
  constructor() {
    this.piClient = new PiClient();
    this.xClient = new XClient();
  }

  async linkAccounts(userId, piUserId, xUserId) {
    try {
      const piAuth = await this.piClient.authenticateUser(piUserId);
      const xProfile = await this.xClient.getUserTweets(xUserId, 1);
      await User.findByIdAndUpdate(userId, {
        piUserId,
        xUserId,
        'wallet.linked': true
      });
      logger.info(`Accounts linked for user ${userId}`);
      return { success: true };
    } catch (error) {
      logger.error('Account linking failed:', error);
      return { success: false, error: error.message };
    }
  }

  async getBalance(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    return await this.piClient.getBalance(user.piUserId);
  }

  async updateBalance(userId, amount) {
    const user = await User.findById(userId);
    const encryptedAmount = this.encrypt(amount.toString(), user.wallet.encryptionKey);
    await User.findByIdAndUpdate(userId, { $inc: { 'wallet.piBalance': amount } });
  }

  encrypt(text, key) {
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
}

module.exports = WalletManager;

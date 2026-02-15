const PiClient = require('../pi-integration/pi-client');
const Transaction = require('../models/Transaction');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()]
});

class TransactionHandler {
  constructor() {
    this.piClient = new PiClient();
  }

  async processTip(fromUserId, toUserId, amount, tweetId) {
    try {
      const tx = new Transaction({ fromUser: fromUserId, toUser: toUserId, amount, tweetId });
      await tx.save();
      const piTx = await this.piClient.initiateTransaction(fromUserId, toUserId, amount);
      tx.status = 'completed';
      tx.blockchainTxId = piTx.id;
      await tx.save();
      logger.info(`Tip processed: ${amount} Pi`);
      return { success: true, transaction: tx };
    } catch (error) {
      logger.error('Tip processing failed:', error);
      await Transaction.findByIdAndUpdate(tx._id, { status: 'failed' });
      return { success: false, error: error.message };
    }
  }

  async getTransactionHistory(userId) {
    return await Transaction.find({ $or: [{ fromUser: userId }, { toUser: userId }] }).populate('fromUser toUser');
  }
}

module.exports = TransactionHandler;

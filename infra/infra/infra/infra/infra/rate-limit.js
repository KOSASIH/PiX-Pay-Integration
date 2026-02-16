const { RateLimiterRedis } = require("rate-limiter-flexible");
const connection = require("./redis");

const walletLimiter = new RateLimiterRedis({
  storeClient: connection,
  keyPrefix: "wallet_limit",
  points: 10,
  duration: 60
});

async function limitWallet(wallet) {
  try {
    await walletLimiter.consume(wallet);
  } catch {
    throw new Error("Too many transactions from this wallet");
  }
}

module.exports = limitWallet;

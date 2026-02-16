const createBlockchain = require("../blockchain/blockchain-factory");

const blockchain = createBlockchain();
blockchain.initialize();

async function sendTip(from, to, amount) {
  try {
    const tx = await blockchain.sendTransaction(from, to, amount);

    return {
      success: true,
      txId: tx.txId,
      network: tx.network
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

module.exports = { sendTip };

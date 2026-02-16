class BlockchainAdapter {
  async initialize() {
    throw new Error("initialize() must be implemented");
  }

  async getBalance(address) {
    throw new Error("getBalance() must be implemented");
  }

  async sendTransaction(from, to, amount) {
    throw new Error("sendTransaction() must be implemented");
  }

  async verifyTransaction(txId) {
    throw new Error("verifyTransaction() must be implemented");
  }
}

module.exports = BlockchainAdapter;

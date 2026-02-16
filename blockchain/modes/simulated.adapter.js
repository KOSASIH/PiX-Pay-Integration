const BlockchainAdapter = require("../blockchain-adapter");
const { v4: uuidv4 } = require("uuid");

class SimulatedAdapter extends BlockchainAdapter {
  constructor() {
    super();
    this.ledger = new Map(); // in-memory ledger
  }

  async initialize() {
    console.log("Simulated Blockchain Initialized");
  }

  async getBalance(address) {
    return this.ledger.get(address) || 1000; // default balance
  }

  async sendTransaction(from, to, amount) {
    const txId = uuidv4();

    const fromBalance = await this.getBalance(from);
    if (fromBalance < amount) {
      throw new Error("Insufficient balance (Simulated)");
    }

    this.ledger.set(from, fromBalance - amount);
    this.ledger.set(to, (await this.getBalance(to)) + amount);

    return {
      txId,
      status: "confirmed",
      network: "simulated"
    };
  }

  async verifyTransaction(txId) {
    return { txId, status: "confirmed" };
  }
}

module.exports = SimulatedAdapter;

const axios = require("axios");
const BlockchainAdapter = require("../blockchain-adapter");

class SandboxAdapter extends BlockchainAdapter {
  constructor() {
    super();
    this.api = process.env.PI_SANDBOX_API;
    this.apiKey = process.env.PI_API_KEY;
  }

  async initialize() {
    console.log("Pi Sandbox Connected");
  }

  async getBalance(address) {
    const res = await axios.get(`${this.api}/balance/${address}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` }
    });
    return res.data.balance;
  }

  async sendTransaction(from, to, amount) {
    const res = await axios.post(
      `${this.api}/transactions`,
      { from, to, amount },
      { headers: { Authorization: `Bearer ${this.apiKey}` } }
    );

    return {
      txId: res.data.txId,
      status: res.data.status,
      network: "sandbox"
    };
  }

  async verifyTransaction(txId) {
    const res = await axios.get(`${this.api}/transactions/${txId}`);
    return res.data;
  }
}

module.exports = SandboxAdapter;

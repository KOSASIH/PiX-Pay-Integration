const { Worker } = require("bullmq");
const connection = require("../infra/redis");
const createBlockchain = require("../blockchain/blockchain-factory");
const writeAudit = require("../infra/audit-log");
const createBreaker = require("../infra/circuit-breaker");

const blockchain = createBlockchain();
blockchain.initialize();

const breaker = createBreaker((job) =>
  blockchain.sendTransaction(job.from, job.to, job.amount)
);

new Worker(
  "payments",
  async job => {
    const tx = await breaker.fire(job.data);

    writeAudit({
      type: "payment",
      from: job.data.from,
      to: job.data.to,
      amount: job.data.amount,
      txId: tx.txId,
      network: tx.network
    });

    return tx;
  },
  { connection }
);

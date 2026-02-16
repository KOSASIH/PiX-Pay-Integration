const { Queue } = require("bullmq");
const connection = require("./redis");

const paymentQueue = new Queue("payments", {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

module.exports = paymentQueue;

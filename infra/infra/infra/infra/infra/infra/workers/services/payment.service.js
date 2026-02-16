const paymentQueue = require("../infra/queue");
const { checkIdempotency, saveIdempotency } = require("../infra/idempotency");
const limitWallet = require("../infra/rate-limit");

async function requestPayment({ from, to, amount, idempotencyKey }) {

  await checkIdempotency(idempotencyKey);
  await limitWallet(from);

  const job = await paymentQueue.add("send", { from, to, amount });

  const result = await job.waitUntilFinished(paymentQueue.client);

  await saveIdempotency(idempotencyKey, result);

  return result;
}

module.exports = requestPayment;

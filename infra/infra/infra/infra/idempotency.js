const connection = require("./redis");

async function checkIdempotency(key) {
  const exists = await connection.get(`idem:${key}`);
  if (exists) throw new Error("Duplicate transaction detected");
}

async function saveIdempotency(key, result) {
  await connection.set(`idem:${key}`, JSON.stringify(result), "EX", 3600);
}

module.exports = { checkIdempotency, saveIdempotency };

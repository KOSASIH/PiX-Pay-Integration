const CircuitBreaker = require("opossum");

function createBreaker(fn) {
  return new CircuitBreaker(fn, {
    timeout: 8000,
    errorThresholdPercentage: 50,
    resetTimeout: 15000
  });
}

module.exports = createBreaker;

const promClient = require('prom-client');
const register = new promClient.Registry();

// Metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const transactionCounter = new promClient.Counter({
  name: 'transactions_total',
  help: 'Total number of transactions',
  labelNames: ['type']
});

const userGauge = new promClient.Gauge({
  name: 'active_users',
  help: 'Number of active users'
});

register.registerMetric(httpRequestDuration);
register.registerMetric(transactionCounter);
register.registerMetric(userGauge);

// Middleware to collect metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.observe({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode }, duration);
  });
  next();
};

module.exports = { register, metricsMiddleware, transactionCounter, userGauge };

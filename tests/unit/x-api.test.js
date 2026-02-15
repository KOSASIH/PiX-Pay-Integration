const XClient = require('../../src/x-api/x-client');
const mongoose = require('mongoose');
require('dotenv').config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('XClient', () => {
  let xClient;

  beforeEach(() => {
    xClient = new XClient();
  });

  test('should fetch user tweets', async () => {
    const tweets = await xClient.getUserTweets('test_user_id');
    expect(Array.isArray(tweets)).toBe(true);
  });

  test('should send direct message', async () => {
    const dm = await xClient.sendDirectMessage('recipient_id', 'Test message');
    expect(dm).toBeDefined();
  });

  test('should handle webhook', async () => {
    const payload = { tweet_create_events: [{ id: '123' }] };
    const signature = 'test_signature'; // Mock
    const result = await xClient.handleWebhook(payload, signature);
    expect(result).toHaveProperty('processed', true);
  });

  test('should calculate engagement', () => {
    const tweets = [{ public_metrics: { like_count: 10, retweet_count: 5 } }];
    const engagement = xClient.calculateEngagement(tweets);
    expect(engagement).toBe(15);
  });
});

# PiX-Pay-Integration API Documentation

## Authentication
- **POST /auth/register**: Register a new user. Body: { username, email, password }. Returns: { message }.
- **POST /auth/login**: Login user. Body: { email, password }. Returns: { token, user }.
- **GET /auth/x**: OAuth login with X (Twitter). Redirects to callback.
- **PUT /auth/profile**: Update user profile. Headers: Authorization. Body: { username, email }.

## Wallet
- **POST /wallet/link**: Link Pi and X accounts. Headers: Authorization. Body: { piUserId, xUserId }. Returns: { success }.
- **GET /wallet/balance**: Get user Pi balance. Headers: Authorization. Returns: { balance }.
- **POST /wallet/mine**: Mine Pi based on X engagement. Headers: Authorization. Returns: { reward, engagement }.

## Payments
- **POST /payments/tip**: Send a Pi tip. Headers: Authorization. Body: { toUserId, amount, tweetId }. Returns: { success, transaction }.
- **GET /payments/history**: Get transaction history. Headers: Authorization. Returns: [transactions].
- **POST /payments/suggest**: Get AI tip suggestion. Headers: Authorization. Body: { userData, tweetContent }. Returns: { suggestion }.
- **GET /payments/report**: Generate AI usage report. Headers: Authorization. Returns: { report }.

## Webhooks
- **POST /webhooks/x**: Handle X (Twitter) webhooks. Body: Webhook payload. Headers: x-twitter-webhooks-signature.

## Real-Time (WebSocket)
- Connect to ws://localhost:3000/socket.
- Events: 'join' (userId), 'sendTip' (data), 'tipReceived' (data).

## Error Handling
All endpoints return JSON with { error } on failure. Use JWT for auth. Rate limited to 100 requests/15min.

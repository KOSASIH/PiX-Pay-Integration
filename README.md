# PiX-Pay-Integration
A repo for integrating Pi Network's Pi Coin with Twitter (X) APIs, focusing on wallet and micro-payment features for seamless social transactions.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7+-010101?style=flat-square&logo=socket.io)](https://socket.io/)
[![JWT](https://img.shields.io/badge/JWT-9.0+-000000?style=flat-square&logo=json-web-tokens)](https://jwt.io/)
[![Passport](https://img.shields.io/badge/Passport-0.6+-34E27A?style=flat-square&logo=passport)](http://www.passportjs.org/)

[![Twitter API (X)](https://img.shields.io/badge/Twitter%20API%20(X)-v2-1DA1F2?style=flat-square&logo=twitter)](https://developer.twitter.com/)
[![Pi Network](https://img.shields.io/badge/Pi%20Network-Beta-F7931A?style=flat-square&logo=pi-network)](https://minepi.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=flat-square&logo=openai)](https://openai.com/)

# PiX-Pay-Integration

## Description
PiX-Pay-Integration is a cutting-edge, super-advanced application that seamlessly integrates Pi Network's cryptocurrency (Pi Coin) with Twitter (X) for innovative micro-payments, social mining, AI-driven commerce, and real-time interactions. This project pioneers decentralized finance on social platforms, enabling users to mine Pi through social engagement, send instant tips, and leverage AI for personalized recommendations and fraud detection. Built with Node.js, Express, MongoDB, and modern web technologies, it includes features like OAuth authentication, WebSocket real-time updates, Progressive Web App (PWA) capabilities, and enterprise-level security.

## Features
- **Decentralized Payments**: Send and receive Pi Coin tips directly via X (Twitter) interactions.
- **Social Mining**: Earn Pi rewards based on X engagement metrics (likes, retweets, followers) with AI-optimized calculations.
- **AI-Powered Insights**: Use advanced AI (TensorFlow.js and OpenAI) for tip suggestions, trend predictions, fraud detection, and personalized reports.
- **Real-Time Interactions**: WebSocket-based notifications for live updates on tips, mining, and transactions.
- **Secure Authentication**: JWT-based auth with OAuth for X, optional 2FA, and encrypted wallets.
- **Progressive Web App**: Offline support, responsive design, dark mode, and interactive charts for analytics.
- **Admin Panel**: Bulk operations, user management, and anomaly detection for privileged users.
- **Monitoring & Scalability**: Prometheus metrics, Docker/Kubernetes deployment, and environment-specific configurations.
- **Comprehensive Testing**: Unit and integration tests with Jest for reliability.

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud, e.g., MongoDB Atlas)
- API Keys:
  - Pi Network API Key (from pi-blockchain.net)
  - X (Twitter) API Key, Secret, and Bearer Token (from developer.twitter.com)
  - OpenAI API Key (for AI features)
- Docker (optional, for containerization)
- Kubernetes (optional, for orchestration)

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/KOSASIH/PiX-Pay-Integration.git
   cd PiX-Pay-Integration
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`.
   - Fill in your API keys and configuration (see Configuration section).

4. Set up MongoDB:
   - For local: Install MongoDB and start it.
   - For cloud: Use MongoDB Atlas and update `MONGO_URI` in `.env`.

5. Run setup scripts:
   ```
   npm run setup  # Runs migrations and seeds data
   ```

## Configuration
Edit the `.env` file with the following variables:
- `PORT=3000`
- `MONGO_URI=mongodb://localhost:27017/pixpay`
- `JWT_SECRET=your_super_secret_jwt_key`
- `PI_API_KEY=your_pi_api_key`
- `X_API_KEY=your_x_api_key`
- `X_API_SECRET=your_x_api_secret`
- `X_BEARER_TOKEN=your_x_bearer_token`
- `X_WEBHOOK_SECRET=your_x_webhook_secret`
- `OPENAI_API_KEY=your_openai_api_key`
- `OAUTH_CALLBACK_URL=http://localhost:3000/auth/x/callback`

For production, use `NODE_ENV=production` and adjust configs in `config/production.js`.

## Running the Application
1. Start the server:
   ```
   npm start
   ```
   The app runs on `http://localhost:3000`.

2. Access the dashboard:
   - Open a browser and navigate to `http://localhost:3000`.
   - Register/login, link wallets, and start interacting.

3. For development:
   ```
   npm run dev  # Uses nodemon for auto-restart
   ```

## Testing
Run tests with:
```
npm test
```
- Unit tests cover individual modules (e.g., Pi client, X API).
- Integration tests verify end-to-end flows (e.g., payment processing).

## Deployment
### Local Docker
```
docker build -t pix-pay .
docker run -p 3000:3000 pix-pay
```

### Docker Compose
```
docker-compose up
```

### Kubernetes
Apply manifests:
```
kubectl apply -f k8s/
```

### Heroku
```
npm run deploy:heroku
```

For production, ensure HTTPS, monitor logs, and scale as needed.

## API Endpoints
### Authentication
- `POST /auth/register` - Register user.
- `POST /auth/login` - Login user.
- `GET /auth/x` - OAuth login with X.
- `PUT /auth/profile` - Update profile.
- `POST /auth/setup-2fa` - Setup 2FA.

### Wallet
- `POST /wallet/link` - Link Pi and X accounts.
- `GET /wallet/balance` - Get balance.
- `POST /wallet/mine` - Mine Pi.

### Payments
- `POST /payments/tip` - Send tip.
- `GET /payments/history` - Transaction history.
- `POST /payments/suggest` - AI suggestion.
- `GET /payments/report` - AI report.

### Admin
- `GET /admin/users` - View users.
- `POST /admin/bulk-tip` - Bulk tip.

### Webhooks
- `POST /webhooks/x` - X webhook handler.

### Monitoring
- `GET /metrics` - Prometheus metrics.

For detailed API docs, see `docs/api-docs.md`.

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m 'Add your feature'`.
4. Push to branch: `git push origin feature/your-feature`.
5. Open a pull request.

Please follow the code style, add tests, and update documentation.

## License
This project is licensed under the MIT License - see the `LICENSE` file for details.

## Support
For issues or questions, open an issue on GitHub or contact the maintainers.

## Roadmap
- Mobile app development.
- Integration with more social platforms.
- Advanced blockchain oracles.
- Enhanced AI models for predictive analytics.

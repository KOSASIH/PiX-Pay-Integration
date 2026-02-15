require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const http = require('http');
const socketIo = require('socket.io');
const winston = require('winston');

const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');
const paymentRoutes = require('./routes/payments');
const webhookRoutes = require('./routes/webhooks');
const User = require('./models/User');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/server.log' })
  ]
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Passport OAuth
passport.use(new TwitterStrategy({
  consumerKey: process.env.X_API_KEY,
  consumerSecret: process.env.X_API_SECRET,
  callbackURL: process.env.OAUTH_CALLBACK_URL
}, async (token, tokenSecret, profile, done) => {
  try {
    let user = await User.findOne({ xUserId: profile.id });
    if (!user) {
      user = new User({ username: profile.username, email: `${profile.username}@x.com`, password: 'oauth', xUserId: profile.id });
      await user.save();
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
}));

// Routes
app.use('/auth', authRoutes);
app.use('/wallet', walletRoutes);
app.use('/payments', paymentRoutes);
app.use('/webhooks', webhookRoutes);
app.use(express.static('public')); // Serve frontend

// Socket.io for real-time
io.on('connection', (socket) => {
  logger.info('User connected via socket');
  socket.on('join', (userId) => socket.join(userId));
  socket.on('sendTip', (data) => io.to(data.toUser).emit('tipReceived', data));
});

// DB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

module.exports = { app, server, io };

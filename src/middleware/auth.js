const jwt = require('jsonwebtoken');
const User = require('../models/User');
const winston = require('winston');

const logger = winston.createLogger({ level: 'info', transports: [new winston.transports.Console()] });

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('No token provided');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error('User not found');
    req.user = user;
    logger.info(`Authenticated user: ${user._id}`);
    next();
  } catch (error) {
    logger.error('Authentication failed:', error.message);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = { auth, optionalAuth };

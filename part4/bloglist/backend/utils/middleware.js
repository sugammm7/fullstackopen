const jwt = require('jsonwebtoken');

const User = require('../models/user');
const logger = require('./logger');
const config = require('./config');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  } else if (
    err.name === 'MongoServerError' &&
    err.message.includes('E11000 duplicate key error')
  ) {
    return res
      .status(400)
      .json({ error: 'user with provided username already exists' });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' });
  } else if (err.name === 'TokenExpiredError') {
    return res
      .status(401)
      .json({ error: 'session has expired. Please log in again.' });
  }

  next(err);
};

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization');
  if (auth && auth.startsWith('Bearer')) {
    req.token = auth.split(' ')[1];
  } else {
    req.token = null;
  }

  next();
};

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'token is missing' });
  }

  const decoded = jwt.verify(req.token, config.JWT_SECRET);
  if (!decoded.id) {
    return res.status(401).json({ error: 'invalid token' });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res
      .status(401)
      .json({ error: 'user associated with token no longer exists' });
  }

  req.user = user;

  next();
};

module.exports = { errorHandler, tokenExtractor, userExtractor };

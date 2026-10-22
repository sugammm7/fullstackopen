const express = require('express');
const mongoose = require('mongoose');

const config = require('./utils/config');
const logger = require('./utils/logger');

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('Connected to DB ✅');
  })
  .catch((err) => {
    logger.error(err.message);
    process.exit(1);
  });

const app = express();

module.exports = app;

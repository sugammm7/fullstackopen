const express = require('express');
const mongoose = require('mongoose');

const config = require('./utils/config');
const logger = require('./utils/logger');
const blogRouter = require('./controllers/blogs');

const app = express();

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('Connected to DB ✅');
  })
  .catch((err) => {
    logger.error(err.message);
    process.exit(1);
  });

app.use(express.json());

app.use('/api/blogs', blogRouter);

module.exports = app;

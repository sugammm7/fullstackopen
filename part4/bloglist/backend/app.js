const express = require('express');
const mongoose = require('mongoose');

const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

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
app.use(middleware.tokenExtractor);

app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.use(middleware.errorHandler);

module.exports = app;

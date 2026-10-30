const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const config = require('../utils/config');

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username or password missing' });
  }

  const user = await User.findOne({ username });

  const isPasswordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!user || !isPasswordCorrect) {
    return res.status(400).json({ error: 'incorrect username or password' });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });

  res.json({
    token,
    username: user.username,
    name: user.name,
  });
});

module.exports = loginRouter;

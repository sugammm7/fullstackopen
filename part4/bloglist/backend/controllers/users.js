const bcrypt = require('bcrypt');
const userRouter = require('express').Router();

const User = require('../models/user');

userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'password field is required' });
  }

  if (password.length < 3) {
    return res
      .status(400)
      .json({ error: 'password must be atleast 3 characters long' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });

  res.json(users);
});

module.exports = userRouter;

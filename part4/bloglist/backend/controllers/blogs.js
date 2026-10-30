const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');
const User = require('../models/user');
const config = require('../utils/config');

const getTokenFrom = (req) => {
  const auth = req.get('authorization');
  if (auth && auth.startsWith('Bearer')) {
    return auth.split(' ')[1];
  }
  return null;
};

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user');
  res.json(blogs);
});

blogRouter.post('/', async (req, res) => {
  const token = getTokenFrom(req);

  if (!token) {
    return res.status(401).json({ error: 'token is missing' });
  }

  const decoded = jwt.verify(token, config.JWT_SECRET);
  if (!decoded.id) {
    return res.status(401).json({ error: 'invalid token' });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res
      .status(401)
      .json({ error: 'user associated with token no longer exists' });
  }

  const { title, author, url } = req.body;

  const blog = new Blog({
    title,
    author,
    url,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

blogRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);

  res.status(204).end();
});

blogRouter.put('/:id', async (req, res) => {
  const { title, author, likes, url } = req.body;

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).end();
  }

  blog.title = title;
  blog.author = author;
  blog.url = url;
  blog.likes = likes;

  const updatedBlog = await blog.save();

  res.json(updatedBlog);
});

module.exports = blogRouter;

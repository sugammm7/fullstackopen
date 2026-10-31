const blogRouter = require('express').Router();

const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user');
  res.json(blogs);
});

blogRouter.post('/', middleware.userExtractor, async (req, res) => {
  const { title, author, url } = req.body;

  const blog = new Blog({
    title,
    author,
    url,
    user: req.user._id,
  });

  const savedBlog = await blog.save();
  req.user.blogs = req.user.blogs.concat(savedBlog._id);
  await req.user.save();

  res.status(201).json(savedBlog);
});

blogRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).end();
  }

  if (blog.user.toString() !== req.user._id.toString()) {
    return res
      .status(401)
      .json({ error: 'You are only allowed to delete your own blog' });
  }

  await Blog.findByIdAndDelete(req.params.id);

  req.user.blogs = req.user.blogs.filter(
    (blog) => blog.toString() !== req.params.id,
  );
  await req.user.save();

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

const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'Beginning of the End',
    author: 'Steve Harrington',
    url: 'https://steve.bloglist.com',
    likes: 98,
  },
  {
    title: 'Mike without El',
    author: 'Millie Brown',
    url: 'https://millie.bloglist.com',
    likes: 76,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const deletedBlogId = async () => {
  const newBlog = new Blog({
    title: 'soon deleted',
    author: 'tester',
    url: 'https://test.bloglist.com',
    likes: 1,
  });

  const savedBlog = await newBlog.save();
  await savedBlog.deleteOne();

  return savedBlog._id.toString();
};

deletedBlogId();

module.exports = { initialBlogs, blogsInDb, deletedBlogId };

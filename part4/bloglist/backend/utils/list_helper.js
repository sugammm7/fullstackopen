const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, curr) => total + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (!blogs.length) {
    return null;
  }
  return blogs.reduce(
    (prev, curr) => (curr.likes > prev.likes ? curr : prev),
    blogs[0],
  );
};

const mostBlogs = (blogs) => {
  if (!blogs.length) {
    return null;
  }

  const authorAndBlogsPublished = blogs.reduce((acc, curr) => {
    if (!acc[curr.author]) {
      acc[curr.author] = 1;
    } else {
      acc[curr.author]++;
    }

    return acc;
  }, {});

  const result = {};
  result.blogs = 0;
  for (const [author, noOfBlog] of Object.entries(authorAndBlogsPublished)) {
    if (noOfBlog > result.blogs) {
      result.author = author;
      result.blogs = noOfBlog;
    }
  }

  return result;
};

const mostLikes = (blogs) => {
  if (!blogs.length) {
    return null;
  }

  const authorAndTotalLikes = blogs.reduce((acc, curr) => {
    if (!acc[curr.author]) {
      acc[curr.author] = curr.likes;
    } else {
      acc[curr.author] += curr.likes;
    }

    return acc;
  }, {});

  const result = {};
  result.likes = 0;
  for (const [author, totalLikes] of Object.entries(authorAndTotalLikes)) {
    if (totalLikes > result.likes) {
      result.author = author;
      result.likes = totalLikes;
    }
  }

  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};

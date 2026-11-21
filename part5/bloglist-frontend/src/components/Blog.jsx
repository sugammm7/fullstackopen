import { useState } from 'react';
import BlogDetails from './BlogDetails';

function Blog({ blog }) {
  const [isViewed, setIsViewed] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  function handleView() {
    setIsViewed(!isViewed);
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={handleView}>{isViewed ? 'hide' : 'view'}</button>
      {isViewed && <BlogDetails blog={blog} />}
    </div>
  );
}

export default Blog;

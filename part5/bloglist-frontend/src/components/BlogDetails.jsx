function BlogDetails({ blog }) {
  return (
    <div>
      <p>{blog.url}</p>
      <p>likes: {blog.likes}</p>
      <p>{blog.user.name}</p>
    </div>
  );
}

export default BlogDetails;

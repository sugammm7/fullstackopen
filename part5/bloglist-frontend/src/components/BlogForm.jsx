import { useState } from 'react';

function BlogForm({ onCreateBlog }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  function handleCreateBlog(e) {
    e.preventDefault();

    onCreateBlog({ title, author, url });

    setAuthor('');
    setTitle('');
    setUrl('');
  }

  return (
    <form onSubmit={(e) => handleCreateBlog(e)}>
      <div>
        <label htmlFor="title">title: </label>
        <input
          id="title"
          type="text"
          value={title}
          name="title"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="author">author: </label>
        <input
          id="author"
          type="text"
          value={author}
          name="author"
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="url">url: </label>
        <input
          id="url"
          type="text"
          value={url}
          name="url"
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <button>create</button>
    </form>
  );
}

export default BlogForm;

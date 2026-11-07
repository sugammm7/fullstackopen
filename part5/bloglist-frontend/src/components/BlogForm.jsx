import Button from './Button';

function BlogForm({
  title,
  onChangeTitle,
  author,
  onChangeAuthor,
  url,
  onChangeUrl,
  onCreateBlog,
}) {
  return (
    <form onSubmit={onCreateBlog}>
      <div>
        <label htmlFor="title">title: </label>
        <input
          id="title"
          type="text"
          value={title}
          name="title"
          onChange={(e) => onChangeTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="author">author: </label>
        <input
          id="author"
          type="text"
          value={author}
          name="author"
          onChange={(e) => onChangeAuthor(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="url">url: </label>
        <input
          id="url"
          type="text"
          value={url}
          name="url"
          onChange={(e) => onChangeUrl(e.target.value)}
        />
      </div>
      <Button text="create" />
    </form>
  );
}

export default BlogForm;

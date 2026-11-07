import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser');

    if (loggedInUser) {
      return JSON.parse(loggedInUser);
    }
    return null;
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    async function fetchBlogs() {
      const res = await blogService.getAll();
      setBlogs(res);
    }
    fetchBlogs();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      setUser(user);

      window.localStorage.setItem('loggedInUser', JSON.stringify(user));
      blogService.setToken(user.token);
    } catch (err) {
      setErrorMessage(err.response.data.error);

      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } finally {
      setUsername('');
      setPassword('');
    }
  }

  function handleLogout() {
    setUser(null);
    window.localStorage.removeItem('loggedInUser');
    blogService.setToken(null);
  }

  async function handleCreateBlog(e) {
    e.preventDefault();

    try {
      const newBlog = await blogService.create({ title, author, url });
      setBlogs(blogs.concat(newBlog));
    } catch (err) {
      setErrorMessage(err.response.data.error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } finally {
      setAuthor('');
      setTitle('');
      setUrl('');
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      {errorMessage && <Notification message={errorMessage} />}

      {user === null ? (
        <LoginForm
          username={username}
          password={password}
          onChangeUsername={setUsername}
          onChangePassword={setPassword}
          onLogin={handleLogin}
        />
      ) : (
        <>
          <p>
            {user.username} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </p>

          <BlogForm
            title={title}
            onChangeTitle={setTitle}
            author={author}
            onChangeAuthor={setAuthor}
            url={url}
            onChangeUrl={setUrl}
            onCreateBlog={handleCreateBlog}
          />

          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      )}
    </div>
  );
}

export default App;

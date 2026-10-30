const assert = require('node:assert');
const { test, after, beforeEach, describe } = require('node:test');
const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./helper');

const api = supertest(app);

describe('when there are blogs in db', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  test('blogs fetched are json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-type', /application\/json/);
  });

  test('all blogs are fetched', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('unique identifier for blog posts is id but not _id', async () => {
    const response = await api.get('/api/blogs');

    assert(Object.hasOwn(response.body[0], 'id'));
    assert(!Object.hasOwn(response.body[0], '_id'));
  });

  describe('addition of new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Turn Around...',
        author: 'DustyBun',
        url: 'https://dustin.bloglist.com',
        likes: 67,
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const blogTitle = blogsAtEnd.map((blog) => blog.title);

      assert(blogTitle.includes('Turn Around...'));
    });

    test('with missing likes property default likes as 0', async () => {
      const newBlog = {
        title: 'missing likes property',
        author: 'DustyBun',
        url: 'https://dustin.bloglist.com',
      };

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const addedBlog = blogsAtEnd.find((blog) => blog.id === response.body.id);

      assert.strictEqual(addedBlog.likes, 0);
    });

    test('with missing title or url field results 400 error', async () => {
      const newBlog = {
        author: 'DustyBun',
        url: 'https://dustin.bloglist.com',
      };

      await api.post('/api/blogs').send(newBlog).expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe('deletion of blog', () => {
    test('success with valid id', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      const ids = blogsAtEnd.map((blog) => blog.id);

      assert(!ids.includes(blogToDelete.id));

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
    });

    test('400 bad request with invalid id', async () => {
      const invalidId = '6adc3ca412f3d09d15d';

      await api.delete(`/api/blogs/${invalidId}`).expect(400);
    });
  });

  describe('updation of blog', () => {
    const newUpdatedBlog = {
      title: 'Sea King',
      author: 'luffyTaro',
      url: 'https://luffy.bloglist.com',
      likes: 100,
    };

    test('succes with valid id and data', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newUpdatedBlog)
        .expect(200)
        .expect('Content-type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();

      const updatedBlog = blogsAtEnd.find(
        (blog) => blog.id === blogToUpdate.id,
      );

      assert.deepStrictEqual(updatedBlog, {
        ...newUpdatedBlog,
        id: blogToUpdate.id,
      });
    });

    test('404 error with id of deleted blog', async () => {
      const deletedBlogId = await helper.deletedBlogId();

      await api
        .put(`/api/blogs/${deletedBlogId}`)
        .send(newUpdatedBlog)
        .expect(404);
    });

    test('400 bad request with invalid id', async () => {
      const invalidId = '6adc3ca412f3d09d15d';

      await api.put(`/api/blogs/${invalidId}`).send(newUpdatedBlog).expect(400);
    });

    test('with invalid data results 400 validaton error', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const invalidData = {
        author: 'luffyTaro',
        likes: 100,
      };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(invalidData)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      const notChangedBlog = blogsAtEnd.find(
        (blog) => blog.id === blogToUpdate.id,
      );

      assert.notDeepStrictEqual(notChangedBlog, {
        blogToUpdate,
      });
    });
  });
});

describe('when there are users in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const newUser = {
      username: 'root',
      password: 'iamroot',
    };

    const user = new User(newUser);

    await user.save();
  });

  test('success creating user with valid data', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'joshua',
      name: 'Joshua Brown',
      password: 'iamjoshua',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length);
  });

  describe('error with proper status code and message with missing required fields and invalid data', () => {
    test('with missing username', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        name: 'Joshua Brown',
        password: 'iamjoshua',
      };

      const res = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();

      assert(res.body.error.includes('User validation failed'));

      assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });

    test('with missing password', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'Joshua',
        name: 'Joshua Brown',
      };

      const res = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();

      assert(res.body.error.includes('password field is required'));

      assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });

    test('with password having less than 3 characters', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'Joshua',
        name: 'Joshua Brown',
        password: 'we',
      };

      const res = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();

      assert(
        res.body.error.includes('password must be atleast 3 characters long'),
      );

      assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });

    test('with username having less than 3 characters', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'Jo',
        name: 'Joshua Brown',
        password: 'webros',
      };

      const res = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();

      assert(
        res.body.error.includes('shorter than the minimum allowed length'),
      );

      assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });

    test('with username already existing in db', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'root',
        name: 'Joshua Brown',
        password: 'webros',
      };

      const res = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();

      assert(
        res.body.error.includes('user with provided username already exists'),
      );

      assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});

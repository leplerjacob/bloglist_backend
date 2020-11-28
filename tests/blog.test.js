const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  const blogsObject = helper.initialBlogs.map((blog) => new Blog(blog))
  let promiseArray = blogsObject.map((blog) => blog.save())
  promiseArray.push(
    new Promise((resolve, reject) => {
      let completedHash = 0
      usersObject = helper.initialUsers.map(async (user) => {
        await bcrypt.hash(user.passwordHash, 10, async (err, hash) => {
          if (err) {
            reject(err)
          } else {
            const newUser = new User({ ...user, passwordHash: hash })
            const done = await Promise.resolve(newUser.save())
            completedHash++
          }
          if (completedHash === 2) {
            resolve()
          }
        })
      })
    })
  )

  await Promise.all(promiseArray)
})

describe('CRUD', () => {
  describe('CREATE BLOG', () => {
    test('create blog and return', async () => {
      const loginRootUser = { username: 'root', password: 'password' }
      const rootUserToken = await api
        .post('/api/login')
        .send(loginRootUser)
        .expect(200)
        .then((result) => result.body)
      const userProps = jwt.verify(rootUserToken.token, process.env.SECRET)
      const blogToPost = {
        title: '10 extensions for vs code',
        author: 'Arthur McCarthur',
        url: 'www.somewebsitewiththeblog.com',
        user: userProps._id,
      }
      const postedBlog = await api
        .post('/api/blogs')
        .send(blogToPost)
        .set('Authorization', 'bearer ' + rootUserToken.token)
        .expect(200)
      const currentBlogsInDb = await api
        .get('/api/blogs')
        .expect(200)
        .then((result) => result.body)
      expect(postedBlog).not.toBe(null)
    })
  })
  describe('DELETE BLOG', () => {
    test('delete blog with token', async () => {
      const rootToken = await api
        .post('/api/login')
        .send({ username: 'root', password: 'password' })
        .expect(200)
        .then((res) => res.body)

      const rootUser = await helper.initialUsers[0]

      const deletedBlog = await api
        .delete(`/api/blogs/${rootUser.blogs[0]}`)
        .set('Authorization', 'bearer ' + rootToken.token)
        .expect(204)

      const updatedUser = await api
        .get('/api/users')
        .then((res) => res.body)
        .then((users) =>
          users.filter((user) => user.id === helper.initialUsers[0]._id)
        )

      expect(updatedUser[0].blogs.length).toEqual(
        helper.initialUsers[0].blogs.length - 1
      )
    })
  })
  describe('UPDATE BLOG', () => {
    test('update blog and return', async () => {
      const blogId = helper.initialBlogs[2]._id
      const updateBlogLikes = {
        likes: 10,
      }
      await api.put(`/api/blogs/${blogId}`).send(updateBlogLikes).expect(200)
      const initialBlogs = await api
        .get(`/api/blogs/${blogId}`)
        .then((result) => result.body)
      expect(updateBlogLikes.likes).toEqual(initialBlogs.likes)
    })
  })
})

describe('VALIDATION', () => {
  describe('BLOG VALIDATION', () => {
    test('validate blog id exist', async () => {
      const blogsInDB = await api.get('/api/blogs')
      const singleBlog = blogsInDB.body[0]
      expect(singleBlog.id).toBeDefined()
    })
    test('validate blog properties failure', async () => {
      const blogToPost = {
        likes: 10,
        author: 'Joe Malone',
      }
      await api.post('/api/blogs').send(blogToPost).expect(400)
    })
    test('validate default likes value', async () => {
      const loginRootUser = { username: 'root', password: 'password' }
      const rootUserToken = await api
        .post('/api/login')
        .send(loginRootUser)
        .expect(200)
        .then((result) => result.body)
      const userProps = jwt.verify(rootUserToken.token, process.env.SECRET)
      const blogWithoutLikes = {
        title: 'Some Title',
        author: 'John B. Goode',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        users: userProps.id,
      }
      await api
        .post('/api/blogs')
        .send(blogWithoutLikes)
        .set('Authorization', 'bearer ' + rootUserToken.token)
      const blogs = await api
        .get('/api/blogs')
        .expect(200)
        .then((result) => result.body)
      expect(blogs[blogs.length - 1]).toHaveProperty('likes', 0)
    })
  })
  describe('USER VALIDATION', () => {
    test('validate user properties failure', async () => {
      const initDbUsers = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .then((result) => result.body)
      const missingProps = {
        username: 'te',
        name: '',
        password: 'testpass',
      }
      const savedUser = await api
        .post('/api/users')
        .send(missingProps)
        .expect(400)
        .then((result) => result.body)
      if (savedUser.error) {
      }
      expect(helper.initialUsers.length).toEqual(initDbUsers.length)
    })
  })
})

describe('GET', () => {
  describe('GET W/ BLOGS', () => {
    test('get all blogs', async () => {
      const blogsInDB = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .then((result) => result.body)
    })
    test('get number of blogs', async () => {
      const result = await api.get('/api/blogs')
      expect(result.body.length).toEqual(helper.initialBlogs.length)
    })
    test('get blog with most likes', async () => {
      const allBlogs = await api
        .get('/api/blogs')
        .expect(200)
        .then((result) => result.body)
      const mostLikedBlog = (({ author, title, likes, url }) => ({
        author,
        title,
        likes,
        url,
      }))(helper.favoriteBlog(allBlogs))
      expect(mostLikedBlog).toEqual(
        (({ author, title, likes, url }) => ({ author, title, likes, url }))(
          helper.initialBlogs[2]
        )
      )
    })
  })
  describe('GET W/ USERS', () => {
    test('get all users', async () => {
      const users = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .then((result) => result.body)
      expect(users.length).toEqual(2)
    })
  })
  describe('LOGIN', () => {
    test('login get user token', async () => {
      const login = {
        username: 'root',
        password: 'password',
        name: 'newuser',
      }
      const token = await api
        .post('/api/login')
        .send(login)
        .then((result) => result.body)

      expect(login).toMatchObject(
        (({ username, name }) => ({ username, name }))(token)
      )
    })
  })
})

afterAll(() => {
  mongoose.disconnect()
})

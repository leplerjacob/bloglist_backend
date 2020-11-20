const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  const blogsObject = helper.initialBlogs.map((blog) => new Blog(blog))
  let promiseArray = blogsObject.map((blog) => blog.save())
  promiseArray.push(new Promise((resolve,reject) => {
    let completedHash = 0
    usersObject = helper.initialUsers.map(async (user) => {
      await bcrypt.hash(user.passwordHash, 10, async (err, hash) => {
        if (err) {
          reject(err)
        } else {
            const newUser = new User({...user, passwordHash: hash})
            const done = await Promise.resolve(newUser.save())
            completedHash++
        }
        if(completedHash === 2) {
          resolve()
        }
      })
    })
  }))

  await Promise.all(promiseArray)
})

describe('Testing blog db api', () => {
  test('blogs returned as json', async () => {
    const blogsInDB = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns the current total number of blogs', async () => {
    const result = await api.get('/api/blogs')
    expect(result.body.length).toEqual(helper.initialBlogs.length)
  })

  test('returns 200 if successful blog post', async () => {

    const blogToPost = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 3
    }

    await api.post('/api/blogs').send(blogToPost).expect(201)

    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .then((result) => result.body)

    expect(blogs.length).toEqual(helper.initialBlogs.length + 1)

    expect(blogs[blogs.length - 1]).toEqual(expect.objectContaining(blogToPost))
  })
})

describe('evaluating blog properties', () => {
  test('existence of blog property id', async () => {
    const blogsInDB = await api.get('/api/blogs')
    const singleBlog = blogsInDB.body[0]
    expect(singleBlog.id).toBeDefined()
  })

  test('returns error when missing blog properties', async () => {
    const blogToPost = {
      likes: 10,
      author: 'Joe Malone',
    }

    await api.post('/api/blogs').send(blogToPost).expect(400)
  })

  test('test the default value of likes', async () => {
    const blogWithoutLikes = {
      title: 'Some Title',
      author: 'John B. Goode',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    }

    await api.post('/api/blogs').send(blogWithoutLikes)

    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .then((result) => result.body)

    expect(blogs[blogs.length - 1]).toHaveProperty('likes', 0)
  })
})

describe('blog queries', () => {
  test('if list contains more than one blog, equals the blog with most likes', async () => {
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

describe('Delete blog post', () => {
  test('returns 204 if deletion is successful', async () => {
    const blogIdToDelete = helper.initialBlogs[0]._id

    await api.delete(`/api/blogs/${blogIdToDelete}`).expect(204)

    const blogsAfter = await api
      .get('/api/blogs')
      .expect(200)
      .then((results) => results.body)

    expect(helper.initialBlogs.length - 1).toEqual(blogsAfter.length)
  })
})

describe('update blog', () => {
  test('returns 204 when update is successful', async () => {
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

describe('Tests api users', () => {
  test('Response 200 and gets initial users in db', async () => {

    const users = await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/).then(result => result.body)

    expect(users.length).toEqual(2)
  })

  test('returns correct status code if missing user properties or does not meet validation', async () => {
    const initDbUsers = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .then((result) => result.body)

    const missingUsername = {
      username: 'te',
      name: '',
      password: 'testpass',
    }

    const savedUser = await api.post('/api/users').send(missingUsername).expect(400).then(result => result.body)

    if(savedUser.error) {
      console.log(savedUser);
    }

    expect(helper.initialUsers.length).toEqual(initDbUsers.length)

  })
  
describe('Log in functionality', () => {
  test('Response 200 when correct username and password', async () => {
    const login = {
      username: 'root',
      password: 'password',
      name: 'newuser'
    }

    const token = await api.post('/api/login').send(login).then(result => result.body)

    console.log(token);
  
    expect(login).toMatchObject((({username, name}) => ({username, name}))(token))


  })
})

})

describe('tests with logged in user', () => {
  test('returns 200, login success and post', async () => {

    const userLoggingIn = {username: 'root', password: 'password'}

    const result = await api.post('/api/login').send(userLoggingIn).expect(200).then(result => result.body)
    
    expect(result).not.toBe(null)
  })
})

afterAll(() => {
  mongoose.disconnect()
})

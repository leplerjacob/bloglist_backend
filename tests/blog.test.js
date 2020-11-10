const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const { expect } = require('@jest/globals')
const { initialBlogs } = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogsObject = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogsObject.map((blog) => blog.save())
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

  test('succeeds if latest blog is successfully posted', async () => {
    const blogToPost = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
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

    const blogIdToDelete = helper.initialBlogs[0].id

    await api.delete(`/api/blogs/${blogIdToDelete}`).expect(204)

    const blogsAfter = await api.get('/api/blogs').expect(200)

    expect(blogsAfter).toEqual(helper.initialBlogs.length - 1)

  })
})

afterAll(() => {
  mongoose.connection.close()
})

const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const { expect } = require('@jest/globals')
const { resolve } = require('path')

describe('When multiple blogs are in database', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    const blogsObject = helper.initialBlogs.map((blog) => new Blog(blog))
    const promiseArray = blogsObject.map((blog) => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs returned as json', async () => {
    const blogsInDB = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns total number of blogs', async () => {
    const result = await api.get('/api/blogs')
    expect(result.body.length).toEqual(helper.initialBlogs.length)
  })

  test('existence of blog property id', async () => {
    const blogsInDB = await api.get('/api/blogs')
    const singleBlog = blogsInDB.body[0]
    expect(singleBlog.id).toBeDefined()
  })

  describe('posting of blog', () => {
    test('verifies post of blog', () => {
      const blogToPost = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
      }

      return new Promise((resolve, reject) => {
        api
          .post('/api/blogs')
          .send(blogToPost)
          .then(() => {
            api.get('/api/blogs').then((blogs) => {
              resolve(
                expect(blogs.body.length).toEqual(
                  helper.initialBlogs.length + 1
                )
              )
            })
          })
      })

      //   console.log(api.post('/api/blogs').send(blogToPost));

      //   const postReqPromise = () => new Promise((resolve, reject) => {
      //       api.post('/api/blogs', (err, res) => {
      //           if(err) return err;
      //           else return res
      //       }).send(blogToPost).then(value => value)
      //   })

      //   await api.post('/api/blogs').send(blogToPost)

      //   const blogs = await api.get('/api/blogs')

      //   expect(blogs.body.length).toEqual(7)
    })
  })
})

describe('favorite blog', () => {
  test('if list contains more than one blog, equals the blog with most likes', async () => {
    const blogWithMostLikes = (({ title, author, url }) => ({
      title,
      author,
      url,
    }))(listMultipleBlogs[2])

    const result = listHelper.favoriteBlog(listMultipleBlogs)
    expect(result).toEqual(blogWithMostLikes)
  })
})

describe('author with most blogs', () => {
  test('if blog list is not 0, returns author with most blogs', () => {
    const result = listHelper.mostBlogs(listMultipleBlogs)
    expect(result).toEqual(['Robert C. Martin', 3])
  })
})

describe('returns author with most likes', () => {
  test('if blog list is not 0, returns author with most likes', () => {
    const result = listHelper.mostLikedAuthor(listMultipleBlogs)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
  })
})

afterAll(() => {
  mongoose.connection.close()
})

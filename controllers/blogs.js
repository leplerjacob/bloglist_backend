const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({})
    .populate('user', {
      username: 1,
    })
    .then(async (blogs) => {
      response.json(blogs)
      const users = await User.find({}).then((users) => {
        const currentBlogs = blogs.map((blog) => JSON.stringify(blog.id))
        let userBlogs = []
        users.map(async (user) => {
          user.blogs.forEach((blog) => {
            if (currentBlogs.includes(JSON.stringify(blog))) {
              userBlogs.push(blog)
            }
          })
          await User.findByIdAndUpdate(user.id, {blogs: userBlogs}, )
        })
      })
    })
})

blogsRouter.get('/:id', async (request, response, next) => {
  const singleBlog = await Blog.findById(request.params.id).then((blog) =>
    response.json(blog)
  )
})

const retrieveToken = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.post('/', async (request, response) => {
  const blogProps = request.body
  const payload = request.user
  if (payload) {
    const newBlog = await new Blog({
      title: blogProps.title,
      author: blogProps.author,
      url: blogProps.url,
      likes: blogProps.likes,
      user: payload.id,
    })
    const savedBlog = await newBlog.save()
    const user = await User.findById(payload.id)
    user.blogs = await user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(200).json(savedBlog)
  } else {
    response.status(400).json({ error: 'Missing authentication' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const updatedBlog = {
    likes: body.likes,
  }

  await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
    .then((updatedBlog) => {
      response.json(updatedBlog)
    })
    .catch((error) => console.log(error))
})

blogsRouter.delete('/:id', async (request, response) => {
  if (request.user) {
    const deletedBlog = await Blog.findByIdAndRemove(
      request.params.id
    ).then((res) => res.toJSON())

    const user = await User.findById(request.user.id)

    await User.findByIdAndUpdate(request.user.id, {
      blogs: user.blogs.filter((blog) => blog.toString() !== request.params.id),
    })

    response.status(200).json(deletedBlog).end()
  } else {
    response.status(401)
  }
})

module.exports = blogsRouter

// 5fc92a770552e15a30b5fe6b

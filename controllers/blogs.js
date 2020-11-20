const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response, next) => {
  await Blog.find({}).then((blogs) => {
    response.json(blogs)
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
  const token = retrieveToken(request)
  const blogProps = request.body
  if (token) {
    const payload = jwt.verify(token, process.env.SECRET).catch(err => response.status(400).json({ error: 'Error with authorization' }))

    const user = await User.findById(payload.id)
  
    const newBlog = new Blog({
      title: blogProps.title,
      author: blogProps.author,
      url: blogProps.url,
      likes: blogProps.likes || null,
      user: user._id
    })

    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)
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
  await Blog.findByIdAndRemove(request.params.id)

  response.status(204).end()
})

module.exports = blogsRouter

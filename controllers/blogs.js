const Blog = require('../models/blog')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response, next) => {
  await Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.get('/:id', (request, response, next) => {
  const singleBlog = Blog.findById(request.params.id).then((blog) =>
    response.json(blog)
  )
  console.log(singleBlog)
})

blogsRouter.post('/', (request, response, next) => {
  const blogCheck = (({ title, url }) => ({ title, url }))(request.body)

  if (blogCheck.title === undefined || blogCheck.url === undefined) {
    console.log('undefined check ran')
    response.status(400).end()
  } else {
    const blog = new Blog(request.body)

    blog
      .save()
      .then((result) => {
        return result.toJSON()
      })
      .then((formattedResult) => {
        response.status(201).json(formattedResult)
      })
      .catch((error) => {
        next(error)
      })
  }
})

blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id).then(() =>
    response.status(204)
  )
})

module.exports = blogsRouter

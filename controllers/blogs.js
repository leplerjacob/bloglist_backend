const Blog = require('../models/blog')
const blogsRouter = require('express').Router()

blogsRouter.get('/', (request, response, next) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then((result) => {
      return result.toJSON()
    })
    .then((formattedResult) => {
      response.status(201).json(formattedResult)
    })
    .catch((error) => next(error))
})

module.exports = blogsRouter

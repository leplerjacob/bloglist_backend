const Blog = require('../models/blog')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response, next) => {
  await Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.get('/:id', (request, response, next) => {
  const singleBlog = Blog.findById(request.params.id).then(blog => response.json(blog))
  console.log(singleBlog);
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

blogsRouter.delete('/:id', (request, response, next) => {

  const blogToDelete = Blog.findById(request.params.id)
  console.log(blogToDelete);

})

module.exports = blogsRouter

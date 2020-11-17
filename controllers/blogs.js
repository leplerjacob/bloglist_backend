const Blog = require('../models/blog')
const blogsRouter = require('express').Router()

blogsRouter.get('/',async (request, response, next) => {
  await Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.get('/:id', async (request, response, next) => {
  const singleBlog = await Blog.findById(request.params.id).then((blog) =>
    response.json(blog)
  )
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

blogsRouter.put('/:id', async (request, response) => {

  const body = request.body

  const updatedBlog = {
    likes: body.likes
  }

  await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {new: true}).then((updatedBlog) => {response.json(updatedBlog)}).catch(error => console.log(error))
  
})

blogsRouter.delete('/:id', async (request, response) => {

  await Blog.findByIdAndRemove(request.params.id)

  response.status(204).end()
})

module.exports = blogsRouter

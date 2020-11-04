const { log } = require('console')
const blog = require('../models/blog')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  let mostLiked = blogs[0]
  blogs.map((blog) => {
    if (blog.likes >= mostLiked.likes) {
      mostLiked = blog
    }
  })
  console.log((({ title, author, url }) => ({ title, author, url }))(mostLiked))
  return (({ title, author, url }) => ({ title, author, url }))(mostLiked)
}

const mostBlogs = (blogs) => {
  let blogsPerAuthor = {}
  blogs.map((blog) => {
    if (!blogsPerAuthor[blog.name]) {
      blogsPerAuthor[blog.name] = { author: blog.name, numPosts: 1 }
    } else {
      blogsPerAuthor[blog.name] = { ...rest, numPosts: ++blog.numPosts }
    }
  })
  console.log(blogsPerAuthor);
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}

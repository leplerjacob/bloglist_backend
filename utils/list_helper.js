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
  return (({ title, author, url }) => ({ title, author, url }))(mostLiked)
}

const mostBlogs = (blogs) => {
  let blogsPerAuthor = {}

  blogs.map((blog) => {
    if (blogsPerAuthor[blog.author] === undefined) {
      blogsPerAuthor[blog.author] = 1
    } else {
      blogsPerAuthor[blog.author] = blogsPerAuthor[blog.author] + 1
    }
  })

  const authorWithMostPosts = Object.entries(blogsPerAuthor).reduce((a, b) =>
    blogsPerAuthor[a] > blogsPerAuthor[b] ? a : b
  )

  return authorWithMostPosts
}

const mostLikedAuthor = (blogs) => {
  let likesPerAuthor = {}

  blogs.map((blog) => {
    if (likesPerAuthor[blog.author] === undefined) {
      likesPerAuthor[blog.author] = blog.likes
    } else {
      likesPerAuthor[blog.author] = likesPerAuthor[blog.author] + blog.likes
    }
  })

  const authorWithMostLikes = Object.keys(likesPerAuthor).reduce((a, b) =>
    likesPerAuthor[a] > likesPerAuthor[b] ? a : b
  )
  return {
      author: authorWithMostLikes,
      likes: likesPerAuthor[authorWithMostLikes]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikedAuthor,
}

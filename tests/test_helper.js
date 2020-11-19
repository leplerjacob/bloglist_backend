const Blog = require('../models/blog')

initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
]

const initialUsers = [
  {
    blogs: [],
    username: 'root',
    name: 'newuser',
    passwordHash: 'password',
    _id: '5fb2d0adffb0350ea0edac6c',
    __v: 0,
  },
  {
    blogs: [],
    username: 'JoeSchmoe',
    name: 'Joe Schmoe',
    passwordHash: 'joeschmoe',
    _id: '5fb4278186406d085cb83786',
    __v: 0,
  },
]

const findAll = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

// Returns most favorite blog
const favoriteBlog = (blogs) => {
  let mostLiked = blogs[0]
  blogs.map((blog) => {
    if (blog.likes >= mostLiked.likes) {
      mostLiked = blog
    }
  })

  return mostLiked
  // return (({ title, author, url }) => ({ title, author, url }))(mostLiked)
}

module.exports = {
  initialBlogs,
  initialUsers,
  favoriteBlog,
  findAll,
}

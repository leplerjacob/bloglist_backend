const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()


usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.status(200).json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.password || body.password === '') {
    response.status(400).json({ error: 'A password must be provided' })
  } else if(body.password.length < 3) {
    response.status(400).json({ error: 'Password must meet specifications' })
  } else {
    const saltRounds = 10
    let passwordHash

    passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.status(200).json(savedUser)
  }
})

module.exports = usersRouter

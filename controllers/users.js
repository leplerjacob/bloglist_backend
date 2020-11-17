const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()

usersRouter.get('/', async (request, response, next) => {
  await User.find({}).then(result => response.json(result))
})

usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  if (request.body.password < 3) {
    response.status(400).json({ error: 'Invalid username or password' })
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

    response.json(savedUser)
  }
})

module.exports = usersRouter

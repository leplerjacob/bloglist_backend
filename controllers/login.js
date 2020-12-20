const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {

  const body = request.body

  console.log("this runs")

  const user = await User.findOne({ username: body.username })

  if (!user) {
    response.status(404).json({ error: 'Invalid username or password' })
  } else {
    const passCorrect = await bcrypt.compare(body.password, user.passwordHash)

    if (!passCorrect) {
      response.status(404).json({ error: 'Invalid username or password' })
    } else {
      const payload = passCorrect ? { id: user._id } : null

      if (!payload) {
        response.status(404).json({ error: 'Invalid username or password' })
      } else {
        const token = jwt.sign(payload, process.env.SECRET)
        response
          .status(200)
          .send({ token, username: user.username, name: user.name })
      }
    }
  }
})

module.exports = loginRouter

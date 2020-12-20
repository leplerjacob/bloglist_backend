const jwt = require('jsonwebtoken')

const extractTokenAndVerify = async (request, response, next) => {
  
  const reqMethods = ['POST', 'DELETE', 'PUT']

  if (
    request.path.includes('/api/blogs') &&
    reqMethods.indexOf(request.method) !== -1 &&
    request.get('Authorization') !== null && typeof request.get('Authorization') !== 'undefined' 
  ) {
    const [method, token] = request.get('authorization').split(' ')

    request.token = token

    const user = await jwt.verify(token, process.env.SECRET)

    if (user) {
      request.user = user
    }
  }
  next()
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'Malformatted id' })
  } else if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map((err) => err.message)
    return response.status(400).json({ error: message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else {
    console.log(error)
  }
}

module.exports = {
  errorHandler,
  extractTokenAndVerify,
}

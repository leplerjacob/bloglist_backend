const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'Malformatted id' })
  } else if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map(err => err.message); 
    return response.status(400).json({ error: message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }
}

module.exports = {
  errorHandler,
}

const errorHandler = (error, request, response, next) => {
  // console.log(error.message);
  if (error.message) {
    return response.status(400).json({ error: 'There was an error' })
  }
  next(error)
}

module.exports = {
    errorHandler
}

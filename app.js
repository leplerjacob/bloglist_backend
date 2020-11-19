const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const middleware = require('./utils/middleware')
const app = express()
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect(config.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).then(() => {
    console.log("Connected to database", config.MONGOURL);
}).catch((err) => {
    console.log("Connection error", err);
})

app.use(cors())
app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use(middleware.errorHandler)

module.exports = app
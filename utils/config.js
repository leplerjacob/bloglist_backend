const mongoose = require('mongoose')
require('dotenv').config()

const MONGOURL = process.env.MONGODB_URL

const PORT = 3003

module.exports = {
    MONGOURL,
    PORT
}

const mongoose = require('mongoose')
require('dotenv').config()

let MONGOURL

if(process.env.NODE_ENV === 'test') {
  MONGOURL = process.env.MONGODB_URL_TEST
} else {
  MONGOURL = process.env.MONGODB_URL
}

const PORT = 3003

module.exports = {
    MONGOURL,
    PORT
}

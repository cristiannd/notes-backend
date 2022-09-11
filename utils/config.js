require('dotenv').config()

const PORT = process.env.PORT || 3001
let MONGODB_URI = process.env.MONGODB_URI
const SECRET = process.env.SECRET || 'secret'

if(process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
  PORT,
  MONGODB_URI,
  SECRET,
}

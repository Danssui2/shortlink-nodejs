const mongoose = require('mongoose')
const Url = require('./Url.js')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  email:{
    type: String,
    required: true,
  },
  links: [],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('User', UserSchema)

const mongoose = require('mongoose')

const UrlSchema = new mongoose.Schema({
  uID: {
    type: String,
    required: true,
  },
  urlID: {
    type: String,
    required: true,
  },
  oriUrl: {
    type: String,
    required: true,
  },
  miniUrl: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  owner: [],
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  date: {
    type: String,
    default: Date.now,
  }
})

module.exports = mongoose.model('Url', UrlSchema)
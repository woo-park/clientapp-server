const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var ThreadsSchema = new Schema({
  threadID: {
    type: String,
    required: false,
  },
  text: {
    type: String,
    required: false,
  },
  updated: {
    type: Date,
    default: Date.now
  },
  userID: {
    type: String,
    required: false,
  },
  placeID: {
    type: String,
    required: false,
  },
  commentID:{
    type: String,
    required: false,
  }
})

module.exports = mongoose.model('Threads', ThreadsSchema)

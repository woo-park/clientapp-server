const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var CommentsSchema = new Schema({
  commentID: {
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
  threadsID: [String],
})

module.exports = mongoose.model('Comments', CommentsSchema)

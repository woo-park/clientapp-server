const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var PostsSchema = new Schema({
  like: {
    type: Number,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  placeName: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  placeType: {
    type: String,
    required: false,
  },
  placeID: {
    type: String,
    unique: true,
    required: false,
  },
  commentsID: [String]
})

module.exports = mongoose.model('Posts', PostsSchema)

const mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
  isbn: String,
  title: String,
  author: String,
  description: String,
  published_date: {type: Date},
  publisher: String,
  updated_date: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Book', BookSchema);
// mongoose.model('Book', BookSchema);

//this will be imported in /routes/book.js and handled with get,post,delete

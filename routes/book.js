const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const Book = require('../models/Book.js')
// Book = mongoose.model('Book')

// need these two to authenticate
const passport = require('passport')
require('../config/passport')(passport);


/*
router.get('/', function(req, res, next){     // api/book

  Book.find(function (err, products) {
    if(err) return next(err);
    res.json(products)    //send back to client as json
  })
})

router.post('/', function (req, res, next){
  Book.create(req.body, function(err, post) {
    if(err) return next(err)
    res.json(post);
  })
})
*/


// api/book
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res) {
  let token = getToken(req.headers);
  if (token) {
    Book.find(function(err, books){
      if(err) return next(err);
      res.json(books)
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})


function getToken (headers) {
  console.log(headers,'headers - gettoken')
  if (headers && headers.authorization) {
     var parted = headers.authorization.split(' ');
     if (parted.length === 2) {
       return parted[1];
     } else {
       return null;
     }
   } else {
     return null;
   }
}



module.exports = router;

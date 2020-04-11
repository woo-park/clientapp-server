const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
Book = mongoose.model('Book')
User = mongoose.model('User')
const Nodes = require('../models/Nodes.js')


// need these two to authenticate
const passport = require('passport')
require('../config/passport')(passport);

// /api/userDB
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res) {
  console.log(req,'ss')
  let token = getToken(req.headers);
  if (token) {
    // Book.find(function(err, books){
    //   if(err) return next(err);
    //   res.json(books)
    // });
    Nodes.find({},function(err, nodes){
      if(err) return next(err);
      console.log(nodes, 'from get')
      res.json(nodes)
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

router.post('/', function(req, res) {    // /api/auth/register
  if (!req.body) {
    res.json({success: false, msg: 'Please pass initial nodes'})
  } else {
    console.log(req.body,'reqbod')
    initialNodes = req.body
    initialNodes.forEach((each) => {
      Nodes.findOneAndUpdate({id:each.id},{ id: each.id, name: each.name, interests: each.interests }, function(err, result){
        if(err) return next(err);


        if(result === null) {
          console.log(result,'result is null- does not exist before')
          let newNode = new Nodes({
            id: each.id,
            name: each.name,
            interests: each.interests,
          })

          newNode.save(function(err){
            if(err) {
              console.log('failed to save')
            }
            console.log('successfully saved')
          })
        } else {
          console.log('findOneAndUpdate success')
        }
      })
      //

    })

    console.log(req.body.initialNodes)
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

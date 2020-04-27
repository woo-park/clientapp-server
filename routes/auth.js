const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
// const User = require('../models/User.js')

const express = require('express');
let jwt = require('jsonwebtoken');
const router = express.Router();

const passport = require('passport');
const settings = require('../config/settings');

// passport.use(User);  //middleware

require('../config/passport')(passport)
User = mongoose.model('User');

router.post('/register', function(req, res) {    // /api/auth/register

  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password'})
  } else {

    console.log(req.body.username)
    console.log(User)
    let newUser = new User({
      username: req.body.username,
      password: req.body.password,
      userID: uuidv4()
    })
    console.log(newUser)


    newUser.save(function(err){
      console.log('saving and failed?')
      if(err) {
        return res.json({success: false, msg: 'Username already exists.'})
      }
      res.json({success: true, msg: 'New user successfully created.'})
    })
  }
})

router.post('/login', function(req, res) {

  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found'})
    } else {
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          let token = jwt.sign(user.toJSON(), settings.secret);
          // console.log(user, user.userName, user.userID,'ID??', isMatch)  //sometimes false bc some are registered without userIDs


          res.json({success: true, token: 'JWT ' + token, userName: user.username, userID: user.userID});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'})
        }
      })
    }
  })
})


router.get('/', passport.authenticate('jwt', {session: false}), function(req, res) {
  let token = getToken(req.headers);
  if (token) {
    console.log(req.user._id,'REQQ')
    User.findOne(
      {
        _id:req.user._id
      },
      function(err, result){
      if(err) return next(err);
      console.log(result,'result')
      let user = {username: result.username, userID: result.userID}

      res.send(user)
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

const mongoose = require('mongoose')

const express = require('express')
let jwt = require('jsonwebtoken')
const router = express.Router()

const passport = require('passport')
const Comments = require('../models/Comments.js') //initial model pulling
const Threads = require('../models/Threads.js') //initial model pulling
const { v4: uuidv4 } = require('uuid');

let Posts = mongoose.model('Posts')

require('../config/passport')(passport)
// let Comments = mongoose.model('Comments')


// , passport.authenticate('jwt', {session: false}),
router.get('/comments', function(req, res) {  //api/blog/comments
  // let token = getToken(req.headers)
  // if (token) {
    Comments.find({}, function(err, result) {
      if(err) return next(err)
      console.log('access granted')
      // res.json(result)
      res.send(result)
    })
  // } else {
  //   return res.status(403).send({success: false, msg: 'Unauthorized.'})
  // }
})

// https://stackoverflow.com/questions/33049707/push-items-into-mongo-array-via-mongoose

// curl -d "text=testText&userID=1234&placeID=3344" https://128.199.93.14/api/blog/comments


router.post('/comments', function(req, res) {
  if(!req.body.text || !req.body.userID || !req.body.placeID) {
    res.json({success: false, msg: 'Please finish comment to save.'})
  } else {
    let newComment = new Comments({
      commentID: uuidv4(),
      text: req.body.text,
      updated: Date.now(),
      userID: req.body.userID,
      placeID: req.body.placeID
    })

    Posts.findOneAndUpdate({
        // placeID: "d3579650-893d-4e01-a0d5-48373c85b3f8" //which will be replaced with req.body.placeID
        placeID:req.body.placeID
      }, { $push: {
                  commentsID: newComment.commentID
      }},function(err, result) {
        if(err) return next(err)
        console.log(result, 'pushed commentID')
    })



    newComment.save(function(err) {
      if(err) {
        return res.json({success: false, msg: 'Failed to save the comment'})
      }
      res.json({success: true, msg: 'New comment successfully saved.'})
    })


  }
})


// curl -d "text=how%20was%20it?&userID=1234&&placeID=3344placeid" http://localhost:3002/api/blog/comments

// curl -d "text=it%20was%20great?&userID=5554&&placeID=5544placeid" http://localhost:3002/api/blog/comments


// curl -d "text=test%2nd&userID=1234&&placeID=3344placeid" http://localhost:3002/api/blog/comments

// curl -d "text=test%2nd&userID=1234&&placeID=3344placeid" https://128.199.93.14/api/blog/comments

router.post('/threads', function(req, res) {
  if(!req.body.text || !req.body.userID || !req.body.placeID || !req.body.commentID) {
    res.json({success: false, msg: 'Please finish comment to save.'})
  } else {
    let newThread = new Threads({
      threadID: uuidv4(),
      text: req.body.text,
      updated: Date.now(),
      userID: req.body.userID,
      placeID: req.body.placeID,
      commentID: req.body.commentID,
    })

    Comments.findOneAndUpdate({
        // placeID: "d3579650-893d-4e01-a0d5-48373c85b3f8" //which will be replaced with req.body.placeID
        commentID:newThread.commentID
      }, { $push: {
                  threadsID: newThread.threadID
      }},function(err, result) {
        if(err) return next(err)
        console.log(result, 'pushed new threadID')
    })

// userID, placeID, text, commentID

    newThread.save(function(err) {
      if(err) {
        return res.json({success: false, msg: 'Failed to save the thread'})
      }
      res.json({success: true, msg: 'New thread successfully saved.'})
    })
  }
})


router.get('/threads', function(req, res) {  //api/blog/comments
  // let token = getToken(req.headers)
  // if (token) {
    Threads.find({}, function(err, result) {
      if(err) return next(err)
      console.log('access granted')
      // res.json(result)
      res.send(result)
    })
  // } else {
  //   return res.status(403).send({success: false, msg: 'Unauthorized.'})
  // }
})



// curl -d "text=thread%20comment&userID=d09eb884-a65f-40a2-90cc-b1821b5a828d&placeID=d3579650-893d-4e01-a0d5-48373c85b3f8&commentID=ff943730-4a83-42e8-9ef8-16ef8bf8526c" http://localhost:3002/api/blog/threads




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

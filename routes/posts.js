const mongoose = require('mongoose')

const express = require('express')
let jwt = require('jsonwebtoken')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');

const passport = require('passport')
const Posts = require('../models/Posts.js') //initial model pulling

require('../config/passport')(passport)
// let Posts = mongoose.model('Posts')

// passport.authenticate('jwt', {session: false}),
router.get('/posts',  function(req, res) {  //api/blog/posts
  // let token = getToken(req.headers)
  // if (token) {
    Posts.find({}, function(err, result) {
      if(err) return next(err)
      console.log('access granted')
      console.log(result,'maybe this is not array')

      // res.json(result)
      res.send(result)
    })
  // } else {
  //   return res.status(403).send({success: false, msg: 'Unauthorized.'})
  // }
})

// curl -d "description=test&placeName=Maru&address=jeju&placeType=cafe" http://localhost:3002/api/blog/posts
// curl -d "description=expensive&placeName=Kairos&address=jeju&placeType=restaurant" http://localhost:3002/api/blog/posts

router.post('/posts', function(req, res) {  //api/blog/posts
  if(!req.body.placeName || !req.body.address || !req.body.placeType || !req.body.description) {
    res.json({success: false, msg: 'Please pass more information about the place.'})
  } else {
    let newPost = new Posts({
      like: 0,
      description: req.body.description,
      placeName: req.body.placeName,
      address: req.body.address,
      placeType: req.body.placeType,
      placeID: uuidv4(),
      commentsID: []
    })

    newPost.save(function(err) {
      if(err) {
        return res.json({success: false, msg: 'Failed to update given place.'})
      }
      res.json({success: true, msg: 'New post successfully created.'})
    })
  }
})

myProjects = [
  {
    like: 0,
    description: 'Entire fresh, delicious vegan cakes are available to order!  Wholewheat, organic bread can also be bought in our cafe.',
    placeName: 'And 유 (Yu) Café',
    address: '518 Hallim-ro 한림읍 Jeju-si Jeju-do KR',
    placeType: 'Cafe',
    placeID: uuidv4(),
    commentsID: []
  },
  {
    like: 0,
    description: 'Our Indian Kitchen is a restaurant serving Indian traditional cuisine and a Muslim halal dish.',
    placeName: 'Indian Kitchen',
    address: '191, Aewon-ro, Aewol-eup | Baghdad House, Jeju, Jeju Island 63036, South Korea',
    placeType: 'Indian Restaurant',
    placeID: uuidv4(),
    commentsID: []
  }
]

myProjects.forEach(each => {
  Posts.findOne({placeName: each.placeName}).lean().then(result => {
    if(result) {
      // we skip bc we dont want to overwrite everytime server re-runs
      /*
      Posts.updateOne({ placeName: each.placeName }, {
        $set: {
          like: each.like,
          description: each.description,
          placeName: each.placeName,
          address: each.address,
          placeType: each.placeType,
          placeID: each.placeID,
          commentsID: each.commentsID,
        }
      })
      .then((result)=> {
        console.log('updated existing one', result)
      })
      */
    }
    else {
      const initPost = new Posts({
        like: each.like,
        description: each.description,
        placeName: each.placeName,
        address: each.address,
        placeType: each.placeType,
        placeID: each.placeID,
        commentsID: each.commentsID,
      })
      initPost.save(function (err, saved) {
			  if (err) {
          console.log('error occured saving initPost')
        } else {
          console.log('saved!', saved)
        }

			})
    }
  })
})

// let initialPost = new Posts({
//   like: 0,
//   description: 'Entire fresh, delicious vegan cakes are available to order!  Wholewheat, organic bread can also be bought in our cafe.',
//   placeName: 'And 유 (Yu) Café',
//   address: '518 Hallim-ro 한림읍 Jeju-si Jeju-do KR',
//   placeType: 'Cafe',
//   placeID: uuidv4(),
//   commentsID: []
// })
//
// initialPost.save(function(err) {
//   if(err) {
//     console.log('fail to save initialPost')
//   }
//   console.log('successfully saved initialPost')
// })





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

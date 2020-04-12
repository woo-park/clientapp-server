const express = require('express')
const router = express.Router();
// const mongoose = require('mongoose')
// Book = mongoose.model('Book')
// User = mongoose.model('User')
const Nodes = require('../models/Nodes.js')
const request = require('request')
const fs = require('fs')
let path = require('path')


// need these two to authenticate
const passport = require('passport')
require('../config/passport')(passport);

// fs.readFile('sample.csv', async (err, data) => {
//   if (err) {
//     console.error(err)
//     return
//   }
//   await function formatCsv (data) {
//     console.log(data)
//   }
//   formatCsv(data)
// })

let sampleData = ''
let filePath = path.join(__dirname, 'sample.csv');
fs.readFile(filePath, {encoding: 'utf-8'}, (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  sampleData = data
})


// /api/waveDB
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res) {
  let token = getToken(req.headers);
  if (token) {
    console.log('access granted')
    res.send(sampleData)
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

router.post('/', function(req, res) {    // /api/waveDB
  if (!req.body) {
    res.json({success: false, msg: 'Please pass initial nodes'})
  } else {
    console.log(req.body,'reqbod')
    // console.log(req.body.initialNodes)
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



// /api/waveDB/sample
router.get('/sample', function(req, res) {
  if (sampleData) {
    res.send(sampleData)
  } else {
    return res.status(403).send({success: false, msg: 'Sample Data Missing.'})
  }
})

let areacode = null
let acc;
let my_lat_lon = null;

// api/waveDB/data
router.get('/data', function(req, res) {
  if (areacode != null) {
  } else if (areacode == null) {
      areacode = {areacode: 52200}
  }
  console.log(areacode,'AREACODE')

  console.log('get -> areacode.areacode : ', areacode.areacode);

  return new Promise((resolve, reject) => {
      request(`http://coolwx.com/cgi-bin/findbuoy.cgi?id=${areacode.areacode}`, function(error, response, html){
        if(error) {
          console.log('err occured while requesting');
        }
        if(!error){
          const splitData = html.split("<HR>")[1];
          const splitData2 = splitData.split("</PRE>")[0]
          const lines = splitData2.split(/\r\n|\n|\r/);

          heights = [];
          periods = [];
          let tide = [1.4,1.2, 1.0, 0.8, 0.6, 0.4, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.2, 1.0, 0.8, 0.6, 0.4, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2]
          acc = 'Offset,Height,Period\n'
          for (let i = 1; i < lines.length - 1; i ++) {
            let lat_lon = lines[i].substr(13, 11);
            my_lat_lon = lat_lon;

            let offset = tide[(i-1) % 24]
            let height = lines[i].substr(71, 4).trim();
            let period = lines[i].substr(76, 2);

            if (height == '    ' || period == '  '){
            } else{
              acc += offset
              acc += ','
              acc += height
              acc += ','
              acc += period
              acc += '\n'
            }
          }
          console.log('my_lat_lon in scraping 1 : ', my_lat_lon)
          // console.log('acc in scraping 1 : ', acc)
          console.log('scraping finished')
          resolve('thanks for waiting')
        }
      });
    }).then((resolve)=>{
      console.log(resolve)
      res.send(`${acc}<br\/>${my_lat_lon}`);
    });
})

// api/waveDB/data
router.post('/data', function(req, res, next) {
  if(req.body) {
    // req.session.areacode = req.body;
    areacode = req.body
    console.log(areacode,'check it out')
    // console.log('post -> assigned req.session.areacode : ', req.session.areacode);

    return new Promise((resolve, reject) => {
        request(`http://coolwx.com/cgi-bin/findbuoy.cgi?id=${areacode.areacode}`, function(error, response, html){
          if(error) {
            console.log('err occured while requesting');
          }
          if(!error){
            const splitData = html.split("<HR>")[1];
            const splitData2 = splitData.split("</PRE>")[0]
            const lines = splitData2.split(/\r\n|\n|\r/);

            heights = [];
            periods = [];
            let tide = [1.4,1.2, 1.0, 0.8, 0.6, 0.4, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.2, 1.0, 0.8, 0.6, 0.4, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2]
            //adding tide offset manually
            acc = 'Offset,Height,Period\n'
            for (let i = 1; i < lines.length - 1; i ++) {
              let lat_lon = lines[i].substr(13, 11);
              my_lat_lon = lat_lon;

              let offset = tide[(i-1) % 24]
              let height = lines[i].substr(71, 4).trim();
              let period = lines[i].substr(76, 2);

              if (height == '    ' || period == '  '){
              } else{
                acc += offset
                acc += ','
                acc += height
                acc += ','
                acc += period
                acc += '\n'
              }
            }
            console.log('my_lat_lon in scraping 1 : ', my_lat_lon)
            // console.log('acc in scraping 1 : ', acc)
            console.log('scraping finished')
            resolve('thanks for waiting')
          }
        });
      }).then((resolve)=>{
        console.log(resolve)
        res.send(`${acc}<br\/>${my_lat_lon}`);
      });
  }
  else {
    console.warn('req body does not exist');
  }
  // areacode = req.body;
  // console.log('post -> areacode.areacode after posting: ', areacode.areacode)
	// scrape(areacode.areacode);
	// res.send(`${acc}<br\/>${my_lat_lon}`);
});





module.exports = router;
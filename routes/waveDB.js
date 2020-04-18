const express = require('express')
const router = express.Router();
// const mongoose = require('mongoose')
// Book = mongoose.model('Book')
// User = mongoose.model('User')
const Nodes = require('../models/Nodes.js')
const request = require('request')
const fs = require('fs')
let path = require('path')
const utf8 = require('utf8')
var cheerio = require('cheerio')


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


let acc;
let my_lat_lon = null;

// api/waveDB/data
router.get('/data', function(req, res) {
  let areacode = null

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




// mini/marine/marine_buoy_cosmos.jsp?stn=22458`
router.get('/official', function(req, res, next) {
  let areacode
  if (req.body) {
    areacode = req.body
  } else {
    areacode = 22457 //default jungmun
  }
// &dtm=-3
  let uri = `http://www.weather.go.kr/mini/marine/marine_buoy_cosmos.jsp?stn=${22457}&tm=${yyyymmddhh()}`
  const options = {
    uri: uri,
    method: 'GET'
  }

  let accData = 'Offset,Height,Periods,Date,Time,Temp\n'
  return new Promise((resolve, reject) => {
    request(options, function(error, response, html) {
      if(error) {
        console.log('err occured while requesting');
      }
      let rows = [] // should append here

      $ = cheerio.load(html);
      let table_develop = $('table[class=table_develop] tbody tr').each((index, element) => {
        // console.log($(element).html())
        let tdRow = $(element).find('td')
        let listRow = []

        tdRow.each((i, item) => {
          listRow.push($(item).text())
          /*
          accData += parseFloat(tdRow[2].text()).toFixed(1).trim()
          accData += ','

          accData += parseFloat(tdRow[4].text()).toFixed(1).trim()
          accData += ','
          console.log(tdRow[0].html())

          if(i == 0) { //time
            accData += tide[index % 24].toFixed(1)    // adding offset here bc time isn't neccesary now
            accData += ','

          } else if (i == 1) { //유의

          } else if (i == 2) {  // max
              accData += parseFloat($(item).text()).toFixed(1).trim()
              accData += ','
          } else if (i == 3) {   // average

          } else if (i == 4) {  // periods
              accData += parseFloat($(item).text()).toFixed(1).trim()
              accData += '\n'
          } else if (i == 5) {  // water temp

          }
          */
        })


          accData += tide[index % 24].toFixed(1)    // adding offset here bc time isn't neccesary now
          accData += ','

          accData += parseFloat(listRow[2]).toFixed(1).trim()
          accData += ','

          accData += parseFloat(listRow[4]).toFixed(1).trim()
          accData += ','

          accData += listRow[0].slice(1,3)    //date
          accData += ','

          accData += listRow[0].slice(6,8)  //time
          accData += ','

          accData += listRow[5].trim()      //temp
          accData += '\n'

        // console.log(listRow)
        rows.push($(element).html())
      });
      // console.log($('table[class=table_develop]').html())
      res.send(accData)
    })
  })
})

router.get('/gust', function(req, res, next) {
  let areacode = {areacode: 22184}
  let uri = `http://marine.kma.go.kr/custom/leisure.pop?work=beach&id=21`
  const options = {
    uri: uri,
    method: 'GET'
  }

  return new Promise((resolve, reject) => {
    request(options, function(error, response, html) {
        if(error) {
          console.log('err occured while requesting');
        }
        $ = cheerio.load(html);
        let listRow = []
        let dataDict = {}
        let dataList = []



        // $(element).find('table[class=forecastNew3] thead').children().last().each((i, e) => {
        //   console.log($(e),'s')
        //   // dataList[i] = {1:1}
        // })
        $('table[class=forecastNew3] thead tr th').each((i, e) => {

          dataList[i] = {[$(e).text()]:null}
        })
        console.log(dataList)
        // $(element).find('td').each((i, item) => {
        //
        //   listRow.push($(item).text())
        // })

        let table_develop = $('table[class=forecastNew3] tbody tr').each((index, element) => {


        })
        // console.log(listRow)

        // res.send(table_develop)
        res.send('hi')

    })
  })
  //
  // return new Promise((resolve, reject) => {
  //   request(options, function(error, response, html) {
  //     if(error) {
  //       console.log('err occured while requesting');
  //     }
  //     //
  //     // let acc
  //     $ = cheerio.load(html);
  //     let table_develop = $('table[class=table_develop] tbody tr').each((index, element) => {
  //       let tdRow = $(element).find('td')
  //
  //       tdRow.each((i, item) => {
  //         console.log($(item).text())
  //       })
  //     })
  //     //   // console.log($(element).html())
  //     //   let tdRow = $(element).find('td')
  //     //   let listRow = []
  //     //   //
  //     //   // tdRow.each((i, item) => {
  //     //   //   listRow.push($(item).text())
  //     //   // })
  //     //
  //       // acc += listRow[1] + listRow[2] + listRow[3]
  //
  //     })
  //     // res.send(acc)
  // })


})

function yyyymmddhh() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var h = now.getHours()
    var mm = m < 10 ? '0' + m : m;
    var dd = d < 10 ? '0' + d : d;
    var hh = h < 10 ? '0' + h : h;
    return `${y}.${mm}.${dd}.${hh}`
}

console.log(yyyymmddhh())
router.get('/official/preview', passport.authenticate('jwt', {session: false}), function(req, res, next) {

  let token = getToken(req.headers);

  if (token) {
    console.log('access granted')

    let areacode
    // if (req.body) {
    //   areacode = req.body
    // } else {
      areacode = {areacode: 22457}
    // }


    let uri = `http://www.weather.go.kr/mini/marine/marine_buoy_cosmos.jsp?stn=${areacode.areacode}&tm=${yyyymmddhh()}&dtm=-12`
    const options = {
      uri: uri,
      method: 'GET'
    }
    let accData = 'Offset,Height,Periods,Date,Time,Temp\n'
    return new Promise((resolve, reject) => {
      request(options, function(error, response, html) {
        if(error) {
          console.log('err occured while requesting');
        }

        let rows = [] // should append here

        $ = cheerio.load(html);
        let table_develop = $('table[class=table_develop] tbody tr').each((index, element) => {
          console.log($(element).html())
          let tdRow = $(element).find('td')
          let listRow = []

          tdRow.each((i, item) => {
            listRow.push($(item).text())
          })
            accData += tide[index % 24].toFixed(1)    // adding offset here bc time isn't neccesary now
            accData += ','

            accData += parseFloat(listRow[2]).toFixed(1).trim()
            accData += ','

            accData += parseFloat(listRow[4]).toFixed(1).trim()
            accData += ','

            accData += listRow[0].slice(1,3)    //date
            accData += ','

            accData += listRow[0].slice(6,8)  //time
            accData += ','

            accData += listRow[5].trim()      //temp
            accData += '\n'

          // console.log(listRow)
          rows.push($(element).html())
        });
        // console.log($('table[class=table_develop]').html())
        res.send(accData)
      })
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

router.post('/official', function(req, res, next) {
  let areacode
  if (req.body) {
    areacode = req.body
    console.log(areacode,' received')
  } else {
    console.log('areacode has not been provided')
  }

  let uri = `http://www.weather.go.kr/mini/marine/marine_buoy_cosmos.jsp?stn=${areacode.areacode}`
  const options = {
    uri: uri,
    method: 'GET'
  }

  let accData = 'Offset,Height,Periods,Date,Time,Temp\n'
  return new Promise((resolve, reject) => {
    request(options, function(error, response, html) {
      if(error) {
        console.log('err occured while requesting');
      }
      let rows = [] // should append here

      $ = cheerio.load(html);
      let table_develop = $('table[class=table_develop] tbody tr').each((index, element) => {
        // console.log($(element).html())
        let tdRow = $(element).find('td')
        let listRow = []

        tdRow.each((i, item) => {
          listRow.push($(item).text())
        })
          accData += tide[index % 24].toFixed(1)    // adding offset here bc time isn't neccesary now
          accData += ','

          accData += parseFloat(listRow[2]).toFixed(1).trim()
          accData += ','

          accData += parseFloat(listRow[4]).toFixed(1).trim()
          accData += ','

          accData += listRow[0].slice(1,3)    //date
          accData += ','

          accData += listRow[0].slice(6,8)  //time
          accData += ','

          accData += listRow[5].trim()      //temp
          accData += '\n'

        // console.log(listRow)
        rows.push($(element).html())
      });
      // console.log($('table[class=table_develop]').html())
      res.send(accData)
    })
  })
})


let tide = [1.4,1.2, 1.0, 0.8, 0.6, 0.4, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.2, 1.0, 0.8, 0.6, 0.4, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2]
// api/waveDB/data
router.post('/data', function(req, res, next) {
  let areacode
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
            // let tide = [1.4,1.2, 1.0, 0.8, 0.6, 0.4, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.2, 1.0, 0.8, 0.6, 0.4, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2]
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

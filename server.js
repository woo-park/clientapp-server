const express = require('express');
const app = express();
const path = require('path')
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
require('./db');
const book = require('./routes/book')
const auth = require('./routes/auth')
const userDB = require('./routes/userDB')
const animalsDB = require('./routes/animalsDB')
const waveDB = require('./routes/waveDB')
const cors = require('cors')


app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({'extended':'false'}))
app.use(express.static(path.join(__dirname, 'clientapp-react/build')))
app.use(cors())

app.use('/api/auth', auth)
app.use('/api/book', book)
app.use('/api/userDB', userDB)
app.use('/api/animalsDB', animalsDB)
app.use('/api/waveDB', waveDB)




//catch 404 error and forward to err handler
app.use(function(req, res, next){
  let err = new Error('not Found');
  err.status = 404;
  next(err)
})

app.use(function(err, req, res, next){
  res.locals.message = err.message
  res.locals.error = err

  res.status(err.status || 500);
  res.send(`${err.message}`);
})

const PORT = process.env.PORT || 3002;
app.listen(PORT);
console.log(`server started on port ${PORT}`)

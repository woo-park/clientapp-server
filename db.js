const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mern-secure', {useNewUrlParser:true, useUnifiedTopology: true}).then((data)=>{
  console.log('mongodb connected');
  console.log('mongodb running on mongodb://localhost:27017/mern-secure')
  console.log(data, 'data')
  console.log(data.models,'models');
})

mongoose.set('useFindAndModify', false);

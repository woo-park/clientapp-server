const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mern-secure', {useNewUrlParser:true, useUnifiedTopology: true})

mongoose.set('useFindAndModify', false);

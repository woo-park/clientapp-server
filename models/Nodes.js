const mongoose = require('mongoose');

var NodesSchema = new mongoose.Schema({
  id: Number,
  interests: [],
  name: String,
  updated_date: { type: Date, default: Date.now },
})


//
// const initialNodes = [
//   {
//     id: 0,
//     interests: ['T','I','G','E','R','D','O'],
//     name:'tiger person',
//   },
//   {
//     id: 1,
//     interests: ['D','O','G'],
//     name:'dog person',
//   },
//   {
//     id: 2,
//     interests: ['L','I','O','N','D','H'],
//     name:'Lion person',
//   },
//   {
//     id: 3,
//     interests: ['C','A','T'],
//     name:'Cat person',
//   },
//   {
//     id: 4,
//     interests: ['D','O','L','P','H','I','N'],
//     name:'Dolphin person',
//   }
// ]
//
// const initialAnimals = [
//   {
//     id:100,
//     name: 'TIGER',
//     interests: ['T','I','G','E','R'],
//   },
//   {
//     id:101,
//     name:'DOG',
//     interests: ['D','O','G'],
//   },
//   {
//     id:102,
//     name:'LION',
//     interests: ['L','I','O','N'],
//   },
//   {
//     id:103,
//     name:'CAT',
//     interests: ['C','A','T'],
//   },
//   {
//     id:104,
//     name:'DOLPHIN',
//     interests: ['D','O','L','P','H','I','N'],
//   }
// ]


module.exports = mongoose.model('Nodes', NodesSchema);
// mongoose.model('Book', BookSchema);

//this will be imported in /routes/book.js and handled with get,post,delete

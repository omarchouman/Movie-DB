const mongoose = require('mongoose');


const moviesSchema = new mongoose.Schema(

    {
     title: String,
     year: { type: Number, min: 1900, max:2050},
     rating: Number
     }

);


module.exports = mongoose.model('movie', moviesSchema);
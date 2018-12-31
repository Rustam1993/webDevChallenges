const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const movieSchema  = new Schema ({
  name     : String,
  budget   : Number,
  director : String,
  actors   : Array

})

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
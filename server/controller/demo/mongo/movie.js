var Movie = require('./models/movie.js.js.js.js.js');

var json = require('./movie.json');

if (json._id) {
  //update
} else {
  Movie.save(json, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('save movie success');
    }
  });
}

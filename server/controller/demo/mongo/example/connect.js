var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/nodejs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.set('debug', false);
exports.mongoose = mongoose;

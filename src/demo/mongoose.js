const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/my_database', {
  useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

db.once('open', function () {
  // we're connected!
  const kittySchema = new mongoose.Schema({
    name: String,
  });
  const Kitten = mongoose.model('Kitten', kittySchema);
  const silence = new Kitten({ name: 'Silence' });
  const fluffy = new Kitten({ name: 'fluffy' });
  console.log(silence.name); // 'Silence'

  // silence
  silence.save(function (err, fluffy) {
    if (err) return console.error(err);
  });

  // fluffy
  fluffy.save(function (err, fluffy) {
    if (err) return console.error(err);
  });

  Kitten.find(function (err, kittens) {
    if (err) return console.error(err);
    console.log(kittens);
  });

  Kitten.find({ name: /^fluff/ }, callback);
});

// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

// const BlogPostSchema = new Schema({
//   author: ObjectId,
//   title: String,
//   body: String,
//   date: Date,
// });

// const BlogPostModel = mongoose.model('BlogPost', BlogPostSchema);

// const instance = new BlogPostModel();
// instance.my.key = 'hello';
// instance.save(function (err) {
//   //
// });

// BlogPostModel.find({}, function (err, docs) {
//   // docs.forEach
// });

// You can also findOne, findById, update, etc.

// const instance = await MyModel.findOne({ ... });
// console.log(instance.my.key);  // 'hello'

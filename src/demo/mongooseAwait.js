const mongoose = require('mongoose');

async function main() {
  await mongoose.connect('mongodb://localhost/my_database', {
    useNewUrlParser: true,
    useFindAndModify: false,
    // useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
  });

  const Schema = mongoose.Schema;
  const ObjectId = Schema.ObjectId;

  const BlogPostSchema = new Schema({
    author: ObjectId,
    title: String,
    body: String,
    date: Date,
  });

  const BlogPostModel = mongoose.model('BlogPost', BlogPostSchema);

  const instance = new BlogPostModel();
  instance.title = 'hello';
  instance.save(function (err) {
    //
  });

  await BlogPostModel.find({}, function (err, docs) {
    // docs.forEach
    console.log(docs, 'docs');
  });

  // You can also findOne, findById, update, etc.

  const query = { title: 'jason bourne' };
  const update = { title: 'jason bourne', body: '21' };
  // const options = {
  //   upsert: true,
  //   new: true,
  //   setDefaultsOnInsert: true,
  // };
  const callback = () => {
    console.log('done');
  };
  await BlogPostModel.findOneAndUpdate(query, update, callback);

  // await BlogPostModel.findById(myId, function (err, post) {
  //   if (!err) {
  //     post.comments[0].remove();
  //     post.save(function (err) {
  //       // do something
  //     });
  //   }
  // });

  // 断开连接
  await mongoose.disconnect();
}

main();

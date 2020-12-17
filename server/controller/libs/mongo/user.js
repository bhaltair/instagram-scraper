var mongoose = require('mongoose');
var _ = require('lodash');
var userSchema = require('./userSchema');

mongoose.connect('mongodb://localhost:27017/nodejs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.set('debug', false);

var UserModel = mongoose.model(
  'User',
  new mongoose.Schema(userSchema),
);

var User = function () {};

User.prototype.save = function (obj, callback) {
  var instance = new UserModel(obj);
  instance.save(function (err) {
    callback(err);
  });
};

User.prototype.findByIdAndUpdate = function (obj, callback) {
  const query = { user_id: obj?.user_id };
  UserModel.findOneAndUpdate(
    query,
    obj,
    {
      upsert: true,
      new: true, // 返回修改后的数据
    },
    function (err, obj) {
      callback(err, obj);
    },
  );
};

User.prototype.findByIdAndUpdatePromise = async function (obj) {
  const query = { user_id: obj?.user_id };
  // return await UserModel.findOneAndUpdate(query, obj, {
  //   upsert: true, //  creates the object if it doesn't exist. defaults to false
  //   new: true, // 返回修改后的数据
  //   overwrite: false,
  // });
  const doc = await UserModel.findOne(query);
  if (doc) {
    const list = doc?.posts?.concat(obj?.posts);

    var result = _.uniqWith(list, function (arrVal, othVal) {
      return arrVal.id === othVal.id;
    });

    result = _.orderBy(result, ['taken_at_timestamp'], ['desc']);

    doc.posts = result;

    await doc.save();
  } else {
    // 创建
    var instance = new UserModel(obj);
    await instance.save();
  }
  // await mongoose.disconnect();
};

User.prototype.findByName = function (user_name, callback) {
  UserModel.findOne({ user_name }, function (err, obj) {
    callback(err, obj);
  });
};

User.prototype.findList = function (query = {}) {
  return new Promise((resolve, reject) => {
    UserModel.find(query, function (err, obj) {
      if (err) {
        reject(err);
      } else {
        // mongoose.disconnect();
        resolve(obj);
      }
    });
  });
};

module.exports = new User();

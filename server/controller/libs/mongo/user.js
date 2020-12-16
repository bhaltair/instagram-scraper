var mongoose = require('mongoose');
var userSchema = require('./userSchema');

mongoose.connect('mongodb://localhost:27017/nodejs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.set('debug', false);

var UserSchema = new mongoose.Schema(userSchema);
var UserModel = mongoose.model('User', UserSchema);

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

User.prototype.findByIdAndUpdatePromise = function (obj) {
  return new Promise((resolve, reject) => {
    const query = { user_id: obj?.user_id };
    UserModel.findOneAndUpdate(
      query,
      obj,
      {
        upsert: true, //  creates the object if it doesn't exist. defaults to false
        new: true, // 返回修改后的数据
        overwrite: false,
      },
      function (err, obj) {
        if (err) {
          reject(err);
        } else {
          // mongoose.disconnect();
          resolve(obj);
        }
      },
    );
  });
};

User.prototype.findByName = function (user_name, callback) {
  UserModel.findOne({ user_name }, function (err, obj) {
    callback(err, obj);
  });
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

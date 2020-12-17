require('../connect');
var mongoose = require('mongoose');
var userSchema = require('../schema/user');
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
  UserModel.findOneAndUpdate(query, obj, function (err, obj) {
    callback(err, obj);
  });
};

User.prototype.findByName = function (user_name, callback) {
  UserModel.findOne({ user_name }, function (err, obj) {
    callback(err, obj);
  });
};

module.exports = new User();

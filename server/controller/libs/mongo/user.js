var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var _ = require('lodash');
var userSchema = require('./userSchema');

var UserSchema = new mongoose.Schema(userSchema);
UserSchema.plugin(mongoosePaginate);

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

User.prototype.findByIdAndUpdatePromise = async function (obj) {
  const query = { user_id: obj?.user_id };

  const doc = await UserModel.findOne(query);
  if (doc) {
    // const list = doc?.posts?.concat(obj?.posts);
    // var result = _.uniqWith(list, function (arrVal, othVal) {
    //   return arrVal.id === othVal.id;
    // });
    // result = _.orderBy(result, ['taken_at_timestamp'], ['desc']);
    // doc.posts = result;
    return await doc.save();
  } else {
    // 创建
    var instance = new UserModel(obj);
    return await instance.save();
  }
};

User.prototype.findByName = async function (query) {
  query = query.user_name
    ? {
        user_name: query.user_name,
      }
    : null;
  return await UserModel.findOne(query);
};

User.prototype.findList = async function (query = {}) {
  const options = {
    page: query?.current,
    limit: query?.pageSize,
    sort: { user_name: 1 },
    customLabels: {
      totalDocs: 'total',
      docs: 'docs',
    },
  };
  query = query.user_name
    ? {
        user_name: query.user_name,
      }
    : null;
  return await UserModel.paginate(query, options);
};

module.exports = new User();

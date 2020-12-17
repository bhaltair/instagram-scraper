// var mongoose = require('mongoose');
var User = require('../../../libs/mongo/user');
var json = require('./user.json');

async function main() {
  return await User.findByIdAndUpdatePromise(json);
}

main().then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  },
);
// .finally(() => {
//   mongoose.disconnect();
// });

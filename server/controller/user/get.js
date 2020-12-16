const User = require('../libs/mongo/user');

// 查询
async function getList(query) {
  query = query.user_name
    ? {
        user_name: query.user_name,
      }
    : null;
  return await User.findList(query);
}

module.exports = {
  getList,
};

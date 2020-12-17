const User = require('../libs/mongo/user');
const scraperContoller = require('../libs/scraper');

// 查询
async function getList(query) {
  query = query.user_name
    ? {
        user_name: query.user_name,
      }
    : null;
  return await User.findList(query);
}

async function sync(userName, { total }) {
  return await scraperContoller.scraperUser(userName, {
    total,
  });
}

module.exports = {
  getList,
  sync,
};

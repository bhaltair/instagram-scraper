const User = require('../libs/mongo/user');
const scraperContoller = require('../libs/scraper');

// 查询
async function getList(query) {
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

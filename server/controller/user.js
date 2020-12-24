const User = require('./libs/mongo/user');
const Scraper = require('./libs/scraper');

// 查询用户列表
async function getList(query) {
  return await User.findList(query);
}

// 查询单个用户
async function getDetail(query) {
  return await User.findByName(query);
}

// 同步单个用户
async function sync(userName, { total }) {
  return await Scraper.scraperUser(userName, {
    total,
  });
}

module.exports = {
  getList,
  getDetail,
  sync,
};

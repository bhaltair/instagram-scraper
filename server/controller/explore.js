const Post = require('./libs/mongo/post');

async function getTimeLine(query) {
  return await Post.getTimeLine(query);
}

module.exports = {
  getTimeLine,
};

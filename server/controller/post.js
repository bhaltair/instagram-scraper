const Post = require('./libs/mongo/post');

async function getPosts(query) {
  return await Post.getPosts(query);
}

module.exports = {
  getPosts,
};

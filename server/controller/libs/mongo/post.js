const mongoose = require('mongoose');
const postSchema = require('./postSchema');

const PostSchema = new mongoose.Schema(postSchema);
const PostModel = mongoose.model('Post', PostSchema);

class Post {
  async save(obj) {
    await PostModel.create(obj);
  }
  async saveMany(arr) {
    await PostModel.insertMany(arr);
  }

  async getTimeLine(query = {}) {
    return await PostModel.find(query);
  }
}

module.exports = new Post();

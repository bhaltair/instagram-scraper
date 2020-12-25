const mongoose = require('mongoose');
const postSchema = require('./postSchema');
const mongoosePaginate = require('mongoose-paginate-v2');

const PostSchema = new mongoose.Schema(postSchema);
PostSchema.plugin(mongoosePaginate);
const PostModel = mongoose.model('Post', PostSchema);

class Post {
  async save(obj) {
    await PostModel.create(obj);
  }
  async saveMany(arr) {
    await PostModel.insertMany(arr);
  }

  async getTimeLine(query = {}) {
    const options = {
      page: query?.current,
      limit: query?.pageSize,
      customLabels: {
        totalDocs: 'total',
        docs: 'docs',
      },
    };
    return await PostModel.paginate(null, options);
  }
}

module.exports = new Post();

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
  async saveMany(arr, user) {
    arr = arr.map((item) => {
      return {
        ...item,
        user,
      };
    });
    await PostModel.insertMany(arr);
  }

  async getPosts(query = {}) {
    const options = {
      page: query?.current,
      limit: query?.pageSize,
      offset: query?.offset || 0,
      lean: true,
      populate: {
        path: 'user',
        select: 'user_name profile_pic_url user_id',
      },
      customLabels: {
        totalDocs: 'total',
        docs: 'docs',
      },
    };

    query = query.user_name
      ? {
          'owner.username': query.user_name,
        }
      : null;
    return await PostModel.paginate(query, options);
  }
}

module.exports = new Post();

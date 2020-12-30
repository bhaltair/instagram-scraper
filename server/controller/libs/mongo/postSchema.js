const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const postSchema = {
  comment_count: {
    type: 'Number',
  },
  description: {
    type: 'String',
  },
  display_url: {
    type: 'String',
  },
  video_url: 'String',
  video_view_count: 'Number',
  id: {
    type: 'String',
  },
  is_video: {
    type: 'Boolean',
  },
  liked_count: {
    type: 'Number',
  },
  location: {
    type: 'Mixed',
  },
  shortcode: {
    type: 'String',
  },
  slider: Array,
  taken_at_timestamp: {
    type: 'Number',
  },
  user: {
    type: Schema.Types.ObjectId,
    // 引用 user 的模型
    ref: 'User',
  },
  owner: {
    id: {
      type: 'String',
    },
    username: {
      type: 'String',
    },
  },
  __typename: {
    type: 'String',
  },
};

module.exports = postSchema;

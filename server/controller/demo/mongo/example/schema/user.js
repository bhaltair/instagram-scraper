var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = {
  biography: {
    type: String,
  },
  business_category_name: {
    type: String,
  },
  category_enum: {
    type: String,
  },
  category_name: {
    type: String,
  },
  external_url: {
    type: String,
  },
  full_name: {
    type: String,
  },
  highlight_reel_count: {
    type: Number,
  },
  user_id: {
    type: String,
  },
  is_business_account: {
    type: Boolean,
  },
  is_joined_recently: {
    type: Boolean,
  },
  profile_pic_url: {
    type: 'String',
  },
  follow_count: {
    type: Number,
  },
  followed_by_count: {
    type: Number,
  },
  post_count: {
    type: Number,
  },
  user_name: {
    type: String,
  },
  posts: {
    type: [Schema.Types.Mixed],
  },
};

module.exports = userSchema;

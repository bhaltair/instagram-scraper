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
  slider: {
    type: 'Array',
  },
  taken_at_timestamp: {
    type: 'Number',
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

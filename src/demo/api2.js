require('dotenv').config();
const cheerio = require('cheerio');
const rp = require('request-promise');
const config = require('../config');
const { upload } = require('../utils/alioss');
const { writeFile } = require('../utils/fs');

const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.57';

const sessionid = process.env.SESSION_ID;

const requestOptions = {
  resolveWithFullResponse: true,
  proxy: 'http://localhost:1235', //这里加个代理，科学上网
  headers: {
    'user-agent': userAgent, //这里放上你从游览器复制的userAgent
    // 'x-requested-with': 'XMLHttpRequest',
    Cookie: `sessionid=${sessionid};ig_lang=en;`,
  },
};

async function main(username) {
  const res = await rp.get(
    'https://www.instagram.com/' + username,
    requestOptions,
  );
  const $ = cheerio.load(res.body);
  let datas = null,
    jsFileUrl = '';

  //这里需要先获取shareData中的一些信息备用
  $('script').each(function (index) {
    let htmlStr = $('script').eq(index).html();

    // 取出数据
    if (htmlStr.indexOf('window._sharedData') === 0) {
      datas = $('script').eq(index).html();

      datas = datas.substring(21).replace(/\;/g, '');

      datas = JSON.parse(datas);
    }

    // 找query_hash
    let src = $('script').eq(index).prop('src');
    if (src && src.indexOf('Consumer') >= 0) {
      jsFileUrl = 'https://www.instagram.com' + src;
    }
  });

  const jsContent = await rp.get(jsFileUrl, requestOptions);
  let queryHashList = jsContent.body.match(
    /queryId:"(.+?)".+edge_owner_to_timeline_media/g,
  );
  let result = queryHashList.map((element) => {
    return (element = element.substr(9, 32));
  });

  //获取参数
  const userData =
    datas?.entry_data?.ProfilePage?.[0]?.graphql?.user || {};

  // 缓存数据
  const timelineData = userData?.edge_owner_to_timeline_media || {};
  let queryHash = result[0],
    // 所有post的count
    post_count = timelineData.count,
    // page_info
    PageInfo = timelineData?.page_info,
    // 如果是有下一页，可进行第一次分页数据请求，第一次分页请求的响应数据回来之后，id，first 的值不用变，after 的值变为响应数据中 page_info 中 end_cursor 的值，再构造 variables，连同 query_hash 发起再下一页的请求
    hasNextPage = PageInfo['has_next_page'],
    endCursor = PageInfo['end_cursor'],
    userId = userData.id;
  // 第一次的12条数据
  let timeLineList = timelineData['edges'];

  const MAX = config.max;

  const {
    biography,
    business_category_name,
    category_enum,
    category_name,
    external_url, // 网站
    // edge_owner_to_timeline_media, // 帖子
    edge_followed_by, // 被关注
    edge_follow, // 正在关注
    full_name,
    highlight_reel_count, // story count?
    id, // user id
    is_business_account,
    is_joined_recently,
    // profile_pic_url,
    profile_pic_url_hd,
    username: user_name,
  } = userData;

  const follow_count = edge_follow?.count;
  const followed_by_count = edge_followed_by?.count;

  const profile_pic_url = await upload(profile_pic_url_hd);

  const user = {
    biography,
    business_category_name,
    category_enum,
    category_name,
    external_url, // 网站
    full_name,
    highlight_reel_count, // story count?
    user_id: id, // user id
    is_business_account,
    is_joined_recently,
    profile_pic_url,
    follow_count,
    followed_by_count,
    post_count,
    user_name,
  };

  // 拉去所有post，不超过max
  console.log('fetching Posts...');
  await fetchPosts({
    hasNextPage,
    endCursor,
    userId,
  });

  const calculatedPosts = await getCalculatedPostsSerial(
    timeLineList,
  );

  await writeFile(user_name, {
    ...user,
    posts: calculatedPosts,
  });

  // 处理图片转存
  async function getCalculatedPostsSerial(posts = []) {
    const list = [];
    for (const post of posts) {
      let {
        __typename,
        is_video,
        shortcode,
        location,
        id,
        edge_liked_by, // 点赞数
        edge_media_to_caption,
        edge_media_to_comment,
        display_url,
        video_url,
        video_view_count,
        edge_sidecar_to_children,
        taken_at_timestamp,
      } = post?.node || {};

      const slider = [];
      if (__typename === 'GraphSidecar') {
        for (let edge of edge_sidecar_to_children.edges || []) {
          let {
            is_video,
            video_url,
            __typename,
            shortcode,
            display_url,
            id,
          } = edge.node || {};
          if (is_video) {
            video_url = await upload(video_url);
          } else {
            display_url = await upload(display_url);
          }
          slider.push({
            display_url,
            video_url,
            id,
            is_video,
            __typename,
            shortcode,
          });
        }
      } else if (__typename === 'GraphVideo') {
        video_url = await upload(video_url);
      }
      // 不管什么类型都有一个display_url
      display_url = await upload(display_url);

      const result = {
        liked_count: edge_liked_by?.count,
        comment_count: edge_media_to_comment?.count,
        description: edge_media_to_caption?.edges?.[0]?.node?.text,
        id,
        location,
        shortcode,
        display_url,
        is_video,
        __typename,
        video_url,
        video_view_count,
        taken_at_timestamp, // 时间戳
        slider, // 轮播图
      };
      list.push(result);
    }
    console.log('done getCalculatedPostsSerial');
    return list;
  }

  /**
   * 抓取posts
   * @param {*} param0
   */
  function fetchPosts({ hasNextPage, endCursor, userId }) {
    return new Promise((resolve, reject) => {
      fetchMore({
        hasNextPage,
        endCursor,
        userId,
      });

      //开始请求分页接口
      async function fetchPage({ endCursor, userId, pageSize = 12 }) {
        const BASE_URL = 'https://www.instagram.com/graphql/query/?';
        const options = {
          resolveWithFullResponse: false,
          proxy: 'http://localhost:1235',
          headers: {
            'x-requested-with': 'XMLHttpRequest',
            'user-agent': userAgent,
            Cookie: `sessionid=${sessionid};ig_lang=en;`,
          },
          json: true,
        };
        const variables = {
          id: userId,
          first: pageSize,
          after: endCursor,
        };
        const str = escape(JSON.stringify(variables));
        const url = `${BASE_URL}query_hash=${queryHash}&variables=${str}`;
        const res = await rp.get(url, options);
        const data =
          res?.data?.user?.edge_owner_to_timeline_media || {};
        return {
          hasNextPage: data?.page_info?.has_next_page,
          endCursor: data?.page_info?.end_cursor,
          list: data?.edges,
        };
      }

      // xxx
      async function fetchMore({ hasNextPage, endCursor, userId }) {
        const len = timeLineList.length;
        if (len >= MAX || !hasNextPage) return resolve();
        const data = await fetchPage({
          endCursor,
          userId,
        });
        timeLineList = timeLineList.concat(data?.list);
        setTimeout(() => {
          fetchMore({
            hasNextPage: data?.hasNextPage,
            endCursor: data?.endCursor,
            userId,
          });
        }, 300);
      }
    });
  }
}

main('phonehubb')
  .then(() => {
    console.log('success');
  })
  .catch((err) => {
    console.log(err);
  });

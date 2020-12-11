const cheerio = require('cheerio');
const rp = require('request-promise');
require('dotenv').config();
const config = require('../config');

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
    jsFiles = '';

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
      jsFiles = 'https://www.instagram.com' + src;
    }
  });

  const jsContent = await rp.get(jsFiles, requestOptions);
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
    // 所有posts的count
    count = timelineData.count,
    // page_info
    PageInfo = timelineData?.page_info,
    // 如果是有下一页，可进行第一次分页数据请求，第一次分页请求的响应数据回来之后，id，first 的值不用变，after 的值变为响应数据中 page_info 中 end_cursor 的值，再构造 variables，连同 query_hash 发起再下一页的请求
    hasNextPage = PageInfo['has_next_page'],
    endCursor = PageInfo['end_cursor'],
    userId = userData.id;
  // 第一次的12条数据
  let timeLineList = timelineData['edges'];

  const MAX = config.max;

  fetchPosts({
    hasNextPage,
    endCursor,
    userId,
    callback: () => {
      console.log(timeLineList.map((item) => item?.node?.shortcode));
    },
  });

  function fetchPosts({ hasNextPage, endCursor, userId, callback }) {
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
      if (len >= MAX || !hasNextPage) return callback?.();
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
  }
}

main('theraloss');

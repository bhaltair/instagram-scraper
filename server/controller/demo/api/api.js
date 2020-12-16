require('dotenv').config();
const Axios = require('axios');
// const cheerio = require('cheerio');

const sessionid = process.env.SESSION_ID;

async function instagramPhotos() {
  // It will contain our photos' links
  const res = [];

  try {
    const userInfoSource = await Axios({
      url: 'https://www.instagram.com/theraloss/',
      method: 'get',
      headers: {
        Cookie: `sessionid=${sessionid};ig_lang=en;`,
      },
      // proxy: {
      //   protocol: 'http',
      //   host: '127.0.0.1',
      //   port: 1235,
      // },
    });

    // userInfoSource.data contains the HTML from Axios
    const jsonObject = userInfoSource.data
      .match(
        /<script type="text\/javascript">window\._sharedData = (.*)<\/script>/,
      )[1]
      .slice(0, -1);

    const userInfo = JSON.parse(jsonObject);
    // Retrieve only the first 10 results
    const mediaArray = userInfo.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges.splice(
      0,
      10,
    );
    for (let media of mediaArray) {
      const node = media.node;

      // Process only if is an image
      if (node.__typename && node.__typename !== 'GraphImage') {
        continue;
      }

      // Push the thumbnail src in the array
      res.push(node.thumbnail_src);
    }
  } catch (e) {
    console.error(
      'Unable to retrieve photos. Reason: ' + e.toString(),
    );
  }

  console.log(res);
  return res;
}

instagramPhotos();

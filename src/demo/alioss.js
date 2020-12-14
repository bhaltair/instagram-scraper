require('dotenv').config();
var OSS = require('ali-oss');
var request = require('request');
const config = require('../config');

var { ali_bucket, ali_region } = config;
var { AliAccessKeyId, AliAccessKeySecret } = process.env;

let client = new OSS({
  accessKeyId: AliAccessKeyId,
  accessKeySecret: AliAccessKeySecret,
  bucket: ali_bucket,
  region: ali_region,
});

// 同步上传
// async function put () {
//   try {
//     // 'object'表示上传到OSS的object名称，'localfile'表示本地文件或者文件路径。
//     let r1 = await client.put('object','localfile');
//     console.log('put success: %j', r1);
//     let r2 = await client.get('object');
//     console.log('get success: %j', r2);
//   } catch(e) {
//     console.error('error: %j', err);
//   }
// }

// put();

// 异步上传
// 'object'表示从OSS下载的object名称，'localfile'表示本地文件或者文件路径。
// client
//   .put('object', 'localfile')
//   .then(function (r1) {
//     console.log('put success: %j', r1);
//     return client.get('object');
//   })
//   .then(function (r2) {
//     console.log('get success: %j', r2);
//   })
//   .catch(function (err) {
//     console.error('error: %j', err);
//   });

async function put(key, stream) {
  const result = await client.putStream(key, stream);
  return result.url;
}

async function upload(url) {
  const key = url?.replace(/(.*\/)*([^.]+)/gi, '$2')?.split('?')?.[0];
  const readableStream = request(url, {
    proxy: 'http://localhost:1235',
  });
  return await put(key, readableStream);
}

module.exports = {
  upload,
};

// const url =
//   'https://instagram.fkix2-1.fna.fbcdn.net/v/t51.2885-19/s150x150/83259765_625411508275319_7943554645450817536_n.jpg?_nc_ht=instagram.fkix2-1.fna.fbcdn.net&_nc_ohc=QS8nYwr_BEwAX8P_alz&tp=1&oh=92b821c097ed8db9088fa1f1f63a82b8&oe=5FFC01BD';

// upload(url).then((res) => {
//   console.log(res);
// });

require('dotenv').config();
// const fs = require('fs');
// const path = require('path');
const COS = require('cos-nodejs-sdk-v5');
const request = require('request');
const config = require('../../config');

const SecretId = process.env.SecretId;
const SecretKey = process.env.SecretKey;

const cos = new COS({
  SecretId,
  SecretKey,
  Timeout: 10000,
  FileParallelLimit: 3,
  // Proxy: 'http://127.0.0.1:1235',
});

// 上传对象
const Bucket = config.bucket;
const Region = config.region;

function upload(url) {
  return new Promise((resolve, reject) => {
    if (!url) reject(new Error('no url'));

    const readableStream = request(url, {
      // proxy: 'http://localhost:1235',
    });

    // const regexp = /\.mp4|jpg/;
    // const suffix = url.match(regexp)?.[0] || '.jpg';
    const Key = url
      ?.replace(/(.*\/)*([^.]+)/gi, '$2')
      ?.split('?')?.[0];

    console.log(`uploading ${Key}`);

    cos.putObject(
      {
        Bucket /* 必须 */,
        Region /* 必须 */,
        Key /* 必须 */,
        StorageClass: 'STANDARD',
        Body: readableStream, // 上传文件对象
        onProgress: function (progressData) {
          // console.log(progressData)
        },
      },
      function (err, data) {
        if (err) {
          reject(err);
        }
        if (data) {
          console.log(`upload success ${Key}`);
          resolve(data.Location);
        }
      },
    );
  });
}

module.exports = {
  upload,
};

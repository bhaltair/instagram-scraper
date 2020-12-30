require('dotenv').config();
var OSS = require('ali-oss');
var request = require('request');
const config = require('../../config');

var { ali_bucket, ali_region } = config;
var { AliAccessKeyId, AliAccessKeySecret } = process.env;

let client = new OSS({
  accessKeyId: AliAccessKeyId,
  accessKeySecret: AliAccessKeySecret,
  bucket: ali_bucket,
  region: ali_region,
  secure: true,
});

async function put(key, stream) {
  console.log(`uploading ${key}`);
  const result = await client.putStream(key, stream);
  console.log(`upload success ${key}`);
  return result.url;
}

async function upload(url) {
  const key = url?.replace(/(.*\/)*([^.]+)/gi, '$2')?.split('?')?.[0];
  const readableStream = request(url, {
    // proxy: 'http://localhost:1235',
  });
  return await put(key, readableStream);
}

module.exports = {
  upload,
};

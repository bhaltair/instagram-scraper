require('dotenv').config();
const fs = require('fs');
const path = require('path');
const COS = require('cos-nodejs-sdk-v5');
const request = require('request');
const config = require('../config');

const SecretId = process.env.SecretId;
const SecretKey = process.env.SecretKey;
var cos = new COS({
  SecretId,
  SecretKey,
});

// 上传对象
const Bucket = config.bucket;
const Region = config.region;

// const url = 'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e15/c28.309.662.662a/s150x150/120203687_2612341679079162_2055918898582443666_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=106&_nc_ohc=wVCR4nIu_tAAX9KguuO&tp=1&oh=c2e05bb08f7e92eebcff6bc87155ea20&oe=5FD41346'
const videoUrl =
  'https://scontent-nrt1-1.cdninstagram.com/v/t50.12441-16/120020274_332331431380170_7461922348718990944_n.mp4?efg=eyJxZV9ncm91cHMiOiJbXCJpZ19wcm9ncmVzc2l2ZV91cmxnZW4ucHJvZHVjdF90eXBlLnN0b3J5XCJdIn0&_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=106&_nc_ohc=NrhoTqLHM-EAX8yUzzx&oe=5FD3DACA&oh=5c0eb75a99edfd1a8ec134900c43078e';
const readableStream = request(videoUrl);
const regexp = /\.mp4|jpg/;
const suffix = videoUrl.match(regexp)?.[0] || '.jpg';
const Key = `images/xxx_${Date.now()}${suffix}`;

cos.putObject(
  {
    Bucket /* 必须 */,
    Region /* 必须 */,
    Key /* 必须 */,
    StorageClass: 'STANDARD',
    Body: readableStream, // 上传文件对象
    onProgress: function (progressData) {
      // progressData.Location
      console.log(JSON.stringify(progressData));
    },
  },
  function (err, data) {
    console.log(err || data);
  },
);

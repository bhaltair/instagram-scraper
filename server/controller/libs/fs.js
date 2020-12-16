'use strict';
const request = require('request');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
// const fsPromises = fs.promises;

function downloadUrl(url) {
  let filepath = path.join(__dirname, './images/xxx.jpg');
  request(url).pipe(fs.createWriteStream(filepath));
}

// 用以下方式可以监听图片下载成功与否
function downloadUrlWithStatus(url, outputPath) {
  let outputStream = fs.createWriteStream(outputPath);
  return new Promise((resolve) => {
    request(url).pipe(outputStream);
    outputStream.on('error', (error) => {
      console.log('downloadImage error', error);
      resolve(false);
    });
    outputStream.on('close', () => {
      console.log('downloadImage 文件下载完成');
      resolve(true);
    });
  });
}

async function writeFile(fileName, data) {
  const dir = path.join(__dirname, '../../data');
  const filePath = path.join(dir, `${fileName}.json`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  await fsExtra.writeJson(filePath, data);
  console.log(`write ${fileName}.json done`);
}

module.exports = {
  downloadUrl,
  downloadUrlWithStatus,
  writeFile,
};

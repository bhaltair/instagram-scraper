"use strict";
const fs = require("fs");
const request = require('request');
const path = require("path");

function downloadUrl(url) {
    let filepath = path.join(__dirname, './images/xxx.jpg');
    request(url).pipe(fs.createWriteStream(filepath));
}

// 用以下方式可以监听图片下载成功与否
function downloadUrlWithStatus(url, outputPath) {
    let outputStream = fs.createWriteStream(outputPath)
    return new Promise((resolve, reject) => {
        request(url).pipe(outputStream);
        outputStream.on('error', (error) => {
            console.log('downloadImage error', error);
            resolve(false)
        })
        outputStream.on('close', () => {
            console.log('downloadImage 文件下载完成');
            resolve(true)
        });
    })
}

module.exports = {
    downloadUrl,
    downloadUrlWithStatus
}
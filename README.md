# http

- superagent https://www.npmjs.com/package/superagent
- node-fetch https://www.npmjs.com/package/node-fetch
- got https://www.npmjs.com/package/got

# 帖子详情接口

这个接口是通过帖子的 shortcode 获取帖子详情的，具体的地址https://www.instagram.com/${username}/p/${shortCode}/?__a=1直接get请求即可。

2019-11 更新，目前发现用户首页也能直接 get 了，接口如下https://www.instagram.com/${username}/?__a=1

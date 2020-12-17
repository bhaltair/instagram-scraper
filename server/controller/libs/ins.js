//str是请求首页时返回的html字符串
function getProfilePageContainerURL(str, type = 'profile') {
  let reg = '';
  if (type === 'profile') {
    reg = /<script.*src="(.*ProfilePageContainer.*)".*<\/script>/;
  } else {
    reg = /<script.*src="(.*TagPageContainer.*)".*<\/script>/;
  }
  return (
    'https://www.instagram.com' + str.match(reg)[1].split('"')[0]
  );
}

//调用方法：getQueryHashByScript(res,'queryId')
//res是get那个script返回的内容
function getQueryHashByScript(str, word = 'queryId', arr = []) {
  let i = 0,
    str2 = '',
    key = '';
  i = str.indexOf(word);
  if (i > -1) {
    key = str.substr(i + 9, 32);
    arr.push(key);
    str2 = str.substring(i + 42);
    return getQueryHashByScript(str2, word, arr);
  } else {
    return arr;
  }
}

module.exports = {
  getProfilePageContainerURL,
  getQueryHashByScript,
};

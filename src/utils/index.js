async function addCookies(cookies_str, page, domain) {
  let cookies = cookies_str.split(";").map((pair) => {
    let name = pair.trim().slice(0, pair.trim().indexOf("="));
    let value = pair.trim().slice(pair.trim().indexOf("=") + 1);
    return { name, value, domain };
  });
  await Promise.all(
    cookies.map((pair) => {
      return page.setCookie(pair);
    })
  );
}

// 局部滚动
async function scrollDown(selector, page) {
  await page.evaluate(async (selector) => {
    const section = document.querySelector(selector);
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      let distance = 100;
      const timer = setInterval(() => {
        var scrollHeight = section.scrollHeight;
        section.scrollTop = 100000000;
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  }, selector);
}

// 滑动屏幕，滚至页面底部
function autoScroll(page) {
  return page.evaluate(() => {
    return new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 100;
      // 每200毫秒让页面下滑100像素的距离
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}

module.exports = {
  addCookies,
  autoScroll,
  scrollDown,
};

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { addCookies } = require("./utils/index");
const jsonData = require("./id.json");

const fsPromises = fs.promises;

async function scraper(username, page) {
  // 跳转用户页面
  await page.goto(`https://www.instagram.com/${username}`, {
    waitUntil: "networkidle2",
  });

  // await page.click('a[href="/rmbhh/"]');
  await page.waitFor(2000);

  // 没有website 会报错
  let user_name = "";
  let webiste = "";
  let following_count = "";
  let profile_photo = "";
  let name = "";
  let bio = "";
  const category = "";
  let posts_count = "";
  let followers_count = "";
  let story_highlights = [];
  let posts = [];
  try {
    user_name = await page.$eval(
      "#react-root > section > main > div > header >  section > div.nZSzR > h2",
      (el) => el.innerHTML
    );
    profile_photo = await page.$eval(
      "#react-root > section > main > div > header > div > div > span > img",
      (el) => el.src
    );
    name = await page.$eval(
      "#react-root > section > main > div > header > section > div.-vDIg > h1",
      (el) => el.innerHTML
    );
    try {
      webiste = await page.$eval(
        "#react-root > section > main > div > header > section > div.-vDIg > a",
        (el) => el.href
      );
    } catch (error) {}

    try {
      following_count = await page.$eval(
        "#react-root > section > main > div > header > section > ul > li:nth-child(3) > a > span",
        (el) => el.innerHTML
      );
    } catch (error) {}

    bio = await page.$eval(
      "#react-root > section > main > div > header > section > div.-vDIg > span",
      (el) => el.innerHTML
    );

    try {
      posts_count = await page.$eval(
        "#react-root > section > main > div > header > section > ul > li:nth-child(1) > span > span",
        (el) => el.innerHTML
      );
    } catch (error) {}

    try {
      followers_count = await page.$eval(
        "#react-root > section > main > div > header > section > ul > li:nth-child(2) > a > span",
        (el) => el.innerHTML
      );
    } catch (error) {}

    story_highlights = await page.evaluate(() => {
      const selectror =
        "#react-root > section > main > div > div._4bSq7 > div > div > div > ul > li.Ckrof";
      const list = document.querySelectorAll(selectror);
      const result = [];
      if (list) {
        for (var j of list) {
          const div = j.querySelector(".eXle2");
          const img = j.querySelector("img");
          result.push({
            text: div?.innerHTML || "",
            src: img?.src || "",
          });
        }
      }
      return Promise.resolve(result);
    });

    posts = await page.evaluate((x) => {
      let selector =
        "#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div";
      const list = document.querySelectorAll(selector);
      const result = [];
      if (list) {
        for (var i of list) {
          const arr = i.querySelectorAll(".v1Nh3 ");
          for (var j of arr) {
            const img = j.querySelector(" a > div.eLAPa > div.KL4Bh > img");
            result.push({
              src: img.src,
            });
          }
        }
      }
      return Promise.resolve(result);
    }, 7);
  } catch (error) {
    console.error(error);
  }

  const result = {
    user_name,
    profile_photo,
    name,
    webiste,
    bio,
    category,
    posts_count,
    followers_count,
    following_count,
    story_highlights,
    posts,
  };

  const data = JSON.stringify(result, null, 2);
  const filePath = path.join(__dirname, "../data", `${username}.json`);

  try {
    await fsPromises.writeFile(filePath, data);
    console.log(`write ${username}.json done`);
  } catch (error) {
    console.error("write file error");
  }
}

const script = async () => {
  const args = [
    "--incognito",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-infobars",
    "--window-position=0,0",
    "--ignore-certifcate-errors",
    "--ignore-certifcate-errors-spki-list",
    '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
  ];

  const browser = await puppeteer.launch({
    // args: ["--incognito"],
    // args: ["--proxy-server=socks5://127.0.0.1:10808"],
    args,
    headless: false,
    ignoreDefaultArgs: ["--enable-automation"],
    devtools: true,
  });
  const page = await browser.newPage();

  const cookieString = `sessionid=1058586105%3AS8cDbXdKobtDiG%3A5;ig_lang=en`;

  await addCookies(cookieString, page, ".instagram.com");

  // 登录
  // await page.goto("https://www.instagram.com/accounts/login", {
  //   waitUntil: "networkidle2",
  // });
  // await page.waitFor(2000);
  // await page.type("input[name=username]", "bhaltair2", {
  //   delay: 20,
  // });
  // await page.type("input[name=password]", "wangqi1234", { delay: 20 });
  // await page.click("button[type=submit]", { delay: 20 });
  // await page.waitFor(5000);

  // todo 循环处理
  for (let i of jsonData.users) {
    await scraper(i, page);
  }

  console.log("all is done");

  // 最后关闭浏览器
  await browser.close();
};

module.exports = { script };

script();

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

// const notifyBtns = await page.$x("//button[contains(text(), 'Not Now')]");
// if (notifyBtns.length > 0) {
//   await notifyBtns[0].click();
// } else {
//   console.log("No notification buttons to click.");
// }

// 1 获取followers
// const followersBtn = await page.$('div[id=react-root] > section > main > div > header > section > ul > li:nth-child(2) > a');
// await followersBtn.evaluate(btn => btn.click());
// await page.waitFor(3000);
// 打开followers对话框
// const followersDialog = 'div[role="dialog"] > div:nth-child(2)';
// 等待对话框出现
// await page.waitForSelector('div[role="dialog"] > div:nth-child(2) > ul');
// scrollDown
// await scrollDown(followersDialog, page);
// let avatarPaths = [
//     'div[role="dialog"] > div:nth-child(2) > ul > div > li > div > div > div > a > img',
//     'div[role="dialog"] > div:nth-child(2) > ul > div > li > div > div > div > span > img'
// ];
// const pics1 = await avatarPaths.reduce(async (accProm, path) => {
//     const acc = await accProm;
//     const arr = await page.$$eval(path, res => {
//         return res.map(pic => {
//             const alt = pic.getAttribute('alt');
//             const strings = alt.split(/(['])/g);
//             return {
//                 username: strings[0],
//                 avatar: pic.getAttribute('src')
//             }
//         })
//     });
//     return acc.concat([...arr]);
// }, Promise.resolve([]));
// const list1 = await page.$$('div[role="dialog"] > div:nth-child(2) > ul > div > li > div > div > div:nth-child(2) > div > a');
// const followers = await Promise.all(list1.map(async item => {
//     const username = await (await item.getProperty('innerText')).jsonValue();
//     const pic = pics1.find(p => p.username === username) || { avatar: "" };
//     return {
//         avatar: await pic.avatar,
//         username
//     }
// }));
// const closeBtn = await page.$('div[role="dialog"] > div > div > div:nth-child(3) > button');
// await closeBtn.evaluate(btn => btn.click());

// const followingBtn = await page.$('div[id=react-root] > section > main > div > header > section > ul > li:nth-child(3) > a');
// await followingBtn.evaluate(btn => btn.click());
// await page.waitFor(3000);
// const followingDialog = 'div[role="dialog"] > div:nth-child(3)';
// await page.waitForSelector('div[role="dialog"] > div:nth-child(3) > ul');
// await scrollDown(followingDialog, page);
// console.log("getting following");
// await page.waitForSelector('div[role="dialog"] > div:nth-child(3) > ul > div > li > div > div > div > a > img');
// avatarPaths = [
//     'div[role="dialog"] > div:nth-child(3) > ul > div > li > div > div > div > a > img',
//     'div[role="dialog"] > div:nth-child(3) > ul > div > li > div > div > div > span > img'
// ]
// const pics2 = await avatarPaths.reduce(async (accProm, path) => {
//     const acc = await accProm;
//     const arr = await page.$$eval(path, res => {
//         return res.map(pic => {
//             const alt = pic.getAttribute('alt');
//             const strings = alt.split(/[']/g);
//             return {
//                 username: strings[0],
//                 avatar: pic.getAttribute('src')
//             }
//         })
//     });
//     return acc.concat([...arr]);
// }, Promise.resolve([]));
// const list2 = await page.$$('div[role="dialog"] > div:nth-child(3) > ul > div > li > div > div > div:nth-child(2) > div > a');
// const following = await Promise.all(list2.map(async item => {
//     const username = await (await item.getProperty('innerText')).jsonValue()
//     const pic = pics2.find(p => p.username === username) || { avatar: "" };
//     return {
//         avatar: await pic.avatar,
//         username
//     };
// }));

// const followerCnt = followers.length;
// const followingCnt = following.length;
// console.log(`followers: ${followerCnt}`);
// console.log(`following: ${followingCnt}`);

// const notFollowingYou = following.filter(item => !followers.find(f => f.username === item.username));
// const notFollowingThem = followers.filter(item => !following.find(f => f.username === item.username));

// await browser.close();
// return {
//     followerCnt,
//     followingCnt,
//     notFollowingYou,
//     notFollowingThem,
//     followers,
//     following
// };

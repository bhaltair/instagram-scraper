const { upload } = require('../../libs/oss');
const url =
  'https://instagram.fkix2-1.fna.fbcdn.net/v/t51.2885-19/s150x150/83259765_625411508275319_7943554645450817536_n.jpg?_nc_ht=instagram.fkix2-1.fna.fbcdn.net&_nc_ohc=QS8nYwr_BEwAX8P_alz&tp=1&oh=92b821c097ed8db9088fa1f1f63a82b8&oe=5FFC01BD';

async function main() {
  const result = await upload(url);
  console.log(result);
}

main();

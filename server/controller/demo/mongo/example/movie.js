var _ = require('lodash');
var Movie = require('./models/movie.js');
var mongoose = require('mongoose');
// var json = require('./movie.json');

// Movie.save(json, function (err) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('save movie success');
//   }
// });

var soucesList = [
  {
    source: 'A站',
    link: 'http://www.youku.com',
    swfLink:
      'http://player.youku.com/player.php/sid/XMTY4NzM5ODc2/v.swf',
    quality: '高清',
    version: '正片',
    lang: '漢語',
    subtitle: '中文字幕',
  },
];

(async function () {
  // await Movie.updateOne(
  //   { name: '未來警察' },
  //   { $push: { source: soucesList } },
  // );

  // await Movie.updateOne(
  //   { 'source.source': '优酷' },
  //   {
  //     $set: {
  //       'items.$.quality': '1080P',
  //     },
  //   },
  //   function (err) {
  //     console.log(err);
  //   },
  // );

  const query = { name: '未來警察' };

  const doc = await Movie.findOne(query);

  const list = doc.source.concat(soucesList);

  var result = _.uniqWith(list, function (arrVal, othVal) {
    return arrVal.source === othVal.source;
  });
  console.log(result);
  doc.source = result;

  // item = doc.items.id(itemId);
  // item['name'] = 'new name';
  // item['value'] = 'new value';

  await doc.save();
  await mongoose.disconnect();
})();

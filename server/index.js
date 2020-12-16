const path = require('path');
const express = require('express');
const uuid = require('uuid');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const EventEmitter = require('events');
const userController = require('./controller/user/get');
const scraperContoller = require('./controller/scraper/script');

const emitter = new EventEmitter();

// webpack 相关
// const webpack = require('webpack');
// const webpackDevMiddleware = require('webpack-dev-middleware');
// const webpackHotMiddleware = require('webpack-hot-middleware');
// const config = require(path.join(__dirname, '../webpack.config.js'));
// const compiler = webpack(config);

const app = express();
var accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' },
);
app.use(morgan('combined', { stream: accessLogStream }));

// app.use(cors());
app.use(
  cors({
    origin: 'http://localhost:8000',
  }),
);
app.options('*', cors());
// const { script } = require('./script');

// app.use(webpackDevMiddleware(compiler, config.devServer));
// app.use(webpackHotMiddleware(compiler));

// 静态文件
// app.use(express.static(path.join(__dirname, '../build')));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/api/user/sync', async (req, res) => {
  const userName = req.body.user_name;
  res.json({
    data: null,
    success: true,
  });

  //   异步
  try {
    const total = !!req.body.total;
    await scraperContoller.scraperUser(userName, {
      total,
    });
    emitter.emit('push', 'sync', {
      value: userName + '同步完成',
    });
  } catch (error) {
    emitter.emit('push', 'sync', {
      value: userName + '同步失败',
    });
  }
});

app.get('/api/user/list', async (req, res) => {
  const query = req.query;
  try {
    const list = await userController.getList(query);
    res.json({
      data: list,
      success: true,
    });
  } catch (error) {
    res.json({
      data: null,
      success: true,
    });
  }
});

app.get('/', (req, res) => {
  res.send('hello');
});

app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const listener = (event, data) => {
    res.write(`id: ${uuid.v4()}\n`);
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  emitter.addListener('push', listener);

  req.on('close', () => {
    emitter.removeListener('push', listener);
  });
});

app.listen(4000, () => {
  console.log('app listen 4000');
});

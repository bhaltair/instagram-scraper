const path = require('path');
const express = require('express');
const uuid = require('uuid');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const EventEmitter = require('events');

require('./controller/libs/mongo/connect');
const userController = require('./controller/user');
const PostController = require('./controller/post');

const emitter = new EventEmitter();

const app = express();
var accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' },
);
app.use(morgan('combined', { stream: accessLogStream }));

app.use(cors());
// app.use(
//   cors({
//     origin: 'http://localhost:8000',
//   }),
// );
app.options('*', cors());

// 静态文件
// app.use(express.static(path.join(__dirname, '../build')));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// 同步用户
app.post('/api/user', async (req, res) => {
  const userName = req.body.user_name;
  res.json({
    data: null,
    success: true,
  });

  //   异步
  try {
    const total = !!req.body.total;
    await userController.sync(userName, {
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

/**
 * 用户列表
 */
app.get('/api/users', async (req, res) => {
  const query = req.query;
  try {
    const data = await userController.getList(query);
    res.json({
      data: data?.docs,
      success: true,
      total: data?.total,
    });
  } catch (error) {
    res.json({
      data: null,
      success: true,
    });
  }
});

// 用户详情
app.get('/api/user', async (req, res) => {
  const query = req.query;
  try {
    const data = await userController.getDetail(query);
    res.json({
      data,
      success: true,
    });
  } catch (error) {
    res.json({
      data: null,
      success: true,
    });
  }
});

// 用户post列表
app.get('/api/posts', async (req, res) => {
  const query = req.query;
  try {
    const data = await PostController.getPosts(query);
    res.json({
      data,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
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

const express = require('express');
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(bodyParser());
app.get('/', (req, res) => res.send('Hello World!'));

app.get('/api/fail', (req, res) => res.status(403).json({ msg: 'You are not allowed to access this' }));

io.on('connection', function (socket) {
  console.log('user connect');
  
  socket.on('chat message', function (msg) {
    console.log('user emit', msg);
    setInterval(function () {
      io.emit('chat message', msg + 'AA');
    }, 3000);
  });
});

app.use(
  '/api/stock',
  function (req, res, next) {
    var token = req.get('X-AUTH-HEADER');
    var user = jwt.decode(token);
    // if (user && user.user) {
    return next();
    // }
    return res.status(403).json({ msg: 'Please login to access this information' });
  },
  require('./stocks')
);
app.use('/api/user', require('./user'));

app.post('/web/forget_password/check_token', (req, res) => {
  if (req.body.token === '200') {
    return res.status(200).json({ result: true, message: 'valid' });
  }
  if (req.body.token === '404') {
    return res.status(404).json({ result: false, message: 'expired' });
  }
  if (req.body.token === '403') {
    return res.status(403).json({ result: false, message: 'inactive' });
  }
  if (req.body.token === '400') {
    return res.status(400).json({ result: false, message: 'invalid' });
  }
});

app.post('/web/forget_password/reset_password', (req, res) => {
  if (req.body.new_pasword === 'Aa111111') {
    return res.status(200).json({ result: 'success', message: 'Success' });
  }
  return res.status(400).json({ result: 'failed', message: 'token expired.' });
});

app.post('/web/activate/check_token', (req, res) => {
  if (req.body.token === '200') {
    return res.status(200).json({ result: true, message: 'valid' });
  }
  if (req.body.token === '404') {
    return res.status(404).json({ result: false, message: 'expired' });
  }
  if (req.body.token === '403') {
    return res.status(403).json({ result: false, message: 'inactive' });
  }
});

app.post('/web/activate/activate', (req, res) => {
  if (req.body.new_pasword === 'Aa111111') {
    return res.status(200).json({ result: 'success', message: 'Success' });
  }
  return res.status(400).json({ result: 'failed', message: 'token expired.' });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const xmlparser = require('express-xml-bodyparser'); // 解析微信支付回调通知的 XML

const indexRoute = require('./routes/index');
const wxRoute = require('./routes/wxRoute');
const mpRoute = require('./routes/mpRoute');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// CORS
app.all('*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, mytoken');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization');
	res.setHeader('Content-Type', 'application/json;charset=utf-8');
	res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
	res.header('X-Powered-By', ' 3.2.1');
	if (req.method == 'OPTIONS') {
		res.send(200);
	} else {
    next();
  }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(xmlparser());

// 定义路由
app.use('/', indexRoute);
app.use('/api/wechat', wxRoute); // 微信 h5 相关路由
app.use('/api/mp', mpRoute); // 微信 minip 相关路由

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

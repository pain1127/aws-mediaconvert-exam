const createError = require('http-errors');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require(`./config/common`);
const package = require('../package.json');
const moment = require('moment');
const morgan = require('morgan');

// routerf
const indexRouter = require('./controller/index');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(morgan('dev'));

// router 설정
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'develop' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

// 로딩 메세지
console.log(`[${package.name}] 로딩시각 : ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
console.log(`[${package.name}] 로딩환경 : ${config.env}`);
console.log(`[${package.name}] 사용포트 : ${config.port}`);
console.log(`[${package.name}] Version : ${package.version}`);

module.exports = app;

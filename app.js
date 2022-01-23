var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const sequelize = require('./models').sequelize;

var app = express();

app.use('/static', express.static('public'));

try {
  sequelize.sync();
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404 error handler

app.use((req, res, next) => {
  const err = new Error('Error 404: Page not found');
  err.status = 404;
  res.render('page-not-found', {err, title: "Page Not Found"});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.message(err.message || 'Sorry! There was an unexpected error on the server.');
  res.render('error', { err, title: "Server Error"});
});

module.exports = app;

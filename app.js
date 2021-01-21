const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require('./helpers/jwt');

const Knex = require('knex')
const knexConfig = require('./knexfile')
const { Model } = require('objection')

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login')
const usersRouter = require('./routes/users');

/* Initialize knex */
const knex = Knex(knexConfig.development);
Model.knex(knex);

const app = express();

/* Use JWT auth to secure the API */
// app.use(jwt())

/* View engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* APIs setup */
app.use('/', indexRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

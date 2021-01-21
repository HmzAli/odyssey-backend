const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler')

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
app.use(jwt())

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

/* Error handler */
app.use(errorHandler);

module.exports = app;

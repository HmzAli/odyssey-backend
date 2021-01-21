const express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    jwt = require('./helpers/jwt'),
    errorHandler = require('./helpers/error-handler')

const Knex = require('knex'),
    knexConfig = require('./knexfile'),
    { Model } = require('objection')

const indexRouter = require('./routes/index'),
    loginRouter = require('./routes/login'),
    usersRouter = require('./routes/users');

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

/* APIs */
app.use('/', indexRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);

/* Error handler */
app.use(errorHandler);

module.exports = app;

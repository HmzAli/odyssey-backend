const express = require('express'),
	cors = require('cors'),
    path = require('path'),
    jwt = require('./helpers/jwt'),
    errorHandler = require('./helpers/error-handler')

const Knex = require('knex'),
    knexConfig = require('./knexfile'),
    { Model } = require('objection')

const indexRouter = require('./api/index'),
    loginRouter = require('./api/login'),
    usersRouter = require('./api/users')

const createDummyUser = require('./dummy-user')

const knex = Knex(knexConfig.development)
Model.knex(knex)

const app = express()

/* View engine setup for home page */
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(cors())

app.use(express.urlencoded({ extended: false }))

/* Use JWT auth to secure the API */
app.use(jwt())

/* APIs */
app.use('/', indexRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

/* Handler for all errors */
app.use(errorHandler)

/* Create test user */
createDummyUser()

module.exports = app

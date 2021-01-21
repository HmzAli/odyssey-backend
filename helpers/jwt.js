const expressJwt = require('express-jwt'),
    config = require('../config.json')

const jwt = () => {
    const { secret } = config;
    return expressJwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            '/',
            '/api/login',
            '/api/login/',
            '/stylesheets/style.css'
        ]
    })
}

module.exports = jwt
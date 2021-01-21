const expressJwt = require('express-jwt');
const config = require('../config.json');

const jwt = () => {
    const { secret } = config;
    return expressJwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            '/',
            '/api/login',
            '/api/login/',
            '/stylesheets/style.css'
        ]
    });
}

module.exports = jwt;
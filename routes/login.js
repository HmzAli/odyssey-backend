const express = require('express'),
    router = express.Router(),
    { User } = require('../models/User')

router.post('/', login)

function login(request, response, next) {
    User.authenticate(request.body.username, request.body.password)
        .then(userData => response.json(userData))
        .catch(next)
}

module.exports = router

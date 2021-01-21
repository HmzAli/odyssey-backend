const express = require('express'),
    router = express.Router(),
    userService = require('./user.service')

router.post('/', login)

function login(request, response, next) {
    userService.authenticate(request.body)
        .then(userData => response.json(userData))
        .catch(next)
}

module.exports = router

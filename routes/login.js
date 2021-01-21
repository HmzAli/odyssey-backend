const express = require('express')
const router = express.Router()

const { User } = require('../models/User')

router.post('/', login)

function login(request, response) {
    User.authenticate(request.body.username, request.body.password)
        .then(userData => {
            response.json(userData)
        })
        .catch(error => {
            response.status(403).json({ error: `Unable to login. ${error.message}` })
        })
}

module.exports = router
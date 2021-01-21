const express = require('express')
const router = express.Router()

const { User } = require('../models/User')

/* User routes */
router.get('/', getAll)
router.get('/:id', getOne);
router.post('/', create)
router.delete('/:id', deleteOne)

function getAll(request, response) {
    User.getAll()
        .then(users => response.json(users))
        .catch(error => {
            response.status(403).json({ error: `Unable to fetch users. ${error.message}` })
        })
}

function getOne(request, response) {
    User.get(request.params.id)
        .then(user => response.json(user))
        .catch(error => {
            response.status(403).json({ error: `Unable to fetch user. ${error.message}` })
        })
}


function create(request, response) {
    const { name, username, email, password, role } = request.body;
    User.create(name, username, email, password, role)
        .then(() => response.status(200).send('User successfully created!'))
        .catch(error => {
            response.status(400).json({ error: `Failed to create user. ${error.message} `})
        })
}

function deleteOne(request, response) {
    const id = request.params.id
    if (request.user.role !== 'admin') {
        response.status(403).json({error: 'You have no permission to perform this action'})
    }

    if (request.user.sub == id) {
        response.status(403).json({error: 'You can\'t delete yourself'})
    }

    User.delete(id)
        .then(() => response.send('User deleted successfully!'))
        .catch(error => {
            response.status(403).json({ error: `Failed to delete user. ${error.message}` })
        })
}

module.exports = router
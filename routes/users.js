const express = require('express')
const router = express.Router()

const { User } = require('../models/User')

/* User routes */
router.get('/', getAll)
router.get('/:id', getOne);
router.post('/', create)
router.delete('/:id', deleteOne)

function getAll(_, response) {
    User.getAll()
        .then(users => {    
            response.json(users)
        })
        .catch(error => {
            console.log(error)
            response.status(403).json({ error: `Unable to fetch users. ${error.message}` })
        })
}

function getOne(request, response) {
    User.get(request.params.id)
        .then(user => {
            response.json(user)
        })
        .catch(error => {
            console.log(error)
            response.status(403).json({ error: `Unable to fetch user. ${error.message}` })
        })
}


function create(request, response) {
    if (!['admin', 'user'].includes(request.body.role)) {
        return response.status(400).json({ error: `Unable to create user. ${request.body.role} not a valid role`})
    }

    const { name, username, email, password, role } = request.body;
    User.create(name, username, email, password, role)
        .then(() => {
            response.status(200).send('User successfully created!')
        })
        .catch(error => {
            console.log(error)
            response.status(400).json({ error: `Failed to create user. ${error.message} `})
        })
}

function deleteOne(request, response) {
    const id = request.params.id
    User.delete(id)
        .then(() => {
            response.send('User deleted successfully!')
        })
        .catch(error => {
            console.log(error)
            response.status(403).json({ error: `Failed to delete user. ${error.message}` })
        })
}

module.exports = router

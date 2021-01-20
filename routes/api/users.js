const express = require('express')
const { body, param, validationResult } = require('express-validator');
const router = express.Router()

const { User } = require('../../models/User')

router.get('/', (_, response) => {
    User.getAll()
        .then(users => {    
            response.json(users)
        })
        .catch(error => {
            console.log(error)
            response.status(403).json({ error: `Unable to fetch users. ${error.message}` })
        })
})

router.get('/:id',
    param('id').isInt(),
    (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ error: 'Unable to fetch user', details: errors.array()})
        }

        User.get(request.params.id)
            .then(user => {
                response.json(user)
            })
            .catch(error => {
                console.log(error)
                response.status(403).json({ error: `Unable to fetch user. ${error.message}` })
            })
});

router.post('/', 
    body('name').notEmpty(),
    body('username').notEmpty(),
    body('email').isEmail(),
    body('password').notEmpty(),
    body('role').notEmpty(),
    (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ error: 'Unable to create user', details: errors.array()})
        }
        if (!['admin', 'user'].include(request.body.role)) {
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
})

router.delete('/:id', (request, response) => {
    const id = request.params.id
    User.delete(id)
        .then(() => {
            response.send('User deleted successfully!')
        })
        .catch(error => {
            console.log(error)
            response.status(403).json({ error: `Failed to delete user. ${error.message}` })
        })
})

module.exports = router

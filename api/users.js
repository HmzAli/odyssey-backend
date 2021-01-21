const express = require('express'),
    router = express.Router(),
    userService = require('./user.service')

router.get('/', getAll)
router.get('/:id', getOne);
router.post('/', create)
router.delete('/:id', deleteOne)

function getAll(request, response, next) {
    userService.getAll()
        .then(users => response.json(users))
        .catch(next)
}

function getOne(request, response, next) {
    userService.get(request.params.id)
        .then(user => response.json(user))
        .catch(next)
}

function create(request, response, next) {
    userService.create(request.body)
        .then(() => response.status(200).send('User successfully created!'))
        .catch(next)
}

function deleteOne(request, response, next) {
    const id = request.params.id
    if (request.user.role !== 'admin') {
        response.status(403).json({error: 'You have no permission to perform this action'})
    }
    if (request.user.sub == id) {
        response.status(403).json({error: 'You can\'t delete yourself'})
    }

    userService.deleteOne(id)
        .then(() => response.send('User deleted successfully!'))
        .catch(next)
}

module.exports = router

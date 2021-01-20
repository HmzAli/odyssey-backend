const express = require('express')
const router = express.Router()

const { User } = require('../../models/User')

router.get('/', async (request, response) => {
    const users = await User.getAll()
        .catch(error => console.log(error))

    response.send(users)
})

router.get('/:id', async (request, response) => {
    const id = request.params.id;
    const user = await User.get(id)
        .then(() => {
            response.send(user)
        })
        .catch(error => {
            console.log(error)
            response.status(403).send(`Unable to fetch user. ${error.message}`)
        })

    response.send(user)
});

router.post('/', async (request, response) => {
    const { name, username, email, password, role } = request.body;
    await User.create(name, username, email, password, role)
        .then(() => {
            response.status(200).send('User created successfully!')
        })
        .catch(error => {
            console.log(error)
            response.status(400).send(`Failed to create user. ${error.message} `)
        })

    
})

router.delete('/:id', async (request, response) => {
    const id = request.params.id
    await User.delete(id)
        .then(() => {
            response.send('User deleted successfully!')
        })
        .catch(error => {
            console.log(error)
            response.status(403).send(`Failed to delete user. ${error.message}`)
        })
})

module.exports = router
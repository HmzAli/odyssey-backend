const express = require('express')
const router = express.Router()

router.use((request, response, next) => {
    console.log('using! ', request.baseUrl)
    next()
})

router.get('/', (request, response) => {
    response.send('getting all users')
})

router.get('/:id', (request, response) => {
    // Validate request.body
    response.send('getting user by id')
});

router.post('/', (request, response) => {
    response.send('add user')
})

router.delete('/', (request, response) => {
    response.send('deleting a user')
})

module.exports = router
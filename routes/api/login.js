const app = require('express')
const router = app.Router()

router.post('/', (request, response) => {
    console.log(request.body)
    response.send('logging in...')
})

module.exports = router
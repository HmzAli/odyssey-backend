/**
   Creates a dummy admin user (if no users created yet) for testing
*/

const userService =  require('./api/user.service'),
    { encryptPassword } = require('./utils')

const createDummyUser = async () => {
    const users = await userService.getAll()

    if (!users.length) {
        userService.create({
            name: 'test',
            username: 'dummyadmin',
            email: 'text@example.com',
            role: 'admin',
            password: 'abc'
        })
        .then(() => console.log('test user created'))
    }
}

module.exports = createDummyUser

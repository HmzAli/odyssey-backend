const { Model } = require('objection'),
    validator = require('validator'),
    jwt = require('jsonwebtoken'),
    UserError = require('../helpers/user-error'),
    config = require('../config.json'),
    { encryptPassword, comparePasswords } = require('../utils')

/* 
    Handles all user operations
*/
class User extends Model {
    static get tableName() {
        return 'users'
    }

    static async get(id) {
        if (!Number.isInteger(+id)) {
            throw new UserError(`Invalid user id \'${id}\'`)
        }

        const user =  await User.query().findById(id)
        if (!user) {
            throw new UserError(`No user found with id ${id}`)
        }

        return user
    }

    static async getAll() {
        return await User.query()
    }

    static async create(name, username, email, password, role='user') {
        if (!username) { 
            throw new UserError('Username is required')
        }
        if (!email) {
            throw new UserError('Email is required')
        }
        if (!validator.isEmail(email)) {
            throw new UserError('Invalid email format')
        }
        if (!password) {
            throw new UserError('Password is required')
        }
        if (!['admin', 'user'].includes(role)) {
            throw new UserError(`\'${role}\' not a valid role`)
        }

        const existingUsers = await User.query()
            .where({username})
            .orWhere({email})

        if (existingUsers.some(u => u.username == username)) {
            throw new UserError(`The username ${username} is taken`)
        }
        if (existingUsers.some(u => u.email == email)) {
            throw new UserError(`The email ${email} is taken`)
        }

        const encryptedPassword = await encryptPassword(password)
            .catch(error => {
                /* TODO: not sure how to present this error... */
                throw new Error('Failed to encrypt password')
            })

        return await User.query().insert({
            name: name || username, 
            username,
            email,
            password: encryptedPassword, 
            role
        })
    }

    static async delete(id) {
        const user = await User.query().findById(id)
        if (!user) {
            throw new UserError(`No user with id ${id} exists`)
        }

        return User.query().deleteById(id)
    }

    static async authenticate(username, password) {
        if (!username || !password) {
            throw new Error('Username and password required')
        }

        const user = await User.query().where({username}).first()
        if (!user || !await comparePasswords(password, user.password)) {
            throw new Error('Invalid username or password')
        }

        const token = jwt.sign({ sub: user.id, role: user.role }, config.secret, { expiresIn: config.expiresIn });
        return {
            token,
            user
        }
    }

    $formatJson(json) {
        json = super.$formatJson(json)
        delete json.password
        return json
    }
}

module.exports = {
    User,
}

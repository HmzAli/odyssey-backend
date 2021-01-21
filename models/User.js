const { Model } = require('objection')
const validator = require('validator');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const { encryptPassword, comparePasswords } = require('../utils')

class User extends Model {
    static get tableName() {
        return 'users'
    }

    $formatJson(json) {
        json = super.$formatJson(json);
        delete json.password;
        return json;
      }

    static async get(id) {
        const user =  await User.query().findById(id)
        if (!user) {
            throw new Error(`No user found with id ${id}`)
        }

        return user
    }

    static async getAll() {
        return await User.query()
    }

    static async create(name, username, email, password, role='user') {
        if (!username) { 
            throw new Error('Username is required')
        }
        if (!email) {
            throw new Error('Email is required')
        }
        if (!validator.isEmail(email)) {
            throw new Error('Invalid email format')
        }
        if (!password) {
            throw new Error('Password is required')
        }
        if (!['admin', 'user'].includes(role)) {
            throw new Error(`\'${role}\' not a valid role`)
        }

        const existingUsers = await User.query()
            .where({username})
            .orWhere({email})

        if (existingUsers.some(u => u.username == username)) {
            throw new Error(`The username ${username} is taken`)
        }
        if (existingUsers.some(u => u.email == email)) {
            throw new Error(`THe email ${email} is taken`)
        }

        const encryptedPassword = await encryptPassword(password)
            .catch(error => {
                throw new Error('Faild to encrypt password')
            })

        return await User.query().insert({
            name: name || username, 
            username,
            email,
            password: encryptedPassword, 
            role: role || 'user'
        })
    }

    static async delete(id) {
        const user = await User.query().findById(id)
        if (!user) {
            throw new Error(`No user with id ${id} exists`)
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
}

module.exports = {
    User,
}

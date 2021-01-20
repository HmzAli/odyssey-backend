const { Model } = require('objection')
const validator = require('validator');
const { encryptPassword } = require('../utils')

class User extends Model {
    static get tableName() {
        return 'users'
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

    /**
     * Creates a new user
     * Required params are: name, username, email & password. 
     * 
     * @returns {QueryBuilder} Query builder isntance representing a user
     */
    static async create(name, username, email, password, role) {
        if (!name) {
            throw new Error('Name is required')
        }
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

        const existingUsers = await User.query()
            .where({username})
            .orWhere({email})

        if (existingUsers.some(u => u.username == username)) {
            throw new Error(`The username ${username} is taken`)
        }
        if (existingUsers.some(u => u.email == email)) {
            throw new Error(`THe email ${email} is taken`)
        }

        return await User.query().insert({
            name, 
            username,
            email,
            password: encryptPassword(password), 
            role: role || 'user'
        })
    }

    static async delete(id) {
        const user = await User.query()
            .where({id})
        if (!user.length) {
            throw new Error(`No user with id ${id} exists`)
        }

        return user.del()
    }
}

module.exports = {
    User,
}

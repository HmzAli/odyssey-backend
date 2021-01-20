const { Model } = require('objection')
const validator = require('validator');
const { encryptPassword } = require('./utils')

/**
 * Creates a new user
 * Required params are: name, username, email & password. 
 * 
 * @returns {QueryBuilder} Query builder isntance representing a user
 */
class User extends Model {
    static get tableName() {
        return 'users';
    }

    static async create(name, username, email, password, role) {
        if (!name) {
            throw new Error('Name is required')
        }
        if (!username) { 
            throw new Error('Username is required')
        }
        if (!validator.isEmail(email)) {
            throw new Error('A valid email required')
        }
        if (!password) {
            throw new Error('Password is required')
        }

        const existingUsers = await User.query()
            .where({username})
            .orWhere({email})

        if (existingUsers.some(u => u.username == username)) {
            throw new Error(`A user with username ${username} already exists`)
        }
        if (existingUsers.some(u => u.email == email)) {
            throw new Error(`A user with the email ${email} already exists`)
        }

        return await User.query().insert({
            name, 
            username, 
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

        user.del()
    }
}

module.exports = {
    User,
}

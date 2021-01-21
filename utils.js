const bcrypt = require('bcrypt')
const config = require('./config.json')

const encryptPassword = (password) => {
    const saltRounds = config.saltRounds;

    return bcrypt.hash(password, saltRounds).then(hash => {
        return hash
    })
}

const comparePasswords = (password, hash) => {
    return bcrypt.compare(password, hash).then(result => {
        return result
    });
}

module.exports = {
    encryptPassword,
    comparePasswords
}

const bcrypt = require('bcrypt')

const encryptPassword = (password) => {
    const saltRounds = 10;

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

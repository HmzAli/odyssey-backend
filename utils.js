const bcrypt = require('bcrypt')

const encryptPassword = (pwd) => {
    const saltRounds = 10;

    return bcrypt.hash(pwd, saltRounds).then(hash => {
        return hash
    })
}

const comparePasswords = (pwd, hash) => {
    return bcrypt.compare(pwd, hash).then(result => {
        return result
    });
}

module.exports = {
    encryptPassword,
    comparePasswords
}

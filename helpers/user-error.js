class UserError extends Error {
    constructor(message, status) {
        super(message, status)
        this.status = status || 400
    }
}

module.exports = UserError
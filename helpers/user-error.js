class CustomError extends Error {
    constructor(message, status) {
        super(message, status)
        this.status = status || 400
    }
}

module.exports = CustomError
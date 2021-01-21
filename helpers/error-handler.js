const UserError = (error, request, response, next) => {
    response.status(error.status || 500).json({ 'error': error.message })
}

module.exports = UserError
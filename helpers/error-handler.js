const errorHandler = (error, request, response, next) => {
    /* set locals, only providing error in development */
    response.locals.message = error.message;
    response.locals.error = request.app.get('env') === 'development' ? error : {};
    response.status(error.status || 500).json({ "error": error.message});
}

module.exports = errorHandler
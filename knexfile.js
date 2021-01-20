module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            database: 'odyssey-test'
        },
        pool: {
            min: 2,
            max: 10
        }
    }
}
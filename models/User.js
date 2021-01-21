const { Model } = require('objection')

class User extends Model {
    static get tableName() {
        return 'users'
    }

    $formatJson(json) {
        json = super.$formatJson(json)
        delete json.password
        return json
    }
}

module.exports = User

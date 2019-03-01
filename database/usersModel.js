const db = require('./dbConfig');

module.exports = {addUser, findUser}

function addUser(user) {
    return db('users').insert(user)
}

function findUser(filter) {
    return db('users').where({username: filter}).first()
}
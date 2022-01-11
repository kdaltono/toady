module.exports = (app) => {
    const users = require("../controllers/user.controller")

    app.post('/users/register', users.insertNewUser)
}
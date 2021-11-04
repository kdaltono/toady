module.exports = app => {
    const users = require("../controllers/user.controller")

    app.get("/users/a", users.findAll)
    app.get("/users/s/:userId", users.findById)
    app.get("/users/d/:userId", users.getDisplayInformation)
}
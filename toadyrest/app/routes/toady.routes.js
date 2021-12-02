module.exports = (app) => {
    const users = require("../controllers/user.controller")

    // Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqZGFsdG9uIiwiaWF0IjoxNjM4MzYxNjg4NzI2LCJleHAiOjE2MzgzNjE3NzUxMjZ9.xAajdNSaVaYx9YmrXNuucQu3dmlLNhdyvnevbv1iNhk

    app.get("/users/a", users.findAll)
    app.get("/users/s/:userId", users.findById)
    app.get("/users/d/:userId", users.getDisplayInformation)
}
const User = require("../models/user")

exports.findAll = (req, res) => {
    User.getSimpleInformation((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "An error occured while recieving all users"
            })
        } else {
            res.send(data)
        }
    })
}

exports.findById = (req, res) => {
    User.findById(req.params.userId, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(404).send({
                    message: `Could not find user ID: ${req.params.userId}`
                })
            } else {
                res.status(500).send({
                    message: `Error retrieving user ID: ${req.params.userId}`
                })
            }
        } else {
            res.send(data)
        }
    })
}

exports.getDisplayInformation = (req, res) => {
    User.getDisplayDescription(req.params.userId, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(404).send({
                    message: `Could not find user ID: ${req.params.userId}`
                })
            } else {
                res.status(500).send({
                    message: `Error retrieving user ID: ${req.params.userId}`
                })
            }
        } else {
            res.send(data)
        }
    })
}

exports.insertNewUser = (req, res) => {
    User.insertNewUser(req.body.username, req.body.firstname, req.body.lastname, req.body.password, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Could not insert user: ${req.body.username}, ${req.body.firstname} ${req.body.lastname}, ${req.body.password}`
            })
        } else {
            res.send(data)
        }
    })
}
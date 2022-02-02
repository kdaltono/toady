const Pond = require('../models/pond')

exports.getUserAssignedPonds = (req, res) => {
    Pond.getUserAssignedPonds(req.params.userId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Can't find user ID: ${req.params.userId}`
            })
        } else {
            res.send(data)
        }
    })
}

exports.getPondAssignedUsers = (req, res) => {
    Pond.getPondAssignedUsers(req.params.pondId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Can't find pond ID: ${req.params.pondId}`
            })
        } else {
            res.send(data)
        }
    })
}

exports.getPondData = (req, res) => {
    Pond.getPondData(req.params.pondId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Can't find pond ID: ${req.params.pondId}`
            })
        } else {
            res.send(data)
        }
    })
}
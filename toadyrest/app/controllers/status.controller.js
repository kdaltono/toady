const e = require('express')
const Status = require('../models/status')

exports.getStatusTask = (req, res) => {
    Status.getTaskStatus((err, data) => {
        if (err) {
            res.status(500).send({
                message: 'Error retrieving task statuses'
            })
        } else {
            res.send(data)
        }
    })
}
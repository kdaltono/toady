const e = require('express')
const TaskDisplay = require('../models/task_display')
const Task = require('../models/task')

exports.getDisplayDescription = (req, res) => {
    TaskDisplay.getUserDisplayTasks(req.params.userId, (err, data) => {
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

exports.getTaskDetails = (req, res) => {
    Task.getTaskInformation(req.params.taskId, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(404).send({
                    message: `Could not find task ID: ${req.params.taskId}`
                })
            } else {
                res.status(500).send({
                    message: `Error retrieving task ID: ${req.params.taskId}`
                })
            }
        } else {
            res.send(data)
        }
    })
}
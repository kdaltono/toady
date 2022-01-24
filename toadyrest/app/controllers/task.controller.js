const e = require('express')
const TaskDisplay = require('../models/task_display')
const TaskComments = require('../models/task_comments')
const Task = require('../models/task')
const UserToTask = require('../models/user_to_task')

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

exports.getTaskComments = (req, res) => {
    TaskComments.getTaskComments(req.params.taskId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
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

exports.insertNewTask = (req, res) => {
    Task.insertNewTask(req.body.task_title, req.body.task_desc, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Error creating task: ${req.body.task_title}, ${req.body.task_desc}, ${req.body.assigned_users}`
            })
        } else {
            const assigned_users = req.body.assigned_users
            let errString = '';    

            for (const user of assigned_users) {
                UserToTask.insertNewRecord(data, user.user_id, (err, data) => {
                    if (err) {
                        errString += `Error creating user to task: ${data}, ${user.user_id} `
                    }
                })
            }

            // Avoid sending multiple responses, only send one for the multiple insertions
            if (errString !== '') {
                res.status(500).send({
                    message: `Error: ${errString}`
                })
            } else {
                res.send({
                    message: 'Success'
                })
            }
        }
    })
}

exports.insertNewComment = (req, res) => {
    TaskComments.addComment(req.body.task_id, req.body.user_id, req.body.comment_text, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Error inserting comment: Task ${req.body.task_id} from ${req.body.user_id}: ${req.body.comment_text}`
            })
        } else {
            res.send({
                message: `Success`
            })
        }
    })
}

exports.getAssignedUsers = (req, res) => {
    Task.getAssignedUsers(req.params.taskId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Could not find assigned users for task: ${req.params.taskId}`
                })
            } else {
                res.status(500).send({
                    message: `Error getting assigned users for task: ${req.params.taskId}`
                })
            }
        } else {
            res.send(data)
        }
    })
}

exports.deleteComment = (req, res) => {
    TaskComments.deleteComment(req.body.comment_id, req.body.comment_text, req.body.user_id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Error deleting comment: Comment text: ${req.body.comment_text}`
            })
        } else {
            res.send({
                message: `Success`
            })
        }
    })
}

exports.updateStatus = (req, res) => {
    Task.updateStatus(req.body.task_id, req.body.status_id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Error updating task with ID: ${req.body.task_id}`
            })
        } else {
            res.send({
                message: 'Success'
            })
        }
    })
}
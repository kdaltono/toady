const Pond = require('../models/pond')
const Pad = require('../models/pad')
const e = require('express')

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

exports.getTasksForPad = (req, res) => {
    Pad.getTasksForPad(req.params.padId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Can't find pad ID: ${req.params.padId}`
            })
        } else {
            res.send(data)
        }
    })
}

exports.getPondPadData = (req, res) => {
    Pond.getPondPadData(req.params.pondId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Can't find pad ID: ${req.params.pondId}`
            })
        } else {
            res.send(data)
        }
    })
}

exports.getContinuousTasks = (req, res) => {
    Pond.getContinuousTasks(req.params.pondId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Can't find pond ID: ${req.params.pondId}`
            })
        } else {
            res.send(data)
        }
    })
}
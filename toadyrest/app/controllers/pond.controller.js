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

exports.updatePadReviewText = (req, res) => {
    Pad.updatePadReviewText(req.body.pad_id, req.body.review_text, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Can't find pond ID: ${req.body.pond_id}`
            })
        } else {
            res.send(data)
        }
    })
}

exports.updateStartAndEndDate = (req, res) => {
    Pad.updateStartAndEndDate(req.body.start_dstamp, req.body.end_dstamp, req.body.pad_id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Can't find pad ID: ${req.body.pad_id}`
            })
        } else {
            res.send(data)
        }
    })
}

exports.updateOrderValues = (req, res) => {
    Pad.updateOrderValues(req.body.padOrderValues, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Couldn't update pad's order_values: ${req.body.padOrderValues}`
            })
        } else {
            res.send(data)
        }
    })
}

exports.insertPadForPond = (req, res) => {
    Pad.insertNewPadForPond(req.body.pond_id, req.body.pad_name, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Couldn't insert pad: ${req.body.pad_name}`
            })
        } else {
            res.send(data)
        }
    })
}
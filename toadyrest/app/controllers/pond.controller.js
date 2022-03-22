const Pond = require('../models/pond')
const Pad = require('../models/pad')
const UserToPond = require('../models/user_to_pond')
const e = require('express')
const jsonwebtoken = require('jsonwebtoken')

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
    UserToPond.getPondAssignedUsers(req.params.pondId, (err, data) => {
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
    const token = jsonwebtoken.decode(req.headers.authorization.slice(7), { complete: true })
    const user_id = token.payload.content.user.user_id

    Pond.getPondData(req.params.pondId, user_id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Can't find pond ID: ${req.params.pondId}`
            })
        } else {
            res.send(data)
        }
    })
}

exports.getPondAccountTypes = (req, res) => {
    Pond.getPondAccountTypes(req.params.pondId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Can't find pond ID: ${req.params.pondId}`
            })
        } else {
            res.send(data)
        }
    })
}

exports.insertNewPondAccountType = (req, res) => {
    Pond.insertNewAccountType(req.body.display_name, req.body.pond_id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Error inserting new pond account type ${req.body.display_name}`
            })
        } else {
            res.send(data)
        }
    })
}

exports.deletePondAccountType = (req, res) => {
    Pond.deletePondAccountType(req.body.account_type_id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Error deleting account type ID: ${req.body.account_type_id}`
            })
        } else {
            res.send(data)
        }
    })
}

exports.updatePondAccountTypes = (req, res) => {
    let modifiedAccountTypes = req.body.account_types
    var errors = "";

    modifiedAccountTypes.forEach(accountType => {
        Pond.updateAccountType(accountType, (err, data) => {
            if (err) {
                errors += `Can't find account type: ${accountType.account_type_id}`
            }
        })
    })

    if (errors) {
        res.status(500).send({
            message: errors
        })
    } else {
        res.send({
            message: 'Success'
        })
    }
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

exports.insertPond = (req, res) => {
    const token = jsonwebtoken.decode(req.headers.authorization.slice(7), { complete: true })
    const user_id = token.payload.content.user.user_id

    Pond.insertNewPond(req.body.pond_name, user_id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Couldn't create pond: ${req.body.pond_name}`
            })
        } else {
            res.send(data)
        }
    })
}

exports.deletePad = (req, res) => {
    Pad.deletePad(req.body.pad_id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `Couldn't delete pad ID: ${req.body.pad_id}`
            })
        } else {
            res.send(data)
        }
    })
}
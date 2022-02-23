module.exports = app => {
    const User = require('../models/user')
    const passport = require('passport')
    const utils = require('../lib/utils')
    const tasks = require('../controllers/task.controller')
    const users = require('../controllers/user.controller')
    const status = require('../controllers/status.controller')
    const pond = require('../controllers/pond.controller')

    app.post('/login', function(req, res, data) {
        User.findByUsername(req.body.username, function(err, user) {
            if (err) {
                res.status(401).json({ success: false, msg: `An error occured with details: ${req.body.username}` })
            } else if (!user || user === undefined) {
                res.status(401).json({ success: false, msg: 'No user found' })
            } else {
                const isValid = utils.isValidPassword(req.body.password, user.current_password)
                if (isValid) {
                    console.log('/login: user: ' + JSON.stringify(user))
                    const tokenObject = utils.issueJWT(user)
                    res.status(200).json({ 
                        success: true, 
                        token: tokenObject.token, 
                        expiresIn: tokenObject.expires, 
                        user_id: tokenObject.user_id, 
                        full_name: tokenObject.full_name,
                        account_type_id: tokenObject.account_type_id,
                        account_type_level: tokenObject.account_type_level
                    })
                } else {
                    res.status(401).json({ success: false, msg: 'Incorrect password' })
                }
            }
        })
    })

    app.get('/tasks/:userId', passport.authenticate('jwt', { session: false }), tasks.getDisplayDescription)
    app.get('/tasks/t/:taskId', passport.authenticate('jwt', { session: false }), tasks.getTaskDetails)
    app.get('/tasks/users/a/:taskId', passport.authenticate('jwt', { session: false }), tasks.getAssignedUsers)
    app.post('/tasks/i', passport.authenticate('jwt', { session: false }), tasks.insertNewTask)
    app.put('/tasks/status/u', passport.authenticate('jwt', { session: false }), tasks.updateStatus)

    app.get('/status', passport.authenticate('jwt', { session: false }), status.getStatusTask)

    app.get("/comm/:taskId", passport.authenticate('jwt', { session: false }), tasks.getTaskComments)
    app.post('/comm/add', passport.authenticate('jwt', { session: false }), tasks.insertNewComment)
    app.delete('/comm/del', passport.authenticate('jwt', { session: false }), tasks.deleteComment)

    app.get("/users/a", passport.authenticate('jwt', { session: false }), users.findAll)
    app.get("/users/s/:userId", passport.authenticate('jwt', { session: false }), users.findById)
    app.get("/users/d/:userId", passport.authenticate('jwt', { session: false }), users.getDisplayInformation)

    app.post('/assign/a', passport.authenticate('jwt', { session: false }), tasks.assignUsers)
    app.post('/assign/d', passport.authenticate('jwt', { session: false }), tasks.unassignUsers)

    app.get('/pond/u/:userId', passport.authenticate('jwt', { session: false }), pond.getUserAssignedPonds)
    app.get('/pond/p/:pondId', passport.authenticate('jwt', { session: false }), pond.getPondAssignedUsers)
    app.get('/pond/:pondId', passport.authenticate('jwt', { session: false }), pond.getPondData)
    app.get('/pond/pads/:pondId', passport.authenticate('jwt', { session: false }), pond.getPondPadData)
    app.get('/pond/tasks/:pondId', passport.authenticate('jwt', { session: false }), pond.getContinuousTasks)

    app.get('/pad/:padId', passport.authenticate('jwt', { session: false }), pond.getTasksForPad)
    app.put('/pad/review', passport.authenticate('jwt', { session: false }), pond.updatePadReviewText)
    app.put('/pad/dates', passport.authenticate('jwt', { session: false }), pond.updateStartAndEndDate)
    app.put('/pad/orders', passport.authenticate('jwt', { session: false }), pond.updateOrderValues)
    app.post('/pad', passport.authenticate('jwt', { session: false }), pond.insertPadForPond)
    app.delete('/pad', passport.authenticate('jwt', { session: false }), pond.deletePad)
}

module.exports = app => {
    const User = require('../models/user')
    const passport = require('passport')
    const utils = require('../lib/utils')
    const tasks = require('../controllers/task.controller')
    const users = require('../controllers/user.controller')

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
                        full_name: tokenObject.full_name 
                    })
                } else {
                    res.status(401).json({ success: false, msg: 'Incorrect password' })
                }
            }
        })
    })

    app.get('/tasks/:userId', passport.authenticate('jwt', { session: false }), tasks.getDisplayDescription)
    app.get('/tasks/t/:taskId', passport.authenticate('jwt', { session: false }), tasks.getTaskDetails)
    app.post('/tasks/i', passport.authenticate('jwt', { session: false }), tasks.insertNewTask)

    app.get("/comm/:taskId", passport.authenticate('jwt', { session: false }), tasks.getTaskComments)
    app.post('/comm/add', passport.authenticate('jwt', { session: false }), tasks.insertNewComment)

    app.get("/users/a", passport.authenticate('jwt', { session: false }), users.findAll)
    app.get("/users/s/:userId", passport.authenticate('jwt', { session: false }), users.findById)
    app.get("/users/d/:userId", passport.authenticate('jwt', { session: false }), users.getDisplayInformation)
}


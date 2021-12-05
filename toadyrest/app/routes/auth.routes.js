module.exports = app => {
    const User = require('../models/user')
    const passport = require('passport')
    const utils = require('../lib/utils')
    const tasks = require('../controllers/task.controller')

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
                    res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires, user_id: tokenObject.user_id })
                } else {
                    res.status(401).json({ success: false, msg: 'Incorrect password' })
                }
            }
        })
    })

    app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
        res.status(200).send({ success: true, msg: "Successfully used protected route!" })
    })

    app.get('/tasks/:userId', passport.authenticate('jwt', { session: false }), tasks.getDisplayDescription)
}


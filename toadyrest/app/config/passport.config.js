const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const publicKey = 'TempPhraseToChange'
const User = require('../models/user')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: publicKey,
    algorithms: ['HS256']
}

module.exports = (passport) => {
    passport.use(new JwtStrategy(options, function(jwt_payload, done) {
        User.findByUsername(username, function(err, user) {
            if (err) {
                return done(err, false)
            }
            if (user) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        })
    }))
}
const jsonwebtoken = require('jsonwebtoken')

function issueJWT(user) {
    const username = user.username
    const expiresIn = '1d'

    const payload = {
        sub: username,
        iat: Math.floor(Date.now() / 1000)
    }

    const signedToken = jsonwebtoken.sign(payload, 'TempPhraseToChange', { expiresIn: expiresIn, algorithm: 'HS256' })

    return {
        token: "Bearer " + signedToken,
        user_id: user.user_id,
        full_name: `${user.first_name} ${user.last_name}`,
        expires: expiresIn
    }
}

function isValidPassword(password, current_password) {
    // Obviously this will use a hash to compare them at some point
    return (password === current_password)
}

module.exports.issueJWT = issueJWT
module.exports.isValidPassword = isValidPassword
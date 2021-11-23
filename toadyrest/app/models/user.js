const sql = require("./db")

// TODO: Update this so normal queries don't return all fields, like passwords, etc

const User = function(user) {
    this.userId = user.userId
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.accountTypeId = user.accountTypeId
}

User.getDisplayDescription = (userId, result) => {
    const query = 
    "SELECT " +
        "u.user_id AS user_id, " +
        "u.first_name AS first_name, " +
        "u.last_name AS last_name, " +
        "u.current_password AS current_password, " +
        "a_t.display_name AS display_name " +
    "FROM " +
        "users u, " +
        "account_types a_t " +
    "WHERE " + 
        "u.account_type_id = a_t.account_type_id " +
        "AND u.user_id = ? "

    console.log(query)

    sql.query(query, userId, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return;
        }

        if (res.length) {
            console.log("Found user: " + res)
            result(null, res[0])
            return;
        }

        result({kind: "not_found"}, null)
    })
}

User.findById = (userId, result) => {
    const query = "SELECT * FROM users WHERE user_id = ?"

    sql.query(query, userId, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return;
        }

        if (res.length) {
            console.log("Found user: " + res)
            result(null, res[0])
            return;
        }

        result({kind: "not_found"}, null)
    })
}

User.findByUsername = (username, result) => {
    const query = "SELECT * FROM users WHERE username = ?"

    sql.query(query, username, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return
        }

        if (res.length) {
            console.log("Found user: " + res)
            result(null, res[0])
            return
        }

        result({kind: "not_found"}, null)
    })
}

User.getAll = result => {
    const query = "SELECT * FROM users"

    sql.query(query, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(null, err)
            return;
        }

        console.log("Users: " + res)
        result(null, res)
    })
}

module.exports = User
const sql = require("./db")

// TODO: Update this so normal queries don't return all fields, like passwords, etc

const User = function(user) {
    this.userId = user.user_id
    this.username = user.username
    this.firstName = user.first_name
    this.lastName = user.last_name
    this.currentPassword = user.current_password
    this.accountTypeId = user.account_type_id
}

User.getSimpleInformation = (result) => {
    const query = "SELECT DISTINCT " +
        "u.user_id, " +
        "u.first_name, " +
        "u.last_name, " +
        "CONCAT(u.first_name, ' ', u.last_name) AS full_name, " +
        "u.username " +
    "FROM " +
        "users u " +
    "ORDER BY " +
        "u.user_id"
    
    sql.query(query, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return;
        }

        if (res.length) {
            console.log("Found users: " + res)
            result(null, res)
            return;
        }

        result({kind: "not_found"}, null)
    })
}

User.getDisplayDescription = (userId, result) => {
    const query = 
    "SELECT " +
        "u.user_id AS user_id, " +
        "u.first_name AS first_name, " +
        "u.last_name AS last_name, " +
        "a_t.display_name AS display_name " +
    "FROM " +
        "users u, " +
        "account_types a_t " +
    "WHERE " + 
        "u.account_type_id = a_t.account_type_id " +
        "AND u.user_id = ? "

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

User.insertNewUser = (username, firstname, lastname, password, result) => {
    // Update my.ini set global max_packet to much larger than it currently is
    const query = 'INSERT INTO users (username, first_name, last_name, current_password, account_type_id) VALUES (?, ?, ?, ?, 1)'

    sql.query(query, [username, firstname, lastname, password], (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return
        }

        result(null, res.insertId)
    })
}

User.findByUsername = (username, result) => {
    /*const query = "SELECT * FROM users WHERE username = ?"*/
    const query = "select " +
	    "u.user_id, " +
        "u.username, " +
        "CONCAT(u.first_name, ' ', u.last_name) as full_name, " +
        "u.first_name, " +
        "u.last_name, " +
        "u.current_password " +
    "from " +
	    "users u " +
    "where " +
	    "u.username = ?"

    sql.query(query, username, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return
        }

        if (res.length) {
            console.log("Found user: " + JSON.stringify(res[0]))
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
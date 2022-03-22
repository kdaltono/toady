const sql = require("./db")

const UserToPond = function(user_to_pond) {
    this.user_id = user_to_pond.user_id
    this.pond_id = user_to_pond.pond_id
    this.account_type_id = user_to_pond.account_type_id
};

UserToPond.assignUserToPond = (pond_id, user_id, account_type_id) => {
    var query = "insert into user_to_pond values (?, ?, ?)"

    sql.query(query, [user_id, pond_id, account_type_id], (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return;
        }

        result(null, res)
    })
}

UserToPond.updateUserToPond = (pond_id, user_id, account_type_id) => {
    var query = "update user_to_pond set account_type_id = ? where user_id = ? and pond_id = ?"

    sql.query(query, [account_type_id, user_id, pond_id], (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return;
        }
        result(null, res)
    })
}

UserToPond.deleteUserToPond = (pond_id, user_id, account_type_id) => {
    var query = "delete from user_to_pond where user_id = ? and pond_id = ? and account_type_id = ?"

    sql.query(query, [user_id, pond_id, account_type_id], (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return;
        }

        result(null, res)
    })
}

UserToPond.getPondAssignedUsers = (pond_id, result) => {
    var query = "select " +
	    "at.account_type_id, " +
	    "at.display_name, " +
        "u.user_id, " + 
        "CONCAT(u.first_name, \" \", u.last_name) as full_name, " +
        "u.first_name, " +
        "u.last_name, " +
        "u.username " +
    "from " +
        "account_types at left outer join user_to_pond utp on " +
        "(at.account_type_id = utp.account_type_id and at.pond_id = utp.pond_id) left join users u " +
        "on (utp.user_id = u.user_id) left join ponds p " +
        "on (utp.pond_id = p.pond_id) " +
    "where " +
	    "at.pond_id = ? " +
    "order by " +
	    "at.account_type_id"

    sql.query(query, pond_id, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return
        }

        result(null, res)
    })
}

module.exports = UserToPond
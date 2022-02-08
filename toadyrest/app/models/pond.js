const sql = require('./db')

const Pond = function(pond) {
    this.pond_id = pond.pond_id;
    this.pond_name = pond.pond_name;
    this.created_by = pond.created_by;
    this.dstamp = pond.dstamp;
    this.is_active = pond.is_active;
}

Pond.getPondData = (pond_id, result) => {
    var query = 
    "SELECT " +
        "ponds.pond_id, " +
        "ponds.pond_name, " +
        "CONCAT(users.first_name, \" \", users.last_name) as created_by, " +
        "ponds.dstamp, " +
        "ponds.is_active " +
    "FROM " +
        "ponds left join users " +
        "on (ponds.created_by = users.user_id) " +
    "WHERE " +
        "ponds.pond_id = ?"

    sql.query(query, pond_id, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return
        }

        result(null, res[0])
    })
}

Pond.getPondPadData = (pond_id, result) => {
    var query = 
    "SELECT " +
        "pads.pad_id, " +
        "pads.pad_name, " +
        "pads.parent_pond_id, " +
        "pads.order_value " +
    "FROM " +
        "pads left join ponds " +
        "on (pads.parent_pond_id = ponds.pond_id) " +
    "WHERE " +
        "ponds.pond_id = ?";

    sql.query(query, pond_id, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return
        }

        result(null, res);
    })
}

Pond.getUserAssignedPonds = (user_id, result) => {
    var query = 
    "SELECT " +
        "ponds.pond_id, " +
        "ponds.pond_name, " +
        "CONCAT(users.first_name, \" \", users.last_name) as created_by, " +
        "ponds.dstamp, " +
        "ponds.is_active " +
    "FROM " +
        "ponds left join user_to_pond utp " +
        "on (ponds.pond_id = utp.pond_id) left join users " +
        "on (ponds.created_by = users.user_id) " +
    "WHERE " +
        "utp.user_id = ?"
        
    sql.query(query, user_id, (err, res) => {
        if (err) {
            console.log("Error with query: " + query + "\nError: " + err)
            result(err, null)
            return
        }

        result(null, res)
    })
}

Pond.getPondAssignedUsers = (pond_id, result) => {
    var query = 
    "SELECT " +
        "u.user_id, " +
        "CONCAT(u.first_name, \" \", u.last_name) AS full_name, " +
        "u.first_name, " +
        "u.last_name, " +
        "u.username " +
    "FROM " +
        "ponds p left join user_to_pond utp " +
        "on (p.pond_id = utp.pond_id) left join users u " +
        "on (utp.user_id = u.user_id) " +
    "WHERE " +
        "p.pond_id = ?"
    
    sql.query(query, pond_id, (err, res) => {
        if (err) {
            console.log("Error with query: " + query + "\nError: " + err)
            result(err, null)
            return
        }

        result(null, res)
    })
}

module.exports = Pond
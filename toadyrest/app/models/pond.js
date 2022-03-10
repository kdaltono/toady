const sql = require('./db')

const Pond = function(pond) {
    this.pond_id = pond.pond_id;
    this.pond_name = pond.pond_name;
    this.created_by = pond.created_by;
    this.dstamp = pond.dstamp;
    this.is_active = pond.is_active;
}

Pond.getContinuousTasks = (pond_id, result) => {
    const query = 
    "SELECT " +
        "t.task_id, " +
        "t.task_title, " +
        "GROUP_CONCAT(u.username SEPARATOR', ') as \"usernames\", " +
        "ts.status_text " +
    "FROM " +
        "( " +
            "SELECT DISTINCT " +
                "utt.task_id " +
            "FROM " +
                "user_to_task utt " +
            "WHERE " +
                "utt.user_id = ?" +
        ") AS a_t LEFT JOIN user_to_task utt " +
        "ON (a_t.task_id = utt.task_id) LEFT JOIN tasks t " +
        "ON (utt.task_id = t.task_id) LEFT JOIN users u " +
        "ON (utt.user_id = u.user_id) LEFT JOIN task_status ts " +
        "ON (t.status_id = ts.status_id) " +
    "WHERE " +
        // Can have this is a variable so that you can switch between finished and 
        // unfinished tasks
        "ts.is_complete = false " +
        "and t.is_continuous = TRUE " +
    "GROUP BY " +
        "t.task_id, " +
        "t.task_title " +
    "ORDER BY " +
        "t.task_id "

    sql.query(query, pond_id, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return;
        }

        console.log("Returning pond data: " + JSON.stringify(res))
        result(null, res)
    })
}

Pond.getPondData = (pond_id, current_user_id, result) => {
    var query = "SELECT " + 
        "ponds.pond_id, " +
        "ponds.pond_name, " +
        "CONCAT(users.first_name, \" \", users.last_name) as created_by, " +
        "ponds.dstamp, " +
        "ponds.is_active " +
    "FROM " +
        "ponds left join users " +
        "on (ponds.created_by = users.user_id) " +
    "WHERE " +
        "ponds.pond_id = ? "

    sql.query(query, [current_user_id, pond_id], (err, res) => {
        if (err) {
            console.log("Error: " + err + "\nUser ID: " + query)
            result(err, null)
            return
        }

        result(null, res[0])
    })
}

Pond.getPondPadData = (pond_id, result) => {
    var query = 
    "select " +
	    "pads.pad_name, " +
        "pads.order_value, " +
        "pads.pad_id, " +
        "pads.parent_pond_id, " +
        "pads.review_text, " + 
        "pads.start_dstamp, " + 
        "pads.end_dstamp, " + 
        "case " +
		    "when task_data.complete_count = task_data.task_count then " +
			    "TRUE " +
		    "else " +
			    "FALSE " +
	    "end as pad_is_complete " +
    "from " +
	    "pads left join ponds " +
        "on (pads.parent_pond_id = ponds.pond_id) left join ( " +
		    "select " +
			    "tasks.pond_id, " +
			    "tasks.pad_id, " +
			    "COUNT(case when task_status.is_complete = TRUE THEN 1 END) AS complete_count, " +
			    "COUNT(tasks.task_id) AS task_count " +
		    "from " +
			    "tasks left join task_status " +
			    "on (tasks.status_id = task_status.status_id) " +
		    "where " +
			    "tasks.is_continuous = false " +
		    "group by " +
			    "tasks.pond_id, " +
			    "tasks.pad_id " +
        ") task_data " +
        "on (task_data.pad_id = pads.pad_id  " +
		"and task_data.pond_id = ponds.pond_id) " +
    "where " +
	    "ponds.pond_id = ? " +
    "group by " +
	    "pads.pad_name, " +
        "pads.order_value, " +
        "pads.pad_id " +
    "order by " +
	    "pads.order_value ";

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
    // TODO: Remove the distinct when fixing the assigning issues
    "SELECT DISTINCT " +
        "ponds.pond_id, " +
        "ponds.pond_name, " +
        "CONCAT(users.first_name, \" \", users.last_name) as created_by, " +
        "ponds.dstamp, " +
        "ponds.is_active " +
    "FROM " +
        "ponds left join user_to_pond utp " +
        "on (ponds.pond_id = utp.pond_id) left join users " +
        "on (ponds.created_by = users.user_id) " /*+
    "WHERE " +
        "utp.user_id = ?"*/
        
    sql.query(query, user_id, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return
        }

        result(null, res)
    })
}

Pond.getPondAccountTypes = (pond_id, result) => {
    query = "select * from account_types where pond_id = ?"

    sql.query(query, pond_id, (err, res) => {
        if (err) {
            console.log("Error: " + err)
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

Pond.insertNewPond = (pond_name, created_by, result) => {
    var query = "insert into ponds (pond_name, created_by) values (?, ?)"

    sql.query(query, [pond_name, created_by], (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null);
            return
        }

        result(null, res)
    })
}

Pond.updateAccountType = (at, result) => {
    var query = "update " +
	    "account_types " +
    "set " +
	    "display_name = ?, " +
        "can_modify_pads = ?, " +
        "can_delete_pads = ?, " +
        "can_create_pads = ?, " +
        "can_modify_assigned_users = ?, " +
        "can_modify_tasks = ?, " +
        "can_create_tasks = ? " +
    "where " +
	    "account_type_id = 1 ";

    sql.query(query, [at.display_name, at.can_modify_pads, at.can_delete_pads, at.can_create_pads,
        at.can_modify_assigned_users, at.can_modify_tasks, at.can_create_tasks, at.account_type_id],
        (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return
        }

        result(null, res)
    })
}

module.exports = Pond
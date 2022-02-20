const sql = require('./db')

const Pad = function(pad) {
    this.pad_id = pad.pad_id
    this.pad_name = pad.pad_name
    this.parent_pond_id = pad.parent_pond_id
    this.order_value = pad.order_value
}

Pad.updatePadReviewText = (padId, reviewText, result) => {
    var query = "UPDATE pads SET review_text = ? WHERE pad_id = ?"

    sql.query(query, [reviewText, padId], (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return
        }

        result(null, res)
    })
}

Pad.updateStartAndEndDate = (start_dstamp, end_dstamp, pad_id, result) => {
    var query = "UPDATE pads SET start_dstamp = ?, end_dstamp = ? WHERE pad_id = ?";

    sql.query(query, [start_dstamp, end_dstamp, pad_id], (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return
        }

        result(null, res)
    })
}

Pad.updateOrderValues = (padOrderValues, result) => {
    var query = "UPDATE pads SET order_value = ? WHERE pad_id = ?"
    var errors = ''
    var results = ''

    padOrderValues.forEach(pad => {
        sql.query(query, [pad.order_value, pad.pad_id], (err, res) => {
            if (err) {
                console.log("Error: " + err)
                errors += err
                return
            }
            results += res
        })
    })

    if (errors) {
        result(errors, null)
        return
    }

    result(null, results)
}

Pad.insertNewPadForPond = (pond_id, pad_name, result) => {
    var query = 
    "INSERT " +
	    "INTO pads(pad_name, parent_pond_id, order_value) " +
    "VALUES " +
	    "(?, ?, ( " +
		    "SELECT " +
			    "max(p2.order_value) + 1 " +
		    "from " +
			    "pads p2 " +
		    "where " +
			    "p2.parent_pond_id = ? ))"

    sql.query(query, [pad_name, pond_id, pond_id], (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return
        }

        result(null, res)
    })
}

Pad.getTasksForPad = (padId, result) => {
    var query = 
    "select " +
        "t.task_id, " +
        "t.task_title, " +
        "t.task_desc, " +
        "st.status_text " +
    "from " +
        "pads p left join tasks t " +
        "on (p.pad_id = t.pad_id) left join task_status st " +
        "on (t.status_id = st.status_id) " +
    "where " +
        "p.pad_id = ?" +
        "AND t.is_continuous = FALSE"
    
    sql.query(query, padId, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return
        }

        result(null, res)
    })
}

module.exports = Pad
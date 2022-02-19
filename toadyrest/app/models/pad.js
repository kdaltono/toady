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
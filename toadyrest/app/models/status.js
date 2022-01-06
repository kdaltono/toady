const sql = require('./db')

const Status = function(status) {
    this.status_id = status.status_id,
    this.status_text = status.status_text,
    this.is_complete = status.is_complete
};

Status.getTaskStatus = (result) => {
    const query = 'select * from task_status';

    sql.query(query, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return;
        }

        if (res.length) {
            console.log("Found task statuses: " + res)
            result(null, res)
            return
        }

        result({ kind: "not_found" }, null)
    })
}

module.exports = Status;
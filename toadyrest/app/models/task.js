const sql = require('./db')

const Task = function(task) {
    this.task_id = task.task_id
    this.task_title = task.task_title
    this.task_desc = task.task_desc
}

Task.getTaskInformation = (taskId, result) => {
    const query = 
    "SELECT " +
        "* " +
    "FROM " +
        "tasks t " +
    "WHERE " +
        "t.task_id = ?"

    sql.query(query, taskId, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return;
        }

        if (res.length) {
            console.log("Found display tasks: " + res)
            result(null, res)
            return
        }

        result({ kind: "not_found" }, null)
    })
}

module.exports = Task
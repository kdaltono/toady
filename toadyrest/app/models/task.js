const sql = require('./db')

const TaskDisplay = function(task) {
    this.username = task.username
    this.task_title = task.task_title
}

TaskDisplay.getUserDisplayTasks = (userId, result) => {
    const query = 
    "SELECT " +
        "u.username, " +
        "t.task_title " +
    "FROM " +
        "user_to_task utt LEFT JOIN users u " +
        "ON (utt.user_id = u.user_id) " +
        "LEFT JOIN tasks t " +
        "ON (utt.task_id = t.task_id) " +
    "WHERE " +
        "u.user_id = ?"
    
    sql.query(query, userId, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return;
        }

        if (res.length) {
            console.log("Found display tasks: " + res)
            result(null, res)
            return;
        }

        result({kind: "not_found"}, null)
    })
}

module.exports = TaskDisplay
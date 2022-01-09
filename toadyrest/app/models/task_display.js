const sql = require('./db')

const TaskDisplay = function(task) {
    this.username = task.username
    this.task_title = task.task_title
}

TaskDisplay.getUserDisplayTasks = (userId, result) => {
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
    "GROUP BY " +
        "t.task_id, " +
        "t.task_title " +
    "ORDER BY " +
        "t.task_id "
    
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
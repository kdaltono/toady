const sql = require('./db')

const Task = function(task) {
    this.task_id = task.task_id
    this.task_title = task.task_title
    this.task_desc = task.task_desc
}

Task.getAssignedUsers = (taskId, result) => {
    const query = 
    "SELECT " +
        "u.user_id, " +
        "u.first_name, " +
        "u.last_name, " +
        "CONCAT(u.first_name, \" \", u.last_name) as full_name, " +
        "u.username " +
    "FROM " +
        "tasks t left join user_to_task utt " +
        "on (t.task_id = utt.task_id) left join users u " +
        "on (utt.user_id = u.user_id) " +
    "where " +
        "t.task_id = ?"

    sql.query(query, taskId, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return
        }

        if (res.length) {
            console.log("Found assigned users: " + JSON.stringify(res))
            result(null, res)
            return
        }

        result({ kind: "not_found" }, null)
    })
}

Task.getTaskInformation = (taskId, result) => {
    const query = 
    "select " +
        "t.task_id, " +
        "t.task_title, " +
        "t.task_desc, " +
        "st.status_id, " +
        "st.status_text " +
    "from " +
        "tasks t left join task_status st " +
        "on (t.status_id = st.status_id) " +
    "where " +
        "t.task_id = ?"

    sql.query(query, taskId, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return;
        }

        if (res.length) {
            console.log("Found display tasks: " + res[0])
            result(null, res[0])
            return
        }

        result({ kind: "not_found" }, null)
    })
}

Task.insertNewTask = (taskTitle, taskDescription, padId, pondId, result) => {
    const query = 'INSERT INTO tasks(task_title, task_desc, status_id, pad_id, pond_id) VALUES (?, ?, 1, ?, ?)'

    sql.query(query, [taskTitle, taskDescription, padId, pondId], (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return;
        }

        result(null, res.insertId)
    })
}

Task.updateStatus = (taskId, statusId, result) => {
    const query = 'UPDATE tasks SET status_id = ? where task_id = ?'

    sql.query(query, [statusId, taskId], (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return
        }

        result(null, 'Success')
    })
}

module.exports = Task
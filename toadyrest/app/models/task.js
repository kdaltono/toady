const sql = require('./db')

const Task = function(task) {
    this.task_id = task.task_id
    this.task_title = task.task_title
    this.task_desc = task.task_desc
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

Task.insertNewTask = (taskTitle, taskDescription, result) => {
    const query = 'INSERT INTO tasks(task_title, task_desc) VALUES (?, ?)'

    sql.query(query, [taskTitle, taskDescription], (err, res) => {
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
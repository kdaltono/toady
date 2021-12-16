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

module.exports = Task
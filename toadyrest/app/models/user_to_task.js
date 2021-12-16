const sql = require('./db')

const UserToTask = function(userToTask) {
    this.taskId = userToTask.taskId
    this.userId = userToTask.userId
}

UserToTask.insertNewRecord = (taskId, userId, result) => {
    const query = 'INSERT INTO user_to_task(task_id, user_id) VALUES (?, ?)'

    sql.query(query, [taskId, userId], (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return
        }

        result(null, null)
    })
}

module.exports = UserToTask
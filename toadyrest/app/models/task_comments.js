const sql = require('./db')

const TaskComments = function(taskComment) {
    this.comment_id = taskComment.comment_id
    this.task_id = taskComment.task_id
    this.user_id = taskComment.user_id
    this.task_text = taskComment.task_text
    this.dstamp = taskComment.dstamp
}

TaskComments.addComment = (taskId, userId, commentText, result) => {
    const query = 'INSERT INTO task_comments(user_id, task_id, comment_text) VALUES (?, ?, ?)'

    sql.query(query, [userId, taskId, commentText], (err, res) => {
        if (err) {
            console.log("Error: " + err)
            result(err, null)
            return;
        }

        result(null, res.insertId)
    })
}

TaskComments.getTaskComments = (taskId, result) => {
    const query = 
    'select ' + 
        'tc.comment_id, ' +
        'CONCAT(u.first_name, " ", u.last_name) AS full_name, ' +
        'tc.comment_text, ' +
        'tc.dstamp ' +
    'from ' +
        'task_comments tc LEFT JOIN users u ' +
        'ON (tc.user_id = u.user_id) ' +
    'where ' +
        'tc.task_id = ? ' +
    'order by ' +
        'tc.dstamp ASC'

    sql.query(query, taskId, (err, res) => {
        if (err) {
            console.log('Error: ' + err)
            result(err, null)
            return
        }

        if (res.length) {
            console.log('Found comments: ' + res)
            result(null, res)
            return
        }

        result({kind: 'not_found'}, null)
    })
}

module.exports = TaskComments
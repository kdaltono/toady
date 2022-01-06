SELECT 
    u.user_id AS user_id,
    u.first_name AS first_name,
    u.last_name AS last_name,
    u.current_password AS current_password,
    a_t.display_name AS display_name
from
    users u,
    account_types a_t
WHERE
    u.account_type_id = a_t.account_type_id
    AND u.user_id = 1
    ;

SELECT
    u.username,
    t.task_title
FROM
    user_to_task utt LEFT JOIN users u
    ON (utt.user_id = u.user_id) 
    LEFT JOIN tasks t
    ON (utt.task_id = t.task_id)
WHERE
    u.user_id = 1
    ;


SELECT
    t.task_id,
    t.task_title,
    u.username
FROM
    (
        SELECT
            utt.task_id,
            utt.user_id
        FROM    
            user_to_task utt
        WHERE
            utt.user_id = 1
    ) AS assigned_tasks LEFT JOIN tasks t
    ON (t.task_id = assigned_tasks.task_id)
    ;

SELECT
    t.task_id,
    t.task_title,
    GROUP_CONCAT(u.username SEPARATOR', ') as "usernames"
FROM
    (
        SELECT DISTINCT
            utt.task_id
        FROM    
            user_to_task utt
        WHERE
            utt.user_id = 2
    ) AS a_t LEFT JOIN user_to_task utt
    ON (a_t.task_id = utt.task_id) LEFT JOIN tasks t
    ON (utt.task_id = t.task_id) LEFT JOIN users u
    ON (utt.user_id = u.user_id)
GROUP BY
    t.task_id,
    t.task_title
ORDER BY
    t.task_id
    ;
    
SELECT DISTINCT
    u.user_id, 
    CONCAT(u.first_name, ' ', u.last_name) AS full_name
FROM
    users u
ORDER BY
    u.user_id
    ;

INSERT INTO tasks(task_title, task_desc) VALUES ("Test title", "Test description");

INSERT INTO user_to_task(task_id, user_id) VALUES (?, ?)

INSERT INTO task_comments(user_id, task_id, comment_text) VALUES (?, ?, ?)

select * from users;
s
delete * from users where users.user_id > 2;

select 
    tc.comment_id,
    CONCAT(u.first_name, " ", u.last_name) AS full_name,
    tc.comment_text,
    tc.dstamp
from
    task_comments tc LEFT JOIN users u
    ON (tc.user_id = u.user_id)
where
    tc.task_id = 1;

delete FROM task_comments where comment_id = ? limit 1

delete from task_comments where comment_text = ? AND user_id = ? order by dstamp DESC limit 1

select
    t.task_id,
    t.task_title,
    t.task_desc,
    st.status_text
from
    tasks t left join task_status st
    on (t.status_id = st.status_id)
where
    t.task_id = 1;

SELECT
    *
FROM
    task_status;
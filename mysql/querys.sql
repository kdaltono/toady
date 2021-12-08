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
    
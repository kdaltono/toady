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

UPDATE tasks SET status_id = 1 WHERE task_id = 1;

SELECT
        t.task_id, 
        t.task_title, 
        GROUP_CONCAT(u.username SEPARATOR', ') as "usernames", 
        ts.status_text 
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
        ON (utt.user_id = u.user_id) LEFT JOIN task_status ts 
        ON (t.status_id = ts.status_id) 
    WHERE 
        ts.is_complete = false 
    GROUP BY 
        t.task_id, 
        t.task_title 
    ORDER BY 
        t.task_id;

SELECT
    u.user_id,
    u.first_name,
    u.last_name,
    CONCAT(u.first_name, " ", u.last_name),
    u.username
FROM
    tasks t left join user_to_task utt
    on (t.task_id = utt.task_id) left join users u
    on (utt.user_id = u.user_id)
where
    t.task_id = 17;

select
    u.user_id,
    tc.comment_id,
    CONCAT(u.first_name, " ", u.last_name) AS full_name,
    tc.comment_text,
    tc.dstamp 
from 
    task_comments tc LEFT JOIN users u 
    ON (tc.user_id = u.user_id) 
where
    tc.task_id = 30 
order by 
    tc.dstamp ASC;

SELECT
    ponds.pond_id,
    ponds.pond_name,
    CONCAT(users.first_name, " ", users.last_name) as created_by,
    ponds.dstamp,
    ponds.is_active
FROM
    ponds left join user_to_pond utp
    on (ponds.pond_id = utp.pond_id) left join users
    on (ponds.created_by = users.user_id)
WHERE
    utp.user_id = 2;

SELECT
    u.user_id,
    CONCAT(u.first_name, " ", u.last_name) AS full_name,
    u.first_name,
    u.last_name,
    u.username
FROM
    ponds p left join user_to_pond utp
    on (p.pond_id = utp.pond_id) left join users u
    on (utp.user_id = u.user_id)
WHERE
    p.pond_id = 1;

SELECT
    ponds.pond_id,
    ponds.pond_name,
    CONCAT(users.first_name, " ", users.last_name) as created_by,
    ponds.dstamp,
    ponds.is_active
FROM
    ponds left join users 
    on (ponds.created_by = users.user_id)
WHERE
    ponds.pond_id = 1;

SELECT  
    pads.order_value,
    pads.pad_name
FROM    
    ponds left join pads
    on (pads.parent_pond_id = ponds.pond_id)
WHERE
    ponds.pond_id = 1
order by
    pads.order_value;

select
    t.task_id,
    t.task_title,
    t.task_desc,
    st.status_text
from
    pad p left join tasks t 
    on (p.pad_id = t.pad_id) left join task_status st
    on (t.status_id = st.status_id)
where
    p.pad_id = 1;
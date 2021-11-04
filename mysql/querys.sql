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
    ;

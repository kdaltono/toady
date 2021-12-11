USE toady;

DROP TABLE account_types;
DROP TABLE users;
DROP TABLE tasks;
DROP TABLE user_to_task;

CREATE TABLE IF NOT EXISTS account_types(
    account_type_id INTEGER AUTO_INCREMENT NOT NULL,
    display_name VARCHAR(30) NOT NULL,
    account_type_level INTEGER NOT NULL,
    PRIMARY KEY (account_type_id)
);

CREATE TABLE IF NOT EXISTS users(
    user_id INTEGER AUTO_INCREMENT NOT NULL,
    username VARCHAR(30) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    account_type_id INTEGER NOT NULL,
    current_password VARCHAR(30) NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (account_type_id) 
        REFERENCES account_types(account_type_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks(
    task_id INTEGER AUTO_INCREMENT NOT NULL,
    task_title VARCHAR(50) NOT NULL,
    task_desc TEXT NOT NULL,
    PRIMARY KEY (task_id)
);

CREATE TABLE IF NOT EXISTS user_to_task(
    task_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (task_id)
        REFERENCES tasks(task_id),
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
);

INSERT INTO account_types (display_name, account_type_level) VALUES ("Admin", 10);
INSERT INTO account_types (display_name, account_type_level) VALUES ("Viewer", 1);
INSERT INTO account_types (display_name, account_type_level) VALUES ("User", 5);

INSERT INTO users (username, first_name, last_name, account_type_id, current_password) VALUES ("jdalton", "James", "Dalton", 1, "1234");
INSERT INTO users (username, first_name, last_name, account_type_id, current_password) VALUES ("gwallis", "Gabi", "Wallis", 3, "3414");

INSERT INTO tasks(task_title, task_desc) VALUES ("Test task 1", "Task description");
INSERT INTO tasks(task_title, task_desc) VALUES ("Test task 2", "Task description 2");

INSERT INTO user_to_task(task_id, user_id) VALUES (1, 1);
INSERT INTO user_to_task(task_id, user_id) VALUES (2, 2);
INSERT INTO user_to_task(task_id, user_id) VALUES (2, 1);
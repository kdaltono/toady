USE toady;

DROP TABLE account_types;
DROP TABLE users;
DROP TABLE tasks;
DROP TABLE user_to_task;
DROP TABLE task_status;

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

CREATE TABLE IF NOT EXISTS task_status(
    status_id INTEGER AUTO_INCREMENT NOT NULL,
    status_text VARCHAR(30) NOT NULL,
    is_complete BOOLEAN NOT NULL,
    PRIMARY KEY(status_id)
);

INSERT INTO task_status(status_text, is_complete) VALUES ('Open', FALSE);
INSERT INTO task_status(status_text, is_complete) VALUES ('In Progress', FALSE);
INSERT INTO task_status(status_text, is_complete) VALUES ('Complete', TRUE);
INSERT INTO task_status(status_text, is_complete) VALUES ('Cancelled', TRUE);

CREATE TABLE IF NOT EXISTS tasks(
    task_id INTEGER AUTO_INCREMENT NOT NULL,
    task_title VARCHAR(50) NOT NULL,
    task_desc TEXT NOT NULL,
    status_id INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (task_id),
    FOREIGN KEY (status_id)
        REFERENCES task_status(status_id)
);

ALTER TABLE tasks ADD COLUMN pond_id INTEGER NOT NULL;
UPDATE tasks SET pond_id = 1;
ALTER TABLE tasks ADD FOREIGN KEY (pond_id) REFERENCES ponds(pond_id);

ALTER TABLE tasks ADD COLUMN pad_id INTEGER NOT NULL;
UPDATE tasks SET pad_id = 1;
ALTER TABLE tasks ADD FOREIGN KEY (pad_id) REFERENCES pads(pad_id);

CREATE TABLE IF NOT EXISTS ponds(
    pond_id INTEGER AUTO_INCREMENT NOT NULL,
    pond_name VARCHAR(50) NOT NULL,
    created_by INTEGER NOT NULL,
    dstamp DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (pond_id),
    FOREIGN KEY (created_by)
        REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS pads(
    pad_id INTEGER AUTO_INCREMENT NOT NULL,
    pad_name VARCHAR(50) NOT NULL,
    parent_pond_id INTEGER NOT NULL,
    order_value INTEGER NOT NULL,
    PRIMARY KEY (pad_id, parent_pond_id, order_value),
    FOREIGN KEY (parent_pond_id)
        REFERENCES users(user_id)
);

INSERT INTO pads(pad_name, parent_pond_id, order_value) VALUES ("Start", 1, 1);
INSERT INTO pads(pad_name, parent_pond_id, order_value) VALUES ("Middle", 1, 2);
INSERT INTO pads(pad_name, parent_pond_id, order_value) VALUES ("End", 1, 3);

INSERT INTO ponds(pond_name, created_by) VALUES ("Test Pond", 1);

CREATE TABLE IF NOT EXISTS user_to_pond(
    pond_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    is_manager BOOLEAN DEFAULT FALSE NOT NULL,
    PRIMARY KEY (pond_id, user_id)
);

INSERT INTO user_to_pond (pond_id, user_id, is_manager) VALUES (1, 1, TRUE);

CREATE TABLE IF NOT EXISTS task_comments(
    comment_id INTEGER AUTO_INCREMENT NOT NULL,
    task_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    comment_text TEXT NOT NULL,
    dstamp DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (task_id)
        REFERENCES tasks(task_id),
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
);

INSERT INTO task_comments(task_id, user_id, comment_text) VALUES (1, 1, "Task comment");

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

INSERT INTO tasks(task_title, task_desc, status_id) VALUES ("Test task 1", "Task description", 1);
INSERT INTO tasks(task_title, task_desc, status_id) VALUES ("Test task 2", "Task description 2", 1);

INSERT INTO user_to_task(task_id, user_id) VALUES (1, 1);
INSERT INTO user_to_task(task_id, user_id) VALUES (2, 2);
INSERT INTO user_to_task(task_id, user_id) VALUES (2, 1);

INSERT INTO tasks(task_title, task_desc, status_id, pond_id, pad_id) 
    VALUES ("Start Task 1", "Start Description 1", 1, 1, 1);
INSERT INTO tasks(task_title, task_desc, status_id, pond_id, pad_id) 
    VALUES ("Start Task 2", "Start Description 2", 1, 1, 1);
INSERT INTO tasks(task_title, task_desc, status_id, pond_id, pad_id) 
    VALUES ("Start Task 3", "Start Description 3", 1, 1, 1);

INSERT INTO tasks(task_title, task_desc, status_id, pond_id, pad_id) 
    VALUES ("Middle Task 1", "Middle Description 1", 1, 1, 2);
INSERT INTO tasks(task_title, task_desc, status_id, pond_id, pad_id) 
    VALUES ("Middle Task 2", "Middle Description 2", 1, 1, 2);
    INSERT INTO tasks(task_title, task_desc, status_id, pond_id, pad_id) 
    VALUES ("Middle Task 3", "Middle Description 3", 1, 1, 2);

INSERT INTO tasks(task_title, task_desc, status_id, pond_id, pad_id) 
    VALUES ("End Task 1", "End Description 1", 1, 1, 3);
INSERT INTO tasks(task_title, task_desc, status_id, pond_id, pad_id) 
    VALUES ("End Task 2", "End Description 2", 1, 1, 3);
INSERT INTO tasks(task_title, task_desc, status_id, pond_id, pad_id) 
    VALUES ("End Task 3", "End Description 3", 1, 1, 3);
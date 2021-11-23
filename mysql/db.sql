USE toady;

DROP TABLE account_types;
DROP TABLE users;

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

INSERT INTO account_types (display_name, account_type_level) VALUES ("Admin", 10);
INSERT INTO account_types (display_name, account_type_level) VALUES ("Viewer", 1);
INSERT INTO account_types (display_name, account_type_level) VALUES ("User", 5);

INSERT INTO users (username, first_name, last_name, account_type_id, current_password) VALUES ("jdalton", "James", "Dalton", 1, "1234");
INSERT INTO users (username, first_name, last_name, account_type_id, current_password) VALUES ("gwalis", "Gabi", "Wallis", 3, "3414");
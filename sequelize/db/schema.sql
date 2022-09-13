-- Schema
DROP DATABASE burgers_db;
CREATE DATABASE  burgers_db;
USE burgers_db;

CREATE TABLE burgers (
	id Int AUTO_INCREMENT NOT NULL,
	burger_name VARCHAR(255) NOT NULL,
	devoured boolean DEFAULT 0,
	createdAt DATE,
	updatedAt DATE,
	PRIMARY KEY (id) 
    );

-- Seeds
INSERT INTO burgers (burger_name) VALUES ('Burger a la Mode');
INSERT INTO burgers (burger_name) VALUES ('Chicken Sandwitch');
INSERT INTO burgers (burger_name) VALUES ('Pork Man');
INSERT INTO burgers (burger_name) VALUES ('Veggie Surprise');
INSERT INTO burgers (burger_name) VALUES ('Ozymandias; Burger Supreme');

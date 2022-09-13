DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department VARCHAR(45) NOT NULL,
  price FLOAT default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (id)   
);



INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("hot dog","food", 2.50, 10);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("broccoli","food", 2.00, 10);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("lamp","furniture", 12.50, 10);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("couch","furniture", 500.00, 10);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("computer","technology", 1000.00, 10);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("phone","technology", 600.00, 10);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("ghost","supernatural", 3000.00, 2);


INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("tin can","sundries", 3.00, 10);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("beans","vittles", 100.00, 5);





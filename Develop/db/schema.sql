-- DROP DATABASE
DROP DATABASE IF EXISTS ecommerce_db;

-- CREATE DATABASE
CREATE DATABASE ecommerce_db;

-- for MySQL
ALTER USER 'root' @'localhost' IDENTIFIED WITH mysql_native_password BY 'root';

-- for MariaDB
ALTER USER 'root' @'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('root');
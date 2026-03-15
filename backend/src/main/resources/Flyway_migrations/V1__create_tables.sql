CREATE TABLE stock(
    id INT PRIMARY KEY AUTO_INCREMENT,
    symbol VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100),
    exchange VARCHAR(50),
    current_price DECIMAL(15,2)
);
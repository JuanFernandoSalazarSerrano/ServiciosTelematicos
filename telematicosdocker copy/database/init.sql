CREATE DATABASE IF NOT EXISTS financeinformationdb;
USE financeinformationdb;

-- Drop tables in reverse dependency order if you want to rerun the script
DROP TABLE IF EXISTS clients_portfolio;
DROP TABLE IF EXISTS stocks;
DROP TABLE IF EXISTS clients;

-- Clients table
CREATE TABLE clients (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    phone      VARCHAR(30),
    city       VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Stocks table
CREATE TABLE stocks (
    stock_id INT AUTO_INCREMENT PRIMARY KEY,
    symbol   VARCHAR(10) NOT NULL UNIQUE,
    company_name VARCHAR(150) NOT NULL,
    current_price DECIMAL(10,2) NOT NULL,
    sector   VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Portfolio table: relationship between clients and stocks
CREATE TABLE clients_portfolio (
    portfolio_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    stock_id INT NOT NULL,
    shares_owned INT NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    purchase_date DATE NOT NULL,
    CONSTRAINT fk_portfolio_client
        FOREIGN KEY (client_id) REFERENCES clients(client_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_portfolio_stock
        FOREIGN KEY (stock_id) REFERENCES stocks(stock_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT uq_client_stock UNIQUE (client_id, stock_id)
) ENGINE=InnoDB;

-- Mock data for clients
INSERT INTO clients (first_name, last_name, email, phone, city) VALUES
('Ana', 'Gomez', 'ana.gomez@email.com', '+57 300 111 2233', 'Bogota'),
('Luis', 'Martinez', 'luis.martinez@email.com', '+57 301 222 3344', 'Cali'),
('Maria', 'Torres', 'maria.torres@email.com', '+57 302 333 4455', 'Medellin'),
('Carlos', 'Perez', 'carlos.perez@email.com', '+57 304 444 5566', 'Barranquilla');

-- Mock data for stocks
INSERT INTO stocks (symbol, company_name, current_price, sector) VALUES
('MUTA',  'Mutatech Holdings', 125.50, 'Technology'),
('AZT',   'Aztoria Energy',    84.20,  'Energy'),
('CHPTL', 'Chaptel Industries', 213.75, 'Industrial');

-- Mock data for clients portfolio
INSERT INTO clients_portfolio (client_id, stock_id, shares_owned, purchase_price, purchase_date) VALUES
(1, 1, 10, 120.00, '2026-05-01'),
(1, 3,  4, 205.00, '2026-05-02'),
(2, 2, 15,  80.50, '2026-05-03'),
(3, 1,  7, 118.25, '2026-05-04'),
(3, 2, 12,  82.10, '2026-05-05'),
(4, 3,  3, 210.00, '2026-05-06');
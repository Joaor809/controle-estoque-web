create database store;
use store;

create table categorys(
    idCategory int auto_increment primary key,
    name varchar(30) unique not null
);

create table products(
    codProduct char(5) primary key not null,
    name varchar(100) not null,
    mark varchar(50) not null,
    idCategory int not null,
    price decimal(10,2) not null,
    quantity int not null,
    foreign key (idCategory) references categorys (idCategory)
);

create table sales(
    idSale int auto_increment primary key,
    date timestamp default current_timestamp,
    totalValue decimal(10,2) not null
);

create table item_sale(
    idItem int auto_increment primary key,
    idSale int not null,
    codProduct char(5) not null,
    quantity int not null,
    price decimal(10,2) not null,
    foreign key (idSale) references sales(idSale),
    foreign key (codProduct) references products(codProduct)
);

create table users(
    idUser int auto_increment primary key,
    name varchar(150) not null,
    cpf char(11) not null,
    email varchar(150) not null,
    telephone varchar(20) not null,
    password varchar(150) not null
);

INSERT INTO categorys (name) VALUES
('Alimentos'),
('Bebidas'),
('Laticínios'),
('Frios'),
('Carnes'),
('Hortifruti'),
('Padaria'),
('Doces e Sobremesas'),
('Biscoitos e Snacks'),
('Massas e Grãos'),
('Enlatados e Conservas'),
('Molhos e Temperos'),
('Café e Chá'),
('Produtos de Limpeza'),
('Higiene Pessoal'),
('Higiene Infantil'),
('Produtos para Animais'),
('Congelados'),
('Utilidades Domésticas'),
('Outros');

use store;
desc item_sale;

select item_sale.idSale, products.name, item_sale.quantity, item_sale.price
from item_sale
inner join products on products.codProduct = item_sale.codProduct;


use store;
create table lots(
    codLot char(6) primary key,
    codProduct char(5) not null,
    quantity int not null,
    expirationDate date not null,
    foreign key (codProduct) references products(codProduct)
);

desc lots;

select
lots.codLot, products.name, lots.quantity, lots.expirationDate
from lots
inner join products on products.codProduct = lots.codProduct;


use store;
select * from users;

select * from lots;
desc lots;
desc products;

select lots.codLot, products.name, products.mark, products.price, categorys.name as category, lots.quantity, lots.expirationDate
from lots
inner join products on products.codProduct = lots.codProduct
inner join categorys on categorys.idCategory = products.idCategory;

alter table products
drop column quantity;
desc products;

use store;
SELECT item_sale.idItem, item_sale.idSale, products.name, item_sale.quantity, item_sale.price
FROM item_sale
INNER JOIN products ON products.codProduct = item_sale.codProduct;

SELECT * FROM users WHERE cpf = "18125054693";

SELECT p.codProduct, p.name, p.mark, c.name AS category, p.price
FROM products p
JOIN categorys c ON p.idCategory = c.idCategory
ORDER BY p.codProduct;

use store;
SELECT p.codProduct, p.name, p.mark, c.name AS category, p.price
FROM products p
JOIN categorys c ON p.idCategory = c.idCategory
WHERE p.name LIKE "%arro%";

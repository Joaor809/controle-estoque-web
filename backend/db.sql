create database mercearia_web;
use mercearia_web;

create table categorias(
    idCategoria int auto_increment primary key,
    nome varchar(30) unique not null
);

create table produtos(
    idProduto int auto_increment primary key,
    nome varchar(100) not null,
    marca varchar(50) not null,
    idCategoria int not null,
    preco decimal(10,2) not null,
    quantidade int not null,
    foreign key (idCategoria) references categorias (idCategoria)
);

create table vendas(
    idVenda int auto_increment primary key,
    data timestamp default current_timestamp,
    valorTotal decimal(10,2) not null
);

create table item_venda(
    idItem int auto_increment primary key,
    idVenda int not null,
    idProduto int not null,
    quantidade int not null,
    preco decimal(10,2) not null,
    foreign key (idVenda) references vendas(idVenda),
    foreign key (idProduto) references produtos(idProduto)
);
INSERT INTO categorias (nome) VALUES
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

INSERT INTO produtos (nome, marca, idCategoria, preco, quantidade) VALUES
('Arroz 5kg', 'Camil', 1, 28.90, 35),
('Feijão Carioca 1kg', 'Kicaldo', 1, 8.99, 42),
('Açúcar 1kg', 'União', 1, 4.79, 30),

('Coca-Cola 2L', 'Coca-Cola', 2, 11.99, 25),
('Guaraná Antarctica 2L', 'Antarctica', 2, 8.99, 20),
('Água Mineral 500ml', 'Crystal', 2, 2.49, 60),

('Leite Integral 1L', 'Italac', 3, 5.49, 40),
('Manteiga 200g', 'Aviação', 3, 12.90, 18),
('Requeijão Cremoso 200g', 'Vigor', 3, 8.49, 22),

('Presunto 200g', 'Sadia', 4, 9.90, 15),
('Queijo Mussarela 200g', 'Itambé', 4, 13.90, 17),

('Linguiça Toscana 1kg', 'Sadia', 5, 19.90, 12),
('Carne Moída 1kg', 'Friboi', 5, 29.90, 10),
('Bife Bovino 1kg', 'Friboi', 5, 39.90, 8),

('Banana Prata 1kg', 'Hortifruti', 6, 6.99, 25),
('Tomate 1kg', 'Hortifruti', 6, 7.49, 20),
('Batata 1kg', 'Hortifruti', 6, 5.99, 30),

('Pão Francês 1kg', 'Produção Própria', 7, 14.90, 15),
('Pão de Forma 500g', 'Wickbold', 7, 9.99, 18),

('Chocolate ao Leite 90g', 'Nestlé', 8, 6.49, 25),
('Brigadeiro 100g', 'Produção Própria', 8, 5.99, 20),

('Biscoito Recheado Chocolate 130g', 'Oreo', 9, 5.99, 30),
('Batata Chips 100g', 'Ruffles', 9, 9.49, 20),

('Macarrão Espaguete 500g', 'Renata', 10, 4.99, 35),
('Milho para Pipoca 500g', 'Yoki', 10, 5.49, 25),

('Milho Verde 170g', 'Quero', 11, 3.99, 25),
('Ervilha 170g', 'Quero', 11, 3.79, 20),

('Molho de Tomate 300g', 'Pomodoro', 12, 3.49, 35),
('Ketchup 400g', 'Heinz', 12, 10.99, 15),
('Sal 1kg', 'Cisne', 12, 2.99, 40),

('Café Torrado e Moído 500g', 'Pilão', 13, 18.90, 30),
('Chá Mate 250g', 'Leão', 13, 7.99, 15),

('Detergente 500ml', 'Ypê', 14, 2.99, 50),
('Água Sanitária 1L', 'Qboa', 14, 5.49, 30),
('Sabão em Pó 1kg', 'Omo', 14, 14.90, 20),

('Sabonete 90g', 'Dove', 15, 4.99, 40),
('Shampoo 350ml', 'Seda', 15, 12.90, 20),
('Creme Dental 90g', 'Colgate', 15, 6.99, 35),

('Fralda Infantil M', 'Pampers', 16, 39.90, 12),
('Lenço Umedecido 48un', 'Huggies', 16, 11.90, 18),

('Ração para Cães 1kg', 'Pedigree', 17, 16.90, 15),
('Ração para Gatos 1kg', 'Whiskas', 17, 18.90, 12),

('Pizza Congelada Calabresa', 'Sadia', 18, 14.90, 15),
('Hambúrguer Bovino 672g', 'Sadia', 18, 19.90, 10),

('Esponja de Limpeza 3un', 'Scotch-Brite', 19, 6.49, 30),
('Saco para Lixo 30L', 'Dona Chefa', 19, 9.90, 20),

('Carvão Vegetal 3kg', 'Carvão Brasil', 20, 15.90, 10),
('Fósforo 10 Caixas', 'Fiat Lux', 20, 4.49, 25);
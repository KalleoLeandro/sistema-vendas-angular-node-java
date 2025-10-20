create database sistema_vendas;
use sistema_vendas;

create table usuarios(
    id int primary key auto_increment,
    nome varchar(255) not null,
    cpf varchar(20) unique not null,
    login varchar(64) not null,
    senha varchar(16) not null,
    perfil varchar(5) not null,
    active boolean not null default true
);

insert into usuarios(nome, cpf, login, senha, perfil) values('Master User', '222.333.444-05', 'admin', 'admin', 1);

create table produtos(
    id int primary key auto_increment,
    nome varchar(255) not null,
    preco_custo decimal(6,2) not null,
    preco_venda decimal(6,2) not null,
    quantidade int not null,
    medida int not null,
    categoria int not null
);
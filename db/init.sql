create database sistema_vendas;
use sistema_vendas;

create table usuarios(
    id int primary key auto_increment,
    nome varchar(255) not null,
    login varchar(64) not null,
    senha varchar(16) not null
    perfil int not null
);
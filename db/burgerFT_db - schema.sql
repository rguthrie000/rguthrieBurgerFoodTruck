drop database if exists burgerFT_db;
create database burgerFT_db;
use burgerFT_db;

create table orders
(
	order_id int not null auto_increment primary key,
	menuItem varchar(50) not null,
	served boolean default false
);
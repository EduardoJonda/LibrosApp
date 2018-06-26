create table personaje(
	personaje_id int not null auto_increment primary key,
	nombre varchar(100),
	apellido varchar(100),
	biografia varchar(200),
	created_at datetime
);
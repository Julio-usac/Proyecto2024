use dbinventario;


#Roles
insert into rol(rol,activo) values ("Administrador", True);
insert into rol(rol,activo) values ("Operador", True);
insert into rol(rol,activo) values ("Consultor", True);

#Estados

insert into estado(estado,activo) values ("Activo", True);
insert into estado(estado,activo) values ("Inactivo", True);
insert into estado(estado,activo) values ("Eliminado", True);

#categoria
insert into categoria(nombre,activo) values ("Activo",True);
insert into categoria(nombre,activo) values ("Fungible",True);

#Usuarios
insert into usuario (fecha_mod,nombres,apellidos,correo,pass,estado,rol) 
values (NOW(),"Cesar","Chavez","c1","123",1,1);

insert into usuario (fecha_mod,nombres,apellidos,correo,pass,estado,rol) 
values (NOW(),"Hugo","Sanchez","c2","123",1,1);

insert into usuario (fecha_mod,nombres,apellidos,correo,pass,estado,rol) 
values (NOW(),"Victor","Herrera","c3","123",1,1);

insert into usuario (fecha_mod,nombres,apellidos,correo,pass,estado,rol) 
values (NOW(),"John","Doe","c4","123",2,1);

#Tipo de movimientos

insert into tipo_movimiento(tipo,activo) values ("Creacion", True);
insert into tipo_movimiento(tipo,activo) values ("Edicion", True);
insert into tipo_movimiento(tipo,activo) values ("Eliminacion", True);
insert into tipo_movimiento(tipo,activo) values ("Asignacion de Tarjeta", True);



Load Data Infile 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/eps/ubicacion.csv'
into table ubicacion
character set utf8mb4
fields terminated by ','
lines terminated by '\n'
ignore 1 lines
(id,nombre,activo);

Load Data Infile 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/eps/marcas.csv'
into table marca
character set utf8mb4
fields terminated by ','
lines terminated by '\n'
(nombre,activo);

Load Data Infile 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/eps/bienes.csv'
into table tbien
character set utf8mb4
fields terminated by ','
OPTIONALLY ENCLOSED BY '\"'
lines terminated by '\n'
(codigo,marca,modelo,serie,descripcion,activo,cantidad,categoria);

INSERT INTO bien (codigo,marca,modelo,serie,descripcion,activo,cantidad,categoria)
SELECT codigo,marca.marcaId,modelo,serie,descripcion,tbien.activo,cantidad,categoria FROM tbien
LEFT JOIN marca on marca.nombre=tbien.marca;



select * from bien;


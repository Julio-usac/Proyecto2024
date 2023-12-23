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
values (NOW(),"Cesar","Chavez","c1","A665A45920422F9D417E4867EFDC4FB8A04A1F3FFF1FA07E998E86F7F7A27AE3",1,1);

insert into usuario (fecha_mod,nombres,apellidos,correo,pass,estado,rol) 
values (NOW(),"Hugo","Sanchez","c2","A665A45920422F9D417E4867EFDC4FB8A04A1F3FFF1FA07E998E86F7F7A27AE3",1,1);

insert into usuario (fecha_mod,nombres,apellidos,correo,pass,estado,rol) 
values (NOW(),"Victor","Herrera","c3","A665A45920422F9D417E4867EFDC4FB8A04A1F3FFF1FA07E998E86F7F7A27AE3",1,1);

insert into usuario (fecha_mod,nombres,apellidos,correo,pass,estado,rol) 
values (NOW(),"John","Doe","c4","A665A45920422F9D417E4867EFDC4FB8A04A1F3FFF1FA07E998E86F7F7A27AE3",2,1);

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




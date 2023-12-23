CREATE DATABASE dbinventario;
use dbinventario;

CREATE TABLE rol(
 rolId INT AUTO_INCREMENT PRIMARY KEY,
 fecha_mod DATETIME,
 rol VARCHAR(50) NOT NULL,
 activo BOOL NOT NULL
);

CREATE TABLE estado(
 estadoId INT AUTO_INCREMENT PRIMARY KEY,
 fecha_mod DATETIME,
 estado VARCHAR(50) NOT NULL,
 activo BOOL NOT NULL
);

CREATE TABLE usuario(
 userId INT AUTO_INCREMENT PRIMARY KEY,
 fecha_mod DATETIME,
 nombres VARCHAR(50) NOT NULL,
 apellidos VARCHAR(50) NOT NULL,
 correo VARCHAR(50) NOT NULL,
 pass VARCHAR(300),
 rol INT NOT NULL,
 estado INT NOT NULL,
 FOREIGN KEY (rol) REFERENCES rol(rolId),
 FOREIGN KEY (estado) REFERENCES estado(estadoId)
);

CREATE TABLE categoria(
 catId INT AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(100) NOT NULL,
 activo BOOL NOT NULL,
 fecha_mod DATETIME
);

CREATE TABLE tarjeta_responsabilidad(
 id INT AUTO_INCREMENT PRIMARY KEY,
 numero_tarjeta INT NOT NULL,
 saldo DECIMAL(8,2),
 usuario INT NOT NULL,
 categoria INT NOT NULL,
 FOREIGN KEY (categoria) REFERENCES categoria(catId),
 FOREIGN KEY (usuario) REFERENCES usuario(userId)
);

CREATE TABLE marca(
 marcaId INT AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(100) NOT NULL,
 activo BOOL NOT NULL,
 fecha_mod DATETIME
);

CREATE TABLE ubicacion(
 id INT AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(100) NOT NULL,
 activo BOOL NOT NULL,
 fecha_mod DATETIME
);

CREATE TABLE bien(
 id INT AUTO_INCREMENT PRIMARY KEY,
 fecha_mod DATETIME,
 fechaco DATE,
 cuenta varchar(10),
 codigo VARCHAR(50),
 marca INT,
 cantidad INT NOT NULL,
 modelo VARCHAR(75),
 serie VARCHAR(75),
 imagen MEDIUMTEXT,
 precio DECIMAL(8,2),
 activo BOOL NOT NULL,
 descripcion VARCHAR(600) NOT NULL,
 categoria INT NOT NULL,
 tarjeta INT,
 ubicacion INT,
 FOREIGN KEY (categoria) REFERENCES categoria(catId),
 FOREIGN KEY (marca) REFERENCES marca(marcaId),
 FOREIGN KEY (tarjeta) REFERENCES tarjeta_responsabilidad(id),
 FOREIGN KEY (ubicacion) REFERENCES ubicacion(id)
);

CREATE TABLE tipo_movimiento(
 id INT AUTO_INCREMENT PRIMARY KEY,
 tipo VARCHAR(100) NOT NULL,
 activo BOOL NOT NULL,
 fecha_mod DATETIME
);

CREATE TABLE movimiento_bien(
 id INT AUTO_INCREMENT PRIMARY KEY,
 fecha DATETIME,
 usuario INT NOT NULL,
 usuario_afectado INT,
 bien_afectado INT,
 tipo_movimiento INT NOT NULL,
 afectado BOOL,
 FOREIGN KEY (tipo_movimiento) REFERENCES tipo_movimiento(id),
 FOREIGN KEY (bien_afectado) REFERENCES bien(id),
 FOREIGN KEY (usuario) REFERENCES usuario(userId),
 FOREIGN KEY (usuario_afectado) REFERENCES usuario(userId)
);

CREATE TABLE responsable_activo(
 id INT AUTO_INCREMENT PRIMARY KEY,
 fecha DATETIME,
 tarjeta INT NOT NULL,
 bien  INT NOT NULL,
 activo BOOL,
 FOREIGN KEY (bien) REFERENCES bien(id),
 FOREIGN KEY (tarjeta) REFERENCES tarjeta_responsabilidad(id)
);

CREATE TABLE ubicacion_activo(
 id INT AUTO_INCREMENT PRIMARY KEY,
 fecha DATETIME,
 bien INT,
 ubicacion INT,
 FOREIGN KEY (bien) REFERENCES bien(id),
 FOREIGN KEY (ubicacion) REFERENCES ubicacion(id)
);


#------------------------------temporales--------------------------------

CREATE TABLE tbien(
 id INT AUTO_INCREMENT PRIMARY KEY,
 codigo VARCHAR(50),
 marca VARCHAR(50),
 modelo VARCHAR(75),
 serie VARCHAR(75),
 descripcion VARCHAR(600) NOT NULL,
 cantidad INT,
 categoria INT,
 ubicacion INT,
 activo BOOL NOT NULL,
 FOREIGN KEY (ubicacion) REFERENCES ubicacion(id)
);



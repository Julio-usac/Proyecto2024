var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var mysql = require('mysql');
var config = require('../database/config.js');


function encriptar(texto) {
    const hash = crypto.createHash('sha256');
    hash.update(texto);
  
    return hash.digest('hex');
}

function getToken(datos) {
    return jwt.sign(datos, process.env.JWT_CODE, {expiresIn : '60m'});
}

var connection = mysql.createConnection(config.dbconnection);


//------------------------------Funcion para comunicacion con la base de datos-----------------------
function query(sql) {
  return new Promise((resolve, reject) => {
      connection.query(sql, function(error, result) {
          if (error) {
              reject(error);
          } else {
              resolve(result);
          }
      });
  });
}

//------------------------------------- INGRESAR BIENES--------------------------------------
exports.crear = async (req, res, next) => {

  //inicializar variables

  let fcompra="";
  let ingresar=true;
  //Obtener datos
  
  let fechaco = req.body.fechaco;
  let cuenta = req.body.cuenta;
  let codigo = req.body.codigo;
  let marca = req.body.marca;
  let cantidad = req.body.cantidad;
  let modelo = req.body.modelo;
  let serie = req.body.serie;
  let imagen = req.body.imagen;
  let precio = req.body.precio;
  let descripcion = req.body.descripcion;
  let categoria = req.body.categoria;
  let tarjeta = req.body.tarjeta;
  let ubicacion = req.body.ubicacion;

  //Convertir fecha de compra
  if (fechaco){
    fcompra= `STR_TO_DATE(DATE_FORMAT("`+fechaco+`", "%d/%m/%Y"),"%d/%m/%Y")`;
  }else{
    fcompra= null;
  }

  //Convertir cuenta

  if (cuenta){
    cuenta=`'`+cuenta+`'`;
  }else{
    cuenta= null;
  }

  //Convertir codigo

  if (codigo){
    codigo=`'`+codigo+`'`;
  }else{
    codigo= null;
  }

  //Convertir modelo

  if (modelo){
    modelo=`'`+modelo+`'`;
  }else{
    modelo= null;
  }

  //Convertir serie

  if (serie){
    serie=`'`+serie+`'`;
  }else{
    serie= null;
  }

  //Convertir imagen

  if (imagen){
    imagen=`'`+imagen+`'`;
  }else{
    imagen= null;
  }

  //Convertir ubicacion

  if (ubicacion && ubicacion!="Seleccionar"){
    ubicacion=`'`+ubicacion+`'`;
  }else{
    ubicacion= null;
  }

  //Convertir precio


  if (precio){
    precio=`'`+precio+`'`;
  }else{
    precio= null;
  }


  //Verificar Marca
  let idmarca=null;
  try{
      
    if (marca!=''){
      marca = marca.toUpperCase();
      let sql =`SELECT marcaId FROM marca WHERE nombre="`+marca+`";`;
      const result = await query(sql);
      
      if (result.length > 0) {
        
        idmarca=result[0].marcaId;

      } else {
        let sql =`INSERT INTO marca(fecha_mod,nombre,activo) 
        VALUES (NOW(),"`+marca+`",activo);`;
        const result1 = await query(sql);

        sql =`SELECT marcaId FROM marca WHERE nombre="`+marca+`";`;
        const result2 = await query(sql);

        idmarca=result2[0].marcaId;
      
      }
    }
  }catch (error) {
      console.log(error);
      res.status(400).json({success: false, message: "No se pudo conectar con la base de datos"});
      return;
  }


  //Ingresar bien a la base de datos  
  try{
    
      if (ingresar==true){

        let sql =  `INSERT INTO bien(fecha_mod,fechaco,cuenta,codigo,marca,cantidad,modelo,serie,imagen,precio,activo,descripcion,categoria,tarjeta,ubicacion)
        VALUES(NOW(),`+fcompra+`,`+cuenta+`,`+codigo+`,`+idmarca+`,`+cantidad+`,
        `+modelo+`,`+serie+`,`+imagen+`,`+precio+`,True,"`+descripcion+`",`+categoria+`,`+tarjeta+`,`+ubicacion+`);`;
        
        await query(sql);

        res.json({success: true, message: "Bien ingresado"});
        return;
      }else{
        res.status(400).json({success: false, message: "Error al ingresar"});
      }
  }catch (error) {
      console.log(error);
      res.status(400).json({success: false, message: "Error al ingresar los datos"});
  }
};


//------------------------------------------EDITAR BIENES----------------------------------


exports.editar = async (req, res, next) => {

  //fecha actual
  const fecha = new Date();
  const añoActual = fecha.getFullYear();
  const hoy = fecha.getDate();
  const mes = fecha.getMonth() + 1; 
  let fechaActual= hoy+"/"+mes+"/"+ añoActual

  let id = req.body.id;
  let fechaco = req.body.fechaco;
  let cuenta = req.body.cuenta;
  let codigo = req.body.codigo;
  let marca = req.body.marca;
  let cantidad = req.body.cantidad;
  let modelo = req.body.modelo;
  let serie = req.body.serie;
  let imagen = req.body.imagen;
  let precio = req.body.precio;
  let descripcion = req.body.descripcion;
  let categoria = req.body.categoria;
  let ubicacion = req.body.ubicacion;


  //Convertir fecha de compra

  if (fechaco!=null && fechaco!="No ingresado"){
    if(fechaco.includes('-')){
      fcompra= `STR_TO_DATE(DATE_FORMAT("`+fechaco+`", "%d/%m/%Y"),"%d/%m/%Y")`;
    }else{
      
      fcompra= `STR_TO_DATE("`+fechaco+`", "%d/%m/%Y")`;
    }
  }else{
    fcompra= null;
  }
  //Conversiones

  cuenta=(cuenta)?`'`+cuenta+`'`: null
  codigo=(codigo)?`'`+codigo+`'`: null
  modelo=(modelo)?`'`+modelo+`'`: null
  serie=(serie)?`'`+serie+`'`: null
  imagen=(imagen)?`'`+imagen+`'`: null

  let idmarca=null;
  try{
      
    if (marca!='' && marca!=null){
      marca = marca.toUpperCase();
      let sql =`SELECT marcaId FROM marca WHERE nombre="`+marca+`";`;
      const result = await query(sql);
      
      if (result.length > 0) {
        
        idmarca=result[0].marcaId;

      } else {
        let sql =`INSERT INTO marca(fecha_mod,nombre,activo) 
        VALUES (NOW(),"`+marca+`",activo);`;
        const result1 = await query(sql);

        sql =`SELECT marcaId FROM marca WHERE nombre="`+marca+`";`;
        const result2 = await query(sql);

        idmarca=result2[0].marcaId;
      
      }
    }
  }catch (error) {
      console.log(error);
      res.status(400).json({success: false, message: "No se pudo conectar con la base de datos",error:error});
      return;
  }

  try{
    let sql =  `UPDATE bien SET fechaco =`+fcompra+`, cuenta = `+cuenta+`, codigo=`+codigo+`, marca = `+idmarca+`,
    cantidad = `+cantidad+`, modelo = `+modelo+`, serie = `+serie+`, imagen = `+imagen+`, precio = `+precio+`, descripcion = "`+descripcion+`",
    categoria = `+categoria+`, ubicacion = `+ubicacion+`   WHERE id =`+id+`;`;
    await query(sql);

    res.json({success: true, message: "Edicion exitosa"});
    return;
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error al editar",error:error});
    return;
  }
};

//------------------------------------- DAR DE BAJA UN BIEN --------------------------------------


exports.baja = async (req, res, next) => {

  try{
    let sql =  `UPDATE bien SET activo = false WHERE id =`+req.params.id+`;`;
    const result = await query(sql);
    res.json({success: true, message: "Bien dado de baja satisfactoriamente"});
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "No fue posible dar de baja el bien", error: error});
    return;
  }
};

//------------------------------------- RESTAURAR BIEN --------------------------------------

exports.restaurar = async (req, res, next) => {

  try{
    let sql =  `UPDATE bien SET activo = true WHERE id =`+req.params.id+`;`;
    await query(sql);
    res.json({success: true, message: "Bien restaurado satisfactoriamente"});
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "No fue posible restaurar el producto"});
    return;
  }

};

//------------------------------------Endpoint para Buscar bienes----------------------------------

exports.buscar = async (req, res, next) => {

  
  //Extraer datos

  let buscar = req.query.buscar;
  let opcion = req.query.opcion;
  let sql=""
  switch (opcion) {
    case  "1":

      sql = `SELECT empleado.nit, bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,codigo,marca.nombre as marca,modelo,serie,cantidad,bien.categoria,imagen,bien.ubicacion as ubicacion2,descripcion,ubicacion.nombre as ubicacion,bien.precio FROM bien
      LEFT JOIN ubicacion ON bien.ubicacion = ubicacion.id
      LEFT JOIN marca ON marca.marcaId=bien.marca 
      LEFT JOIN tarjeta_responsabilidad t ON t.id=bien.tarjeta
      LEFT JOIN empleado ON t.empleado=empleado.empleadoId
      WHERE bien.activo=True and codigo LIKE '%`+buscar+`%';`;
     
      try{
       
        const result = await query(sql);
        
        res.json({success: true, message: result});
      }catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: error});
        return;
      }
      break;
    case "2":
      buscar=buscar.toUpperCase()
      sql = `SELECT empleado.nit,bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,codigo,marca.nombre as marca,modelo,serie,cantidad,bien.categoria,imagen,bien.ubicacion as ubicacion2,descripcion,ubicacion.nombre as ubicacion,bien.precio FROM bien
      LEFT JOIN ubicacion ON bien.ubicacion = ubicacion.id
      LEFT JOIN marca ON marca.marcaId=bien.marca 
      LEFT JOIN tarjeta_responsabilidad t ON t.id=bien.tarjeta
      LEFT JOIN empleado ON t.empleado=empleado.empleadoId
      WHERE bien.activo=True and marca.nombre LIKE '%`+buscar+`%';`;

      try{
       
        const result = await query(sql);
        
        res.json({success: true, message: result});
      }catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: error});
        return;
      }
      break;
    case "3":
      sql = `SELECT empleado.nit,bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,codigo,marca.nombre as marca,modelo,serie,cantidad,bien.categoria,imagen,bien.ubicacion as ubicacion2,descripcion,ubicacion.nombre as ubicacion,bien.precio FROM bien
      LEFT JOIN ubicacion ON bien.ubicacion = ubicacion.id
      LEFT JOIN marca ON marca.marcaId=bien.marca 
      LEFT JOIN tarjeta_responsabilidad t ON t.id=bien.tarjeta
      LEFT JOIN empleado ON t.empleado=empleado.empleadoId
      WHERE bien.activo=True and modelo LIKE '%`+buscar+`%';`;
      try{
       
        const result = await query(sql);
        
        res.json({success: true, message: result});
      }catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: error});
        return;
      }
      break;
    case "4":
      sql = `SELECT empleado.nit,bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,codigo,marca.nombre as marca,modelo,serie,cantidad,bien.categoria,imagen,bien.ubicacion as ubicacion2,descripcion,ubicacion.nombre as ubicacion,bien.precio FROM bien
      LEFT JOIN ubicacion ON bien.ubicacion = ubicacion.id
      LEFT JOIN marca ON marca.marcaId=bien.marca 
      LEFT JOIN tarjeta_responsabilidad t ON t.id=bien.tarjeta
      LEFT JOIN empleado ON t.empleado=empleado.empleadoId
      WHERE bien.activo=True and serie LIKE '%`+buscar+`%';`;
      try{
       
        const result = await query(sql);
        
        res.json({success: true, message: result});
      }catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: error});
        return;
      }
      break;
      case "6":
        sql = `SELECT empleado.nit,bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,codigo,marca.nombre as marca,modelo,serie,cantidad,bien.categoria,imagen,bien.ubicacion as ubicacion2,descripcion,ubicacion.nombre as ubicacion,bien.precio FROM bien
        LEFT JOIN ubicacion ON bien.ubicacion = ubicacion.id
        LEFT JOIN marca ON marca.marcaId=bien.marca 
        LEFT JOIN tarjeta_responsabilidad t ON t.id=bien.tarjeta
        LEFT JOIN empleado ON t.empleado=empleado.empleadoId
        WHERE bien.activo=True and ubicacion.nombre LIKE '%`+buscar+`%';`;
      
        try{
         
          const result = await query(sql);
          
          res.json({success: true, message: result});
        }catch (error) {
          console.log(error);
          res.status(400).json({success: false, message: error});
          return;
        }
        break;
      default:
        sql = `SELECT empleado.nit,bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,codigo,marca.nombre as marca,modelo,serie,cantidad,bien.categoria,imagen,bien.ubicacion as ubicacion2,descripcion,ubicacion.nombre as ubicacion,bien.precio FROM bien
        LEFT JOIN ubicacion ON bien.ubicacion = ubicacion.id
        LEFT JOIN marca ON marca.marcaId=bien.marca 
        LEFT JOIN tarjeta_responsabilidad t ON t.id=bien.tarjeta
        LEFT JOIN empleado ON t.empleado=empleado.empleadoId
        WHERE bien.activo=True and descripcion LIKE '%`+buscar+`%';`;
      
        try{
          
          const result = await query(sql);
          
          res.json({success: true, message: result});
        }catch (error) {
          console.log(error);
          res.status(400).json({success: false, message: error});
          return;
        }
        break;
  }

};

//------------------------------------- RETORNAR BIENES DADOS DE BAJA --------------------------------------


exports.buscarbaja = async (req, res, next) => {

  //Extraer datos

  let buscar = req.query.buscar;
  let opcion = req.query.opcion;
  
  let sql=""
  switch (opcion) {
    case  "1":

      sql = `SELECT * FROM(
        SELECT bien.id, DATE_FORMAT(r.fecha, '%d/%m/%Y') AS fecha,concat_ws(' ', u.nombres,u.apellidos) AS usuario,codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(bien.precio,"No ingresado") AS precio FROM responsable_activo r
            INNER JOIN tarjeta_responsabilidad t ON r.tarjeta = t.id
            INNER JOIN bien ON bien.id = r.bien
            INNER JOIN empleado u ON u.empleadoId = t.empleado
            LEFT JOIN marca ON bien.marca = marca.marcaId
            WHERE r.fecha IN (SELECT max(r.fecha) FROM responsable_activo r
            WHERE r.activo=0 and bien.activo=0
            GROUP BY r.bien)
        UNION
        SELECT bien.id,"Sin empleado","Sin empleado",codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(precio,"No ingresado") AS precio FROM bien
        LEFT JOIN marca ON bien.marca = marca.marcaId
        WHERE bien.activo=0 AND bien.id NOT IN (SELECT r.bien FROM responsable_activo r
            WHERE r.activo=0)) grupo
      WHERE codigo LIKE '%`+buscar+`%';`;
     
      try{
       
        const result = await query(sql);
        
        res.json({success: true, message: result});
      }catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: error});
        return;
      }
      break;
    case "2":
      buscar=buscar.toUpperCase()
      sql = `SELECT * FROM(
        SELECT bien.id, DATE_FORMAT(r.fecha, '%d/%m/%Y') AS fecha,concat_ws(' ', u.nombres,u.apellidos) AS usuario,codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(bien.precio,"No ingresado") AS precio FROM responsable_activo r
            INNER JOIN tarjeta_responsabilidad t ON r.tarjeta = t.id
            INNER JOIN bien ON bien.id = r.bien
            INNER JOIN empleado u ON u.empleadoId = t.empleado
            LEFT JOIN marca ON bien.marca = marca.marcaId
            WHERE r.fecha IN (SELECT max(r.fecha) FROM responsable_activo r
            WHERE r.activo=0 and bien.activo=0
            GROUP BY r.bien)
        UNION
        SELECT bien.id,"Sin empleado","Sin empleado",codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(precio,"No ingresado") AS precio FROM bien
        LEFT JOIN marca ON bien.marca = marca.marcaId
        WHERE bien.activo=0 AND bien.id NOT IN (SELECT r.bien FROM responsable_activo r
            WHERE r.activo=0)) grupo
      WHERE marca LIKE '%`+buscar+`%';`;

      try{
       
        const result = await query(sql);
        
        res.json({success: true, message: result});
      }catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: error});
        return;
      }
      break;
    case "3":
      sql = `SELECT * FROM(
        SELECT bien.id, DATE_FORMAT(r.fecha, '%d/%m/%Y') AS fecha,concat_ws(' ', u.nombres,u.apellidos) AS usuario,codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(bien.precio,"No ingresado") AS precio FROM responsable_activo r
            INNER JOIN tarjeta_responsabilidad t ON r.tarjeta = t.id
            INNER JOIN bien ON bien.id = r.bien
            INNER JOIN empleado u ON u.empleadoId = t.empleado
            LEFT JOIN marca ON bien.marca = marca.marcaId
            WHERE r.fecha IN (SELECT max(r.fecha) FROM responsable_activo r
            WHERE r.activo=0 and bien.activo=0
            GROUP BY r.bien)
        UNION
        SELECT bien.id,"Sin empleado","Sin Empleado",codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(precio,"No ingresado") AS precio FROM bien
        LEFT JOIN marca ON bien.marca = marca.marcaId
        WHERE bien.activo=0 AND bien.id NOT IN (SELECT r.bien FROM responsable_activo r
            WHERE r.activo=0)) grupo
      WHERE  modelo LIKE '%`+buscar+`%';`;
      try{
       
        const result = await query(sql);
        
        res.json({success: true, message: result});
      }catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: error});
        return;
      }
      break;
    case "4":
      sql = `SELECT * FROM(
        SELECT bien.id, DATE_FORMAT(r.fecha, '%d/%m/%Y') AS fecha,concat_ws(' ', u.nombres,u.apellidos) AS usuario,codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(bien.precio,"No ingresado") AS precio FROM responsable_activo r
            INNER JOIN tarjeta_responsabilidad t ON r.tarjeta = t.id
            INNER JOIN bien ON bien.id = r.bien
            INNER JOIN empleado u ON u.empleadoId = t.empleado
            LEFT JOIN marca ON bien.marca = marca.marcaId
            WHERE r.fecha IN (SELECT max(r.fecha) FROM responsable_activo r
            WHERE r.activo=0 and bien.activo=0
            GROUP BY r.bien)
        UNION
        SELECT bien.id,"Sin empleado","Sin empleado",codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(precio,"No ingresado") AS precio FROM bien
        LEFT JOIN marca ON bien.marca = marca.marcaId
        WHERE bien.activo=0 AND bien.id NOT IN (SELECT r.bien FROM responsable_activo r
            WHERE r.activo=0)) grupo
      WHERE serie LIKE '%`+buscar+`%';`;
      try{
       
        const result = await query(sql);
        
        res.json({success: true, message: result});
      }catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: error});
        return;
      }
      break;
    case "5":
      sql = `SELECT * FROM(
        SELECT bien.id, DATE_FORMAT(r.fecha, '%d/%m/%Y') AS fecha,concat_ws(' ', u.nombres,u.apellidos) AS usuario,codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(bien.precio,"No ingresado") AS precio FROM responsable_activo r
            INNER JOIN tarjeta_responsabilidad t ON r.tarjeta = t.id
            INNER JOIN bien ON bien.id = r.bien
            INNER JOIN empleado u ON u.empleadoId = t.empleado
            LEFT JOIN marca ON bien.marca = marca.marcaId
            WHERE r.fecha IN (SELECT max(r.fecha) FROM responsable_activo r
            WHERE r.activo=0 and bien.activo=0
            GROUP BY r.bien)
        UNION
        SELECT bien.id,"Sin empleado","Sin empleado",codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(precio,"No ingresado") AS precio FROM bien
        LEFT JOIN marca ON bien.marca = marca.marcaId
        WHERE bien.activo=0 AND bien.id NOT IN (SELECT r.bien FROM responsable_activo r
            WHERE r.activo=0)) grupo
      WHERE descripcion LIKE '%`+buscar+`%';`;
    
      try{
       
        const result = await query(sql);
        
        res.json({success: true, message: result});
      }catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: error});
        return;
      }
      break;
  }

};
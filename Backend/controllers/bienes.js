var mysql = require('mysql');
var config = require('../database/config.js');


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
    fcompra= `STR_TO_DATE("`+fechaco+`","%Y-%m-%d")`;
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
      fcompra= `STR_TO_DATE("`+fechaco+`","%Y-%m-%d")`;
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
    await query(sql);
    sql =  `UPDATE bien SET fecha_mod = NOW() WHERE id =`+req.params.id+`;`;
    await query(sql);
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



//------------------------------------- RETORNAR IMAGEN --------------------------------------

exports.imagen = async (req, res, next) => {
  
  try{
    let sql =  `SELECT imagen FROM bien WHERE id=`+req.params.id+`;`;
    
    const result=await query(sql);
    if (result.length==0){
      res.json({success: false});
      return;
    }
    res.json({success: true, imagen: result[0].imagen});
    
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "No fue posible retornar la imagen"});
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

      sql = `SELECT empleado.nit, bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,codigo,marca.nombre as marca,modelo,serie,cantidad,bien.categoria,bien.ubicacion as ubicacion2,descripcion,ubicacion.nombre as ubicacion,bien.precio FROM bien
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
      sql = `SELECT empleado.nit,bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,codigo,marca.nombre as marca,modelo,serie,cantidad,bien.categoria,bien.ubicacion as ubicacion2,descripcion,ubicacion.nombre as ubicacion,bien.precio FROM bien
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
      sql = `SELECT empleado.nit,bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,codigo,marca.nombre as marca,modelo,serie,cantidad,bien.categoria,bien.ubicacion as ubicacion2,descripcion,ubicacion.nombre as ubicacion,bien.precio FROM bien
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
      sql = `SELECT empleado.nit,bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,codigo,marca.nombre as marca,modelo,serie,cantidad,bien.categoria,bien.ubicacion as ubicacion2,descripcion,ubicacion.nombre as ubicacion,bien.precio FROM bien
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
        sql = `SELECT empleado.nit,bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,codigo,marca.nombre as marca,modelo,serie,cantidad,bien.categoria,bien.ubicacion as ubicacion2,descripcion,ubicacion.nombre as ubicacion,bien.precio FROM bien
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
        sql = `SELECT empleado.nit,bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,codigo,marca.nombre as marca,modelo,serie,cantidad,bien.categoria,bien.ubicacion as ubicacion2,descripcion,ubicacion.nombre as ubicacion,bien.precio FROM bien
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


//------------------------------------- ASIGNAR BIENES --------------------------------------

exports.asignar = async (req, res, next) => {

  //Obtener datos

  let op = req.body.op;
  let tarjeta = req.body.tarjeta;
  let categoria = req.body.categoria;
  let empleado = req.body.empleado;
  let saldo = req.body.saldo;
  let asignar = req.body.asignar;
  let quitar = req.body.quitar;



  //Asignar nueva tarjeta
  if(op==true){
  //Crear tarjeta de responsabilidad
    try{
      //Verificar numero de tarjeta
      let sql =  `SELECT numero_tarjeta from tarjeta_responsabilidad
      WHERE numero_tarjeta=`+tarjeta+`;`;

      const result1 = await query(sql);

      if (result1.length==0){
      //Crear tarjeta
        sql =  `INSERT INTO tarjeta_responsabilidad(numero_tarjeta,saldo,empleado,categoria)
        VALUES(`+tarjeta+`,`+saldo+`,`+empleado+`,`+categoria+`);`;
          
        const result2 = await query(sql);
      }else{
        res.json({success: false, message: "Numero de tarjeta repetido"});
        return;
      }
    
    }catch (error) {
      console.log(error);
      res.status(400).json({success: false, message: "Error al crear la tarjeta"});
      return;
    }

    //Registrar bienes desasignados
    
    if (quitar.length>0){  //Verificar si hay bienes para desasignar
      
      try{
        //recuperar id de la tarjeta
        let sql =  `SELECT max(id) as tarjeta FROM tarjeta_responsabilidad;`;
        const result2 = await query(sql);

        let idtarjeta = result2[0].tarjeta;
        
        //Quitar referencia de la tarjeta a la tabla bienes

        for (var i = 0; i < quitar.length; i++) {
          let sql =  `UPDATE bien SET tarjeta = NULL WHERE id =`+quitar[i]+`;`;
          const result3 = await query(sql);
        }
        
        //Registrar bienes desasignados

        for (var i = 0; i < quitar.length; i++) {
          let sql =  `INSERT INTO responsable_activo(fecha,tarjeta,bien,activo)
          VALUES(NOW(),`+idtarjeta+`,`+quitar[i]+`,False);`;
          const result4 = await query(sql);
        }
        

      }catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: "Error al desasignar bienes a la tarjeta"});
        return;
      }
    }
  //asignar bienes la tarjeta
    if (asignar.length>0){ //Verificar si hay bienes por asignar
      try{
        //recuperar id de la tarjeta
        let sql =  `SELECT max(id) as tarjeta FROM tarjeta_responsabilidad;`;
        const result2 = await query(sql);

        let idtarjeta = result2[0].tarjeta;

        //Agregar referencia de la tarjeta a la tabla bienes

        for (var i = 0; i < asignar.length; i++) {
          let sql =  `UPDATE bien SET tarjeta =`+idtarjeta+`  WHERE id =`+asignar[i]+`;`;
          const result3 = await query(sql);
        }
        
        //asignar bienes
        
          for (var i = 0; i < asignar.length; i++) {
            let sql =  `INSERT INTO responsable_activo(fecha,tarjeta,bien,activo)
            VALUES(NOW(),`+idtarjeta+`,`+asignar[i]+`,True);`;
            const result4 = await query(sql);
          }
          
        
      }catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: "Error al asignar bienes a la tarjeta"});
        return;
      }
    }
  }else{

    //ACTUALIZAR TARJETA

    //Actualizar datos de la tarjeta
    let tarjetaid=0;
    try{
      //Verificar existencia de numero de tarjeta
      let sql =  `SELECT id from tarjeta_responsabilidad
      WHERE numero_tarjeta=`+tarjeta+` and empleado=`+empleado+`;`;

      const result1 = await query(sql);

      if (result1.length==1){

        tarjetaid= result1[0].id;
        let sql =  `UPDATE tarjeta_responsabilidad SET saldo = `+saldo+` WHERE numero_tarjeta =`+tarjeta+`;`;
        const result2 = await query(sql);

      }else{
        res.status(400).json({success: false, message: "La tarjeta no esta asociada a ese usuario o no existe"});
        return;
      }
    
    }catch (error) {
      console.log(error);
      res.status(400).json({success: false, message: "Error al verificar tarjeta"});
      return;
    }

    
    //Registrar bienes desasignados
    
    if (quitar.length>0){  //Verificar si hay bienes para desasignar
      
      try{
        
        //Quitar referencia de la tarjeta a la tabla bienes

        for (var i = 0; i < quitar.length; i++) {
          let sql =  `UPDATE bien SET tarjeta = NULL WHERE id =`+quitar[i]+`;`;
          const result3 = await query(sql);
        }

        //Registrar bienes desasignados

        for (var i = 0; i < quitar.length; i++) {
          let sql =  `INSERT INTO responsable_activo(fecha,tarjeta,bien,activo)
          VALUES(NOW(),`+tarjetaid+`,`+quitar[i]+`,False);`;
          const result4 = await query(sql);
        }
        

      }catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: "Error al desasignar bienes a la tarjeta"});
        return;
      }
    }

    if (asignar.length>0){ //Verificar si hay bienes por asignar
      try{
        //Agregar referencia de la tarjeta a la tabla bienes

        for (var i = 0; i < asignar.length; i++) {
          let sql =   `UPDATE bien SET tarjeta =`+tarjetaid+`  WHERE id =`+asignar[i]+`;`;
          const result3 = await query(sql);
        }
        
        //asignar bienes
        
          for (var i = 0; i < asignar.length; i++) {
            let sql =  `INSERT INTO responsable_activo(fecha,tarjeta,bien,activo)
            VALUES(NOW(),`+tarjetaid+`,`+asignar[i]+`,True);`;
            const result4 = await query(sql);
          }
          
        
      }catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: "Error al asignar bienes a la tarjeta"});
        return;
      }
    }

  }

  res.json({success: true, message: "Operacion exitosa"});
  return;


};

//------------------------------------- OBTENER BIENES SIN ASIGNAR--------------------------------------


exports.sinasignar = async (req, res, next) => {
  try{
    
    let sql = `SELECT bien.id,fechaco,codigo,marca.nombre as marca,modelo,serie,descripcion,bien.precio FROM bien
    LEFT JOIN marca ON bien.marca = marca.marcaId
    WHERE bien.tarjeta IS NULL and bien.activo=true;`;
    
    const result = await query(sql);
    
    res.json({success: true, message: result});
    return;
  }catch (error) {
    console.log(error);
    res.json({success: false, message: "Error al obtener los bienes"});
    return;
  }
};

//------------------------------------- OBTENER BIENES ASIGNADOS (TARJETA DE RESPONSABILIDAD)--------------------------------------


exports.asignado = async (req, res, next) => {
  try{
    let empleado= req.body.empleado;
    let sql = `SELECT bien.id ,codigo, marca.nombre as marca, descripcion,precio FROM bien
    LEFT JOIN marca ON marca.marcaId=bien.marca 
    INNER JOIN tarjeta_responsabilidad ON tarjeta_responsabilidad.id= bien.tarjeta
    WHERE tarjeta_responsabilidad.empleado = `+empleado+` ;`;
    
    const result = await query(sql);
    
    res.json({success: true, message: result});
    return;
  }catch (error) {
    console.log(error);
    res.json({success: false, message: "Error al obtener los bienes asignados"});
    return;
  }
  

};

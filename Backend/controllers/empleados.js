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

//------------------------------------- CREAR/INGRESAR EMPLEADOS --------------------------------------

exports.crear = async (req, res, next) => {


  let nombres= req.body.nombres;
  let apellidos= req.body.apellidos;
  let correo= req.body.dpi;
  let nit= req.body.nit;
  let puesto = req.body.puesto;

  try{
    
    let sql = `SELECT * FROM empleado WHERE nit='`+nit+`';`;
    
    const result1 = await query(sql);
    
    if (result1.length>0){
      res.status(400).json({success: false, message: "NIT repetido"});
      return;
    }
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error al crear empleado"});
    return;
  }


  //Verificar puesto
  let idpuesto=null;
  try{
      
    if (puesto!=''){
      puesto= puesto.toUpperCase();
      let sql =`SELECT puestoId FROM puesto WHERE nombre="`+puesto+`";`;
      const result = await query(sql);
      
      if (result.length > 0) {
        
        idpuesto=result[0].puestoId;

      } else {
        let sql =`INSERT INTO puesto(fecha_mod,nombre,activo) 
        VALUES (NOW(),"`+puesto+`",activo);`;
        await query(sql);

        sql =`SELECT puestoId FROM puesto WHERE nombre="`+puesto+`";`;
        const result2 = await query(sql);

        idpuesto=result2[0].puestoId;
      
      }
    }
  }catch (error) {
      console.log(error);
      res.status(400).json({success: false, message: "No se pudo conectar con la base de datos"});
      return;
  }

  try{
    

    let sql = `INSERT INTO empleado(fecha_mod,nombres,apellidos,dpi,nit,activo,puesto)
    VALUES(NOW(),'`+nombres+`','`+apellidos+`','`+correo+`','`+nit+`',true,`+idpuesto+`) ;`;
    
    await query(sql);
    
    res.json({success: true});
    return;
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error al crear Empleado"});
    return;
  }

};


//------------------------------------- EDITAR EMPLEADOS --------------------------------------

exports.editar = async (req, res, next) => {

  let id = req.body.id;
  let nombres= req.body.nombres;
  let apellidos= req.body.apellidos;
  let dpi= req.body.dpi;
  let nit= req.body.nit;
  let puesto = req.body.puesto;

  try{
    
    let sql = `SELECT * FROM empleado WHERE nit='`+nit+`';`;
    
    const result1 = await query(sql);
    
    if (result1.length > 0){

      if(result1[0].empleadoId == id){
        //El mismo id
      }else{
        res.status(400).json({success: false, message: "NIT repetido"});
        return;
      }
      
    }
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error al crear empleado"});
    return;
  }


  //Verificar puesto
  let idpuesto=null;
  try{
      
    if (puesto!=''){
      puesto= puesto.toUpperCase();
      let sql =`SELECT puestoId FROM puesto WHERE nombre="`+puesto+`";`;
      const result = await query(sql);
      
      if (result.length > 0) {
        
        idpuesto=result[0].puestoId;

      } else {
        let sql =`INSERT INTO puesto(fecha_mod,nombre,activo) 
        VALUES (NOW(),"`+puesto+`",activo);`;
        await query(sql);

        sql =`SELECT puestoId FROM puesto WHERE nombre="`+puesto+`";`;
        const result2 = await query(sql);

        idpuesto=result2[0].puestoId;
      
      }
    }
  }catch (error) {
      console.log(error);
      res.status(400).json({success: false, message: "No se pudo conectar con la base de datos"});
      return;
  }

  try{
    

    let sql =  `UPDATE empleado SET nombres='` + nombres + `',apellidos='` + apellidos + `',
    dpi='` + dpi + `',nit='`+nit+`', puesto =`+idpuesto+` WHERE empleadoId= ` + id +  ` ; `;
    
    await query(sql);
    
    res.json({success: true});
    return;
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error al editar Empleado"});
    return;
  }
};

//------------------------------------- Actualizar estado del Empleado --------------------------------------

exports.estado = async (req, res, next) => {

  let estado = req.body.estado;
  let id = req.body.id;

  let sql = "UPDATE empleado SET activo="+ estado +" WHERE empleadoId=" + id + " ;";
  
  connection.query(sql, async function(error,result){
    if(error){
      console.log("Error al conectar");
      res.status(400).json({success: false, message: "No hay conexion con la base de datos"});
    }else{
      
      res.json({success: true});

    }
  });

};
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

//------------------------------------- INGRESAR INFORMACION A BITACORA --------------------------------------

exports.ingresar= async (req, res, next) => {

  try{

    let usuario= req.body.usuario;
    let empleado= req.body.empleado;
    let bienaf= req.body.bienaf;
    let tipo= req.body.tipo;
    let afectado= req.body.afectado;

    let sql="";
    if(tipo==1){
      if (afectado==true){
        let sql = `SELECT MAX(id) as id FROM bien;`;
    
        const result = await query(sql);
        sql = `INSERT INTO movimiento_bien (fecha,usuario,empleado_afectado,bien_afectado,tipo_movimiento,afectado) 
        VALUES(NOW(),`+usuario+`,`+empleado+`,`+result[0].id+`,`+tipo+`,`+afectado+`);`;
        await query(sql);
        res.json({success: true});
       
      }else{
        let sql = `SELECT MAX(empleadoId) as id FROM empleado;`;
    
        const result = await query(sql);
        sql = `INSERT INTO movimiento_bien (fecha,usuario,empleado_afectado,bien_afectado,tipo_movimiento,afectado) 
        VALUES(NOW(),`+usuario+`,`+result[0].id+`,`+bienaf+`,`+tipo+`,`+afectado+`);`;
        await query(sql);
        res.json({success: true});
      }
      
    }else{
      
      sql = `INSERT INTO movimiento_bien (fecha,usuario,empleado_afectado,bien_afectado,tipo_movimiento,afectado) 
      VALUES(NOW(),`+usuario+`,`+empleado+`,`+bienaf+`,`+tipo+`,`+afectado+`);`;

      await query(sql);
      res.json({success: true});
    }

   
 
    return;
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error al registrar cambio en la bitacora",error:error});
    return;
  }
};

//------------------------------------- OBTENER INFORMACION DE BICATORA SEGUN FECHA --------------------------------------

exports.obtener= async (req, res, next) => {

  try{
    let fecha1= req.query.fecha1;
    let fecha2= req.query.fecha2;
    let sql = `SELECT m.id, m.fecha, TIME(m.fecha) AS hora, u1.correo AS usuario, t.tipo AS movimiento, m.afectado AS objetivo, u2.nit, bien.codigo AS bien FROM movimiento_bien m
    INNER JOIN usuario u1 ON u1.userId=m.usuario
    LEFT JOIN empleado u2 ON u2.empleadoId=m.empleado_afectado
    LEFT JOIN bien ON bien.id=m.bien_afectado
    INNER JOIN tipo_movimiento t ON t.id=m.tipo_movimiento 
    WHERE DATE(m.fecha)>=STR_TO_DATE("`+fecha1+`","%Y-%m-%d") AND DATE(m.fecha)<=STR_TO_DATE("`+fecha2+`","%Y-%m-%d") ORDER BY fecha DESC ;`;
    
   
    const result = await query(sql);
    

    res.json({success: true,message: result});
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error", error:error});
    return;
  }
};
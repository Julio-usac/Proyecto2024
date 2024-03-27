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


//----------------INICIAR SESION----------------

exports.login = async(req, res, next) => {

    let correo = req.body.correo;
    let pass = req.body.pass;
    let passCrypto = encriptar(pass);
    let sql = "SELECT userId, CONCAT_WS(' ', nombres, apellidos) as nombre, correo, rol FROM usuario WHERE correo='" + correo + "' AND pass='" + passCrypto+ "' AND estado = 1;";
    
    connection.query(sql, async function(error,result){
      if(error){
        console.log("Error al conectar");
        res.status(400).json({success: false, message: "No hay conexion con la base de datos"});
      }else{
        if (result.length == 1) {
          let respuesta = { success: true,
                            message: {
                              Id : "",
                              Nombre : "",
                              Correo : "",
                              Rol: "",
                            }
                          }
          

          respuesta.message.Id = result[0].userId;
          respuesta.message.Nombre = result[0].nombre;
          respuesta.message.Correo = result[0].correo;
          respuesta.message.Rol = result[0].rol;

          let jToken = getToken(respuesta.message);

          res.json({success: true,token: jToken});
        } else {
          res.status(400).json({success: false, message: "Credenciales incorrectas"});
        }
      }
    });


};


//------------------------------------- Comparar contraseña --------------------------------------

exports.comparar = async (req, res, next) => {
  let correo = req.body.correo;
  let pass = req.body.pass;
  let passCrypto = encriptar(pass);
  let sql = "SELECT pass FROM usuario WHERE correo='" + correo + "' AND pass='" + passCrypto + "';";
  
  connection.query(sql, async function(error,result){
    if(error){
      console.log("Error al conectar");
      res.status(400).json({success: false, message: "No hay conexion con la base de datos"});
    }else{
      if (result.length == 1) {
      
        res.json({success: true});

      } else {
        res.status(400).json({success: false, message: "Contraseña incorrecta"});
      }
    }
  });
};


//------------------------------------- Actualizar contraseña --------------------------------------

exports.actualizar = async (req, res, next) => {
  
  try{
    let nueva = req.body.nueva;
    let correo = req.body.correo;

    let passCrypto = encriptar(nueva);

    let sql = "UPDATE usuario SET pass='" + passCrypto + "' WHERE correo='" + correo + "' ;";

    await query(sql);

    res.json({success: true});

    return;
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error al verificar", error:error});
    return;
  }
}
//------------------------------------- Restablecer contraseña --------------------------------------
exports.restablecer = async (req, res, next) => {
  try{
    let userId = req.body.userid;
    let passCrypto = encriptar("MINECO");

    let sql = "UPDATE usuario SET pass='" + passCrypto + "' WHERE userId='" + userId + "' ;";

    await query(sql);

    res.json({success: true});

    return;
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error al verificar", error:error});
    return;
  }

};

//------------------------------------- CREAR/INGRESAR USUARIOS --------------------------------------


exports.crear = async (req, res, next) => {


  try{
    let correo= req.body.correo;

    let sql = `SELECT * FROM usuario WHERE correo='`+correo+`';`;
    
    const result1 = await query(sql);
    
    if (result1.length>0){
      res.status(400).json({success: false, message: "Correo repetido"});
      return;
    }
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error al crear usuario", error:error});
    return;
  }

  try{
    let nombres= req.body.nombres;
    let apellidos= req.body.apellidos;
    let correo= req.body.correo;
    let rol= req.body.rol;

    let passCrypto = encriptar('MINECO');

    let sql = `INSERT INTO usuario(fecha_mod,nombres,apellidos,correo,rol,estado,pass)
    VALUES(NOW(),'`+nombres+`','`+apellidos+`','`+correo+`',`+rol+`,1,'`+passCrypto+`') ;`;
    
    const result2 = await query(sql);
    
    res.json({success: true});
    return;
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error al crear usuario", error:error});
    return;
  }

};

//------------------------------------- editar usuario --------------------------------------


exports.editar = async (req, res, next) => {


  try{
    let correo= req.body.correo;
    let id = req.body.id;

    let sql = `SELECT * FROM usuario WHERE correo='`+correo+`';`;
    
    const result1 = await query(sql);
    
    if (result1.length>0){
      if(result1[0].userId==id){
        //El id no pertenece a otro usuario
      }else{
        
        res.status(400).json({success: false, message: "Correo repetido"});
        return;
      }
    }
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error al editar usuario"});
    return;
  }

  try{
    let id = req.body.id;
    let nombres = req.body.nombres;
    let apellidos = req.body.apellidos;
    let correo = req.body.correo;
    let rol = req.body.rol;

    let sql =  `UPDATE usuario SET nombres='` + nombres + `',apellidos='` + apellidos + `',
    correo='` + correo + `',rol='`+rol+`' WHERE userId= ` + id +  ` ; `;
    await query(sql);
    
    res.json({success: true});
    return;
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error al editar usuario", error:error});
    return;
  }

};
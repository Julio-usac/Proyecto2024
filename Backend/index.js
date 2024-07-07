var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var config = require('./database/config.js');
const checkAuth = require('./middleware/check-auth');
const users = require('./routes/users');
const empleados = require('./routes/empleados');
const reportes = require('./routes/reportes');
const bienes = require('./routes/bienes');
const bitacora = require('./routes/bitacora');

require('dotenv').config();

var port = process.env.SERVER_PORT;

var corsOptions = { origin: true, optionsSuccessStatus: 200 };

var app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '20mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.listen(port);

console.log('Listening on port');

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


function getToken(datos) {
  return jwt.sign(datos, process.env.JWT_CODE, {expiresIn : '60m'});
}

function verToken(token) {
  return jwt.verify(token, process.env.JWT_CODE);
}

//--------------------------------------------------Prueba---------------------------------------

app.get('/prueba', function (req, res) {
    res.send("Hola mundo!!");
});


//------------------------------------------------Rutas principales---------------------------------------
app.use(users);
app.use(empleados);
app.use(bienes);
app.use(reportes);
app.use(bitacora);

//--------------------------------------------------Endpoints generales---------------------------------------


// Verificar Token
app.post('/token', async function (req, res) {

  try {
    const token = req.headers['authorization'];
    if (!token) {
       res.status(401).json({ message: false });
       return;
    }

    verToken(token);
    res.json({message: true});
  } catch (err) {
    res.status(400).json({message: false});
  }
 
});

// Revalidar Token
app.post('/Revalidar', async function (req, res) {

  try {
    //Verificar token
    const token = req.headers['authorization'];
    if (!token) {
       res.status(401).json({ token: false });
       return;
    }
    let decoded = verToken(token);
    let respuesta = {
      message: {
        Id : "",
        Nombre : "",
        Correo : "",
        Rol: "",
      }
    }

    respuesta.message.Id = decoded.Id;
    respuesta.message.Nombre = decoded.Nombre;
    respuesta.message.Correo = decoded.Correo;
    respuesta.message.Rol = decoded.Rol;


    let jToken = getToken(respuesta.message);

    res.json({success: true,token: jToken});
    return;
  } catch (err) {
    res.status(400).json({message: false});
    return;
  }
 
});

//------------------------------------- OBTENER LISTA DE CATEGORIAS --------------------------------------

app.get('/tipo', checkAuth, async function (req, res) {
  let sql = "SELECT catId, nombre FROM categoria;";
  
  connection.query(sql, async function(error,result){
    if(error){
      console.log("Error al conectar");
      res.status(400).json({success: false, message: "No se pudo conectar con la base de datos"});
    }else{
      if (result.length > 0) {
      
        res.json({success: true, message:result});
      } else {
        res.status(400).json({success: false, message: "No hay categorias ingresadas"});;
      }
    }
  });
});

//------------------------------------- OBTENER UBICACIONES --------------------------------------

app.get('/ubicacion', checkAuth, async function (req, res) {
  let sql = "SELECT id, nombre FROM ubicacion;";
  
  connection.query(sql, async function(error,result){
    if(error){
      console.log("Error al conectar");
      res.status(400).json({success: false, message: "No se pudo conectar con la base de datos"});
    }else{
      if (result.length > 0) {
      
        res.json({success: true, message:result});
      } else {
        res.status(400).json({success: false, message: "No hay ubicaciones ingresadas"});;
      }
    }
  });
});


//------------------------------------- OBTENER Roles--------------------------------------

app.get('/ObtenerRoles', checkAuth, async function (req, res) {
  try{
    
    let sql = `SELECT rolId, rol from rol where activo = True;`;
    
    const result = await query(sql);
    
    res.json({success: true, message: result});
    return;
  }catch (error) {
    console.log(error);
    res.json({success: false, message: "Error al obtener los roles"});
    return;
  }
  
});

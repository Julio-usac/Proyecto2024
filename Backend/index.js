var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var express = require('express');
var cors = require('cors');
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

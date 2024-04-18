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


//------------------------------------- OBTENER LISTA DE USUARIOS --------------------------------------

app.get('/listaUsuarios', checkAuth, async function (req, res) {

  try{
    let sql =  `SELECT userId, CONCAT_WS(' ', nombres, apellidos) as nombre, nombres, apellidos, correo, rol.rol, estado,rolId FROM usuario
    INNER JOIN rol ON rol.rolId=usuario.rol 
    WHERE estado!=3;`;
    const result = await query(sql);
    res.json({success: true, message: result});
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "No fue posible retornar la informacion", error: error});
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

//------------------------------------- OBTENER BIENES NO ASIGNADOS --------------------------------------

app.get('/BienesNoAsignados', checkAuth, async function (req, res) {
  let sql = `SELECT bien.id,codigo, marca.nombre as marca, descripcion,precio FROM bien 
  LEFT JOIN marca ON marca.marcaId=bien.marca WHERE tarjeta IS NULL and bien.activo=true;`;
  
  connection.query(sql, async function(error,result){
    if(error){
      console.log("Error al conectar");
      res.status(400).json({success: false, message: "No se pudo conectar con la base de datos"});
    }else{
      if (result.length > 0) {
      
        res.json({success: true, message:result});
      } else {
        res.status(400).json({success: false, message: "No hay bienes ingresados"});;
      }
    }
  });
});


//------------------------------------- OBTENER BIENES ASIGNADOS (TARJETA DE RESPONSABILIDAD)--------------------------------------

app.post('/bienAsignado', checkAuth, async function (req, res) {
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
  
});


//------------------------------------- OBTENER BIENES ASIGNADOS (Bienes por usuario)--------------------------------------

app.post('/bienAsignado2', checkAuth, async function (req, res) {
  
  try{
    let empleado= req.body.empleado;
    let sql = `SELECT bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,marca,codigo,modelo,serie,cantidad,bien.categoria,marca.nombre as marca2,descripcion,ubicacion.nombre as ubicacion,bien.ubicacion as ubicacion2,bien.precio,imagen FROM bien
    INNER JOIN tarjeta_responsabilidad ON bien.tarjeta=tarjeta_responsabilidad.id and tarjeta_responsabilidad.empleado=`+empleado+`
    LEFT JOIN ubicacion ON bien.ubicacion = ubicacion.id
    LEFT JOIN marca ON bien.marca = marca.marcaId;`;
    
    const result = await query(sql);
    
    res.json({success: true, message: result});
    return;
  }catch (error) {
    console.log(error);
    res.json({success: false, message: "Error al obtener los bienes"});
    return;
  }
  
});

//------------------------------------- ASIGNAR BIENES --------------------------------------

app.post('/AsBien', checkAuth,async function (req, res) {

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
  
});


//------------------------------------Endpoint para retornar Saldo total del empleado----------------------------------
app.get('/saldoUsuario', checkAuth, async function (req, res) {
  try{
    let empleado= req.query.empleado;
    
    let sql = `SELECT saldo FROM tarjeta_responsabilidad WHERE empleado=`+empleado+` ORDER BY id DESC LIMIT 1;`;
   
    const result = await query(sql);
    
    if (result.length>0){

      let saldo=result[0].saldo;
      res.json({success: true, message: saldo});
      return;
    }else{
      res.json({success: true, message: "Saldo no disponible"});
      return;
    }
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error"});
    return;
  }
});


//------------------------------------- OBTENER BIENES SIN ASIGNAR--------------------------------------

app.get('/SinAsignar', checkAuth, async function (req, res) {
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

//------------------------------------- INGRESAR INFORMACION A BITACORA --------------------------------------

app.post('/IngresarBitacora', checkAuth, async function (req, res) {

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
  
});

//------------------------------------- OBTENER INFORMACION DE BICATORA SEGUN FECHA --------------------------------------

app.get('/ObtenerBitacora', checkAuth, async function (req, res) {
  
  try{
    let fecha1= req.query.fecha1;
    let fecha2= req.query.fecha2;
    let sql = `SELECT m.id, m.fecha, TIME(m.fecha) AS hora, u1.correo AS usuario, t.tipo AS movimiento, m.afectado AS objetivo, u2.nit, bien.codigo AS bien FROM movimiento_bien m
    INNER JOIN usuario u1 ON u1.userId=m.usuario
    LEFT JOIN empleado u2 ON u2.empleadoId=m.empleado_afectado
    LEFT JOIN bien ON bien.id=m.bien_afectado
    INNER JOIN tipo_movimiento t ON t.id=m.tipo_movimiento 
    WHERE DATE(m.fecha)>=STR_TO_DATE(DATE_FORMAT("`+fecha1+`", "%d/%m/%Y"), '%d/%m/%Y') AND DATE(m.fecha)<=STR_TO_DATE(DATE_FORMAT("`+fecha2+`", "%d/%m/%Y"), '%d/%m/%Y') ;`;
    
   
    const result = await query(sql);
    

    res.json({success: true,message: result});
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error", error:error});
    return;
  }
});

//------------------------------------- OBTENER tarjetas asignadas --------------------------------------

app.get('/tarjetasAsignadas/:id', checkAuth, async function (req, res) {
  
  try{
    let id= req.params.id;
    let sql = `SELECT id, numero_tarjeta AS tarjeta FROM tarjeta_responsabilidad WHERE empleado=`+id+`;`;
   
    const result = await query(sql);
    
    res.json({success: true,message: result});
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error", error:error});
    return;
  }
});


//------------------------------------- OBTENER LISTA DE PERSONAL --------------------------------------

app.get('/listaPersonal', checkAuth, async function (req, res) {

  try{
    let sql =  `SELECT empleadoId, CONCAT_WS(' ', nombres, apellidos) as nombre, nombres, apellidos, nit, dpi, puesto.nombre as puesto, empleado.activo,puestoId FROM empleado
    INNER JOIN puesto ON puesto.puestoId=empleado.puesto 
    WHERE empleado.activo = true;`;
    const result = await query(sql);
    res.json({success: true, message: result});
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "No fue posible retornar la informacion", error: error});
    return;
  }
});

//------------------------------------- Buscar empleado --------------------------------------

app.get('/BuscarEmpleado', checkAuth, async function (req, res) {

  try{
    let buscar = req.query.buscar;
    let sql =  `SELECT empleadoId, CONCAT_WS(' ', nombres, apellidos) as nombre, nombres, apellidos, nit, dpi, puesto.nombre as puesto, empleado.activo,puestoId FROM empleado
    INNER JOIN puesto ON puesto.puestoId=empleado.puesto 
    WHERE CONCAT_WS(' ', nombres, apellidos) LIKE '%`+buscar+`%';`;
    const result = await query(sql);
    
    res.json({success: true, message: result});
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "No fue posible retornar la informacion"});
    return;
  }
});


//------------------------------------- Obtener historial empleado--------------------------------------

app.get('/HistorialEmpleado', checkAuth, async function (req, res) {

  try{

    let empleado= req.query.empleado;
    
    let sql = `SELECT r.fecha, bien.id, bien.codigo, bien.marca, bien.modelo, bien.serie, bien.descripcion, bien.precio 
    from empleado, bien, tarjeta_responsabilidad t, responsable_activo r
    WHERE r.tarjeta=t.id and r.bien=bien.id and t.empleado=empleadoId and r.activo=true and empleadoId = `+empleado+`;`;
    
    const result = await query(sql);
    
    res.json({success: true, message: result});
    return;
  }catch (error) {
    console.log(error);
    res.json({success: false, message: "Error al obtener el Historial"});
    return;
  }
  
});
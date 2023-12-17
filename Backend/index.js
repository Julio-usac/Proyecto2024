var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var express = require('express');
var crypto = require('crypto');
var mysql = require('mysql');
var cors = require('cors');
const excel = require('excel4node');

var port = 9095;

var corsOptions = { origin: true, optionsSuccessStatus: 200 };

var app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.listen(port);

console.log('Listening on port', port);

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'dbinventario',
  port: 3306
});

function encriptar(texto) {
  const hash = crypto.createHash('sha256');
  hash.update(texto);

  return hash.digest('hex');
}

function getToken(datos) {
  return jwt.sign(datos, 'MINECO', {expiresIn : '60m'});
}

function verToken(token) {
  return jwt.verify(token, 'MINECO');
}

//--------------------------------------------------Pruebas---------------------------------------

app.get('/', function (req, res) {
    res.send("Hola mundo!");
});

// Verificar Token
app.post('/token', async function (req, res) {

  try {
    let decoded = verToken(req.body.token);
    res.json({message: true});
  } catch (err) {
    res.status(400).json({message: false});
  }
 
});

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

//--------------------------------------------------Endpoints---------------------------------------



//----------------INICIAR SESION----------------

app.post('/Login', function (req, res) {
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
});


//------------------------------------- INGRESAR BIENES--------------------------------------
app.post('/InBien', async function (req, res) {

 
  try {
    let decoded = verToken(req.body.token);
  

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
    console.log(fechaco,"1")
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

    //Convertir imagen

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

    //Consultar bienes repetidos en base de datos 

    /*
    try{
        
        if (codigo!=""){
          let sql =`SELECT * FROM bien WHERE codigo="`+codigo+`";`;
          const result = await query(sql);
          
          if (result.length > 0) {
            res.status(400).json({success: false, message:"No se puede ingresar un bien repetido"});
            return
          } else {
              ingresar=true;
          }
        }else{
          ingresar=true;
        }
    }catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: "No se pudo conectar con la base de datos"});
    }*/

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
          
          const result2 = await query(sql);

          res.json({success: true, message: "Bien ingresado"});
          
        }else{
          res.status(400).json({success: false, message: "Error al ingresar"});
        }
    }catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: "Error al ingresar los datos"});
    }

  } catch (err) {
    res.status(401).json({token: false});
    return;
  }

});

//------------------------------------- OBTENER LISTA DE USUARIOS --------------------------------------

app.get('/listaUsuarios', async function (req, res) {

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

app.get('/tipo', function (req, res) {
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

app.get('/ubicacion', function (req, res) {
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

app.get('/BienesNoAsignados', function (req, res) {
  let sql = `SELECT bien.id,codigo, marca.nombre as marca, descripcion,precio FROM bien 
  LEFT JOIN marca ON marca.marcaId=bien.marca WHERE tarjeta IS NULL;`;
  
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

app.post('/bienAsignado', async function (req, res) {
  try{
    let usuario= req.body.usuario;
    let sql = `SELECT bien.id ,codigo, marca.nombre as marca, descripcion,precio FROM bien
    LEFT JOIN marca ON marca.marcaId=bien.marca 
    INNER JOIN tarjeta_responsabilidad ON tarjeta_responsabilidad.id= bien.tarjeta
    WHERE tarjeta_responsabilidad.usuario = `+usuario+` ;`;
    
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

app.post('/bienAsignado2', async function (req, res) {
  try{
    let usuario= req.body.usuario;
    let sql = `SELECT bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,marca,codigo,modelo,serie,cantidad,bien.categoria,marca.nombre as marca2,descripcion,ubicacion.nombre as ubicacion,bien.ubicacion as ubicacion2,bien.precio,imagen FROM bien
    INNER JOIN tarjeta_responsabilidad ON bien.tarjeta=tarjeta_responsabilidad.id and tarjeta_responsabilidad.usuario=`+usuario+`
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

app.post('/AsBien', async function (req, res) {

  try {
    let decoded = verToken(req.body.token);
    //fecha actual
    const fecha = new Date();
    const añoActual = fecha.getFullYear();
    const hoy = fecha.getDate();
    const mes = fecha.getMonth() + 1; 
    let fechaActual= hoy+"/"+mes+"/"+ añoActual

    //Obtener datos

    let op = req.body.op;
    let tarjeta = req.body.tarjeta;
    let categoria = req.body.categoria;
    let usuario = req.body.usuario;
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
          console.log("no hubo repetido")
        //Crear tarjeta
          sql =  `INSERT INTO tarjeta_responsabilidad(numero_tarjeta,saldo,usuario,categoria)
          VALUES(`+tarjeta+`,`+saldo+`,`+usuario+`,`+categoria+`);`;
            
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
          console.log("si pudo quitar referencia")
          //Registrar bienes desasignados

          for (var i = 0; i < quitar.length; i++) {
            let sql =  `INSERT INTO responsable_activo(fecha,tarjeta,bien,activo)
            VALUES(NOW(),`+idtarjeta+`,`+quitar[i]+`,False);`;
            const result4 = await query(sql);
          }
          console.log("si pudo registrar desasignados")

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
          console.log("si pudo agregar referencia")
          //asignar bienes
          
            for (var i = 0; i < asignar.length; i++) {
              let sql =  `INSERT INTO responsable_activo(fecha,tarjeta,bien,activo)
              VALUES(NOW(),`+idtarjeta+`,`+asignar[i]+`,True);`;
              const result4 = await query(sql);
            }
            console.log("si pudo registrar asignaciones")
          
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
        WHERE numero_tarjeta=`+tarjeta+` and usuario=`+usuario+`;`;

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
          console.log("si pudo registrar desasignados")

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
            console.log("si pudo registrar asignaciones")
          
        }catch (error) {
          console.log(error);
          res.status(400).json({success: false, message: "Error al asignar bienes a la tarjeta"});
          return;
        }
      }

    }

    res.json({success: true, message: "Operacion exitosa"});
    return;
  } catch (err) {
    res.status(401).json({token: false});
    return;
  }
});


app.get('/DescargarReporteUsuario', async function (req, res) {

  try{
    let usuario= req.query.usuario;

    let sql = `SELECT IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco, IFNULL(cuenta,'No ingresado') AS cuenta,IFNULL(codigo,'No ingresado') AS codigo,cantidad,descripcion,IFNULL(ubicacion.nombre,'No ingresado') AS ubicacion,IFNULL(bien.precio,'No ingresado') AS precio FROM bien
    INNER JOIN tarjeta_responsabilidad ON bien.tarjeta=tarjeta_responsabilidad.id and tarjeta_responsabilidad.usuario=`+usuario+`
    LEFT JOIN ubicacion ON bien.ubicacion = ubicacion.id;`;
    
    const result = await query(sql);

    sql=`SELECT userId,  CONCAT_WS(' ', nombres, apellidos) AS nombre FROM usuario WHERE userId=`+usuario+`;`;

    const result2 = await query(sql);
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    // titulo

    var myStyle = workbook.createStyle({
      font: {
          bold: true
      }
    });
    var myStyle2 = workbook.createStyle({
      font: {
          bold: true,

          size: 16
      }
    });

    worksheet.cell(2, 1).string("Reporte de bienes por usuario").style(myStyle2);
    worksheet.cell(4, 1).string("Usuario:").style(myStyle);
    worksheet.cell(4, 2).string(result2[0].nombre);
    worksheet.cell(6, 1).string("fecha de compra").style(myStyle);
    worksheet.cell(6, 2).string("No. cuenta").style(myStyle);
    worksheet.cell(6, 3).string("Codigo de inventario").style(myStyle);
    worksheet.cell(6, 4).string("Cantidad").style(myStyle);
    worksheet.cell(6, 5).string("Descripcion").style(myStyle);
    worksheet.cell(6, 6).string("Ubicacion").style(myStyle);
    worksheet.cell(6, 7).string("Precio").style(myStyle);

    result.forEach((row, index) => {
      let cast=""+row.fechaco+""
      worksheet.cell(index + 8, 1).string(cast);
      cast=""+row.cuenta+""
      worksheet.cell(index + 8, 2).string(cast);
      cast=""+row.codigo+""
      worksheet.cell(index + 8, 3).string(cast);
      cast=""+row.cantidad+""
      worksheet.cell(index + 8, 4).string(cast);
      cast=""+row.descripcion+""
      worksheet.cell(index + 8, 5).string(cast);
      cast=""+row.ubicacion+""
      worksheet.cell(index + 8, 6).string(cast);
      cast=""+row.precio+""
      worksheet.cell(index + 8, 7).string(cast);
    });


    workbook.writeToBuffer().then((buffer) => {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
            res.send(buffer);
        });
    return;
  }catch (error) {
    console.log(error);
    res.json({success: false, message: "Error al descargar"});
    return;
  }
});

//------------------------------------Endpoint para retornar Saldo total del usuario----------------------------------
app.get('/saldoUsuario', async function (req, res) {
  try{
    let usuario= req.query.usuario;
    
    let sql = `SELECT saldo FROM tarjeta_responsabilidad WHERE usuario=`+usuario+` ORDER BY id DESC LIMIT 1;`;
   
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


//------------------------------------Endpoint para Buscar bienes----------------------------------
app.get('/BuscarBienes', async function (req, res) {

  //Extraer datos

  let buscar = req.query.buscar;
  let opcion = req.query.opcion;
  
  let sql=""
  switch (opcion) {
    case  "1":

      sql = `SELECT usuario.correo, bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,codigo,marca.nombre as marca,modelo,serie,cantidad,bien.categoria,imagen,bien.ubicacion as ubicacion2,descripcion,bien.precio FROM bien
      LEFT JOIN ubicacion ON bien.ubicacion = ubicacion.id
      LEFT JOIN marca ON marca.marcaId=bien.marca 
      LEFT JOIN tarjeta_responsabilidad t ON t.id=bien.tarjeta
      LEFT JOIN usuario ON t.usuario=usuario.userId
      WHERE bien.activo=True and codigo="`+buscar+`";`;
     
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
      sql = `SELECT usuario.correo,bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,codigo,marca.nombre as marca,modelo,serie,cantidad,bien.categoria,imagen,bien.ubicacion as ubicacion2,descripcion,bien.precio FROM bien
      LEFT JOIN ubicacion ON bien.ubicacion = ubicacion.id
      LEFT JOIN marca ON marca.marcaId=bien.marca 
      LEFT JOIN tarjeta_responsabilidad t ON t.id=bien.tarjeta
      LEFT JOIN usuario ON t.usuario=usuario.userId
      WHERE bien.activo=True and marca.nombre="`+buscar+`";`;

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
      sql = `SELECT usuario.correo,bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,codigo,marca.nombre as marca,modelo,serie,cantidad,bien.categoria,imagen,bien.ubicacion as ubicacion2,descripcion,bien.precio FROM bien
      LEFT JOIN ubicacion ON bien.ubicacion = ubicacion.id
      LEFT JOIN marca ON marca.marcaId=bien.marca 
      LEFT JOIN tarjeta_responsabilidad t ON t.id=bien.tarjeta
      LEFT JOIN usuario ON t.usuario=usuario.userId
      WHERE bien.activo=True and modelo="`+buscar+`";`;
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
      sql = `SELECT usuario.correo,bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,codigo,marca.nombre as marca,modelo,serie,cantidad,bien.categoria,imagen,bien.ubicacion as ubicacion2,descripcion,bien.precio FROM bien
      LEFT JOIN ubicacion ON bien.ubicacion = ubicacion.id
      LEFT JOIN marca ON marca.marcaId=bien.marca 
      LEFT JOIN tarjeta_responsabilidad t ON t.id=bien.tarjeta
      LEFT JOIN usuario ON t.usuario=usuario.userId
      WHERE bien.activo=True and serie="`+buscar+`";`;
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
      sql = `SELECT usuario.correo,bien.id,IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco,cuenta,codigo,marca.nombre as marca,modelo,serie,cantidad,bien.categoria,imagen,bien.ubicacion as ubicacion2,descripcion,bien.precio FROM bien
      LEFT JOIN ubicacion ON bien.ubicacion = ubicacion.id
      LEFT JOIN marca ON marca.marcaId=bien.marca 
      LEFT JOIN tarjeta_responsabilidad t ON t.id=bien.tarjeta
      LEFT JOIN usuario ON t.usuario=usuario.userId
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
    
});

//------------------------------------------------ REPORTE TOTAL DE BIENES -------------------------------------
app.get('/DescargarReporteTotal', async function (req, res) {

  try{

    let sql = `SELECT usuario.correo,codigo, marca.nombre as marca,modelo,serie,descripcion,precio FROM bien 
    LEFT JOIN marca ON marca.marcaId=bien.marca 
    LEFT JOIN tarjeta_responsabilidad t ON t.id=bien.tarjeta
    LEFT JOIN usuario ON t.usuario=usuario.userId
    WHERE bien.activo=True;`;
    
    const result = await query(sql);

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Total');

    // titulo

    var myStyle = workbook.createStyle({
      font: {
          bold: true
      }
    });
    var myStyle2 = workbook.createStyle({
      font: {
          bold: true,

          size: 16
      }
    });

    worksheet.cell(2, 1).string("Reporte total de Bienes").style(myStyle2);
    worksheet.cell(6, 1).string("Usuario").style(myStyle);
    worksheet.cell(6, 2).string("Codigo").style(myStyle);
    worksheet.cell(6, 3).string("Marca").style(myStyle);
    worksheet.cell(6, 4).string("Modelo").style(myStyle);
    worksheet.cell(6, 5).string("Serie").style(myStyle);
    worksheet.cell(6, 6).string("Descripcion").style(myStyle);
    worksheet.cell(6, 7).string("Precio").style(myStyle);

    result.forEach((row, index) => {
      let cast="";
      if(row.correo){
        cast=""+row.correo+"";
      }else{
        cast="No asignado";
      }
      worksheet.cell(index + 7, 1).string(cast);
      cast=""+row.codigo+""
      worksheet.cell(index + 7, 2).string(cast);
      cast=""+row.marca+""
      worksheet.cell(index + 7, 3).string(cast);
      cast=""+row.modelo+""
      worksheet.cell(index + 7, 4).string(cast);
      cast=""+row.serie+""
      worksheet.cell(index + 7, 5).string(cast);
      cast=""+row.descripcion+""
      worksheet.cell(index + 7, 6).string(cast);
      if(row.precio){
        cast=""+row.precio+"";
      }else{
        cast="No ingresado";
      }
      worksheet.cell(index + 7, 7).string(cast);
    });


    workbook.writeToBuffer().then((buffer) => {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
            res.send(buffer);
        });
    return;
  }catch (error) {
    console.log(error);
    res.json({success: false, message: "Error al Descargar"});
    return;
  }
});




//------------------------------------- OBTENER BIENES SIN ASIGNAR--------------------------------------

app.get('/SinAsignar', async function (req, res) {
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


//------------------------------------- RETORNAR BIENES DADOS DE BAJA --------------------------------------

app.get('/DadosdeBaja', async function (req, res) {

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
            INNER JOIN usuario u ON u.userId = t.usuario
            LEFT JOIN marca ON bien.marca = marca.marcaId
            WHERE r.fecha IN (SELECT max(r.fecha) FROM responsable_activo r
            WHERE r.activo=0 and bien.activo=0
            GROUP BY r.bien)
        UNION
        SELECT bien.id,"Sin usuario","Sin Usuario",codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(precio,"No ingresado") AS precio FROM bien
        LEFT JOIN marca ON bien.marca = marca.marcaId
        WHERE bien.activo=0 AND bien.id NOT IN (SELECT r.bien FROM responsable_activo r
            WHERE r.activo=0)) grupo
      WHERE codigo="`+buscar+`";`;
     
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
            INNER JOIN usuario u ON u.userId = t.usuario
            LEFT JOIN marca ON bien.marca = marca.marcaId
            WHERE r.fecha IN (SELECT max(r.fecha) FROM responsable_activo r
            WHERE r.activo=0 and bien.activo=0
            GROUP BY r.bien)
        UNION
        SELECT bien.id,"Sin usuario","Sin Usuario",codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(precio,"No ingresado") AS precio FROM bien
        LEFT JOIN marca ON bien.marca = marca.marcaId
        WHERE bien.activo=0 AND bien.id NOT IN (SELECT r.bien FROM responsable_activo r
            WHERE r.activo=0)) grupo
      WHERE marca="`+buscar+`";`;

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
            INNER JOIN usuario u ON u.userId = t.usuario
            LEFT JOIN marca ON bien.marca = marca.marcaId
            WHERE r.fecha IN (SELECT max(r.fecha) FROM responsable_activo r
            WHERE r.activo=0 and bien.activo=0
            GROUP BY r.bien)
        UNION
        SELECT bien.id,"Sin usuario","Sin Usuario",codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(precio,"No ingresado") AS precio FROM bien
        LEFT JOIN marca ON bien.marca = marca.marcaId
        WHERE bien.activo=0 AND bien.id NOT IN (SELECT r.bien FROM responsable_activo r
            WHERE r.activo=0)) grupo
      WHERE  modelo="`+buscar+`";`;
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
            INNER JOIN usuario u ON u.userId = t.usuario
            LEFT JOIN marca ON bien.marca = marca.marcaId
            WHERE r.fecha IN (SELECT max(r.fecha) FROM responsable_activo r
            WHERE r.activo=0 and bien.activo=0
            GROUP BY r.bien)
        UNION
        SELECT bien.id,"Sin usuario","Sin Usuario",codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(precio,"No ingresado") AS precio FROM bien
        LEFT JOIN marca ON bien.marca = marca.marcaId
        WHERE bien.activo=0 AND bien.id NOT IN (SELECT r.bien FROM responsable_activo r
            WHERE r.activo=0)) grupo
      WHERE serie="`+buscar+`";`;
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
            INNER JOIN usuario u ON u.userId = t.usuario
            LEFT JOIN marca ON bien.marca = marca.marcaId
            WHERE r.fecha IN (SELECT max(r.fecha) FROM responsable_activo r
            WHERE r.activo=0 and bien.activo=0
            GROUP BY r.bien)
        UNION
        SELECT bien.id,"Sin usuario","Sin Usuario",codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(precio,"No ingresado") AS precio FROM bien
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
  
});



//------------------------------------- OBTENER Roles--------------------------------------

app.get('/ObtenerRoles', async function (req, res) {
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



//------------------------------------- Comparar contraseña --------------------------------------


app.post('/VerificarPass', function (req, res) {
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
});


//------------------------------------------EDITAR BIENES----------------------------------
app.post('/EditarBien', async function (req, res) {

  try {
    let decoded = verToken(req.body.token);
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
      const result3 = await query(sql);
      res.json({success: true, message: req.body.codigo});
      return;
    }catch (error) {
      console.log(error);
      res.status(400).json({success: false, message: "Error al editar",error:error});
      return;
    }
  } catch (err) {
    res.status(401).json({token: false});
    return;
  }
});

//------------------------------------- DAR DE BAJA UN BIEN --------------------------------------

app.delete('/DardeBaja/:id', async function (req, res) {

  try{
    let sql =  `UPDATE bien SET activo = false WHERE id =`+req.params.id+`;`;
    const result = await query(sql);
    res.json({success: true, message: "Bien dado de baja satisfactoriamente"});
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "No fue posible dar de baja el bien", error: error});
    return;
  }
  
});


//------------------------------------- DAR DE BAJA UN USUARIO--------------------------------------

app.delete('/EliminarUsuario/:id', async function (req, res) {
  try {
    let decoded = verToken(req.query.token);
    try{
      let sql =  `UPDATE usuario SET estado = 3 WHERE userId =`+req.params.id+`;`;
      const result = await query(sql);
      res.json({success: true, message: "Usuario eliminado satisfactoriamente"});
    }catch (error) {
      console.log(error);
      res.status(400).json({success: false, message: "No fue posible dar de baja el bien", error: error});
      return;
    }
  } catch (err) {
    console.log(err)
    res.status(401).json({token: false});
    return;
  }
});


//------------------------------------- Actualizar contraseña --------------------------------------


app.put('/ActualizarPass', async function (req, res) {
  try{
    let nueva = req.body.nueva;
    let correo = req.body.correo;

    let passCrypto = encriptar(nueva);

    let sql = "UPDATE usuario SET pass='" + passCrypto + "' WHERE correo='" + correo + "' ;";

    const result = await query(sql);

    res.json({success: true});

    return;
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error al verificar", error:error});
    return;
  }
});

//------------------------------------- Actualizar estado --------------------------------------

app.put('/ActualizarEstado', function (req, res) {
  let estado = req.body.estado;
  let id = req.body.id;

  let sql = "UPDATE usuario SET estado=" + estado +" WHERE userId=" + id + " ;";
  
  connection.query(sql, async function(error,result){
    if(error){
      console.log("Error al conectar");
      res.status(400).json({success: false, message: "No hay conexion con la base de datos"});
    }else{
      
      res.json({success: true});

    }
  });
});



//------------------------------------- CREAR/INGRESAR USUARIOS --------------------------------------

app.post('/CrearUsuario', async function (req, res) {
  try {
    let decoded = verToken(req.body.token);
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

      let sql = `INSERT INTO usuario(fecha_mod,nombres,apellidos,correo,rol,estado,pass)
      VALUES(NOW(),'`+nombres+`','`+apellidos+`','`+correo+`',`+rol+`,1,'MINECO') ;`;
      
      const result2 = await query(sql);
      
      res.json({success: true});
      return;
    }catch (error) {
      console.log(error);
      res.status(400).json({success: false, message: "Error al crear usuario", error:error});
      return;
    }
  } catch (err) {
    res.status(401).json({token: false});
    return;
  }
});



//------------------------------------- Actualizar usuario --------------------------------------

app.put('/EditarUsuario', async function (req, res) {

  try {
    let decoded = verToken(req.body.token);
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
      const result2 = await query(sql);
      
      res.json({success: true});
      return;
    }catch (error) {
      console.log(error);
      res.status(400).json({success: false, message: "Error al editar usuario", error:error});
      return;
    }
  } catch (err) {
    res.status(401).json({token: false});
    return;
  }
});


//------------------------------------- INGRESAR INFORMACION A BITACORA --------------------------------------

app.post('/IngresarBitacora', async function (req, res) {

  try{

    let usuario= req.body.usuario;
    let usuarioaf= req.body.usuarioaf;
    let bienaf= req.body.bienaf;
    let tipo= req.body.tipo;
    let afectado= req.body.afectado;

    let sql="";
    if(tipo==1){
      if (afectado==true){
        let sql = `SELECT MAX(id) as id FROM bien;`;
    
        const result = await query(sql);
        sql = `INSERT INTO movimiento_bien (fecha,usuario,usuario_afectado,bien_afectado,tipo_movimiento,afectado) 
        VALUES(NOW(),`+usuario+`,`+usuarioaf+`,`+result[0].id+`,`+tipo+`,`+afectado+`);`;
        const result2 = await query(sql);
        res.json({success: true});
       
      }else{
        let sql = `SELECT MAX(userId) as id FROM usuario;`;
    
        const result = await query(sql);
        sql = `INSERT INTO movimiento_bien (fecha,usuario,usuario_afectado,bien_afectado,tipo_movimiento,afectado) 
        VALUES(NOW(),`+usuario+`,`+result[0].id+`,`+bienaf+`,`+tipo+`,`+afectado+`);`;
        const result2 = await query(sql);
        res.json({success: true});
      }
      
    }else{
      sql = `INSERT INTO movimiento_bien (fecha,usuario,usuario_afectado,bien_afectado,tipo_movimiento,afectado) 
    VALUES(NOW(),`+usuario+`,`+usuarioaf+`,`+bienaf+`,`+tipo+`,`+afectado+`);`;

    const result2 = await query(sql);
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

app.get('/ObtenerBitacora', async function (req, res) {
  
  try{
    let fecha= req.query.fecha;
    let sql = `SELECT m.id, m.fecha, TIME(m.fecha) AS hora, u1.correo AS usuario, t.tipo AS movimiento, m.afectado AS objetivo, u2.correo, bien.codigo AS bien FROM movimiento_bien m
    INNER JOIN usuario u1 ON u1.userId=m.usuario
    LEFT JOIN usuario u2 ON u2.userId=m.usuario_afectado
    LEFT JOIN bien ON bien.id=m.bien_afectado
    INNER JOIN tipo_movimiento t ON t.id=m.tipo_movimiento 
    WHERE DATE(m.fecha)=STR_TO_DATE(DATE_FORMAT("`+fecha+`", "%d/%m/%Y"), '%d/%m/%Y');`;
   
    const result = await query(sql);
    

    res.json({success: true,message: result});
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error", error:error});
    return;
  }
});



//------------------------------------------------ DESCARGAR BITACORA -------------------------------------

app.get('/DescargarBitacora', async function (req, res) {

  try{

    let sql = `SELECT m.id, DATE_FORMAT(m.fecha, '%d/%m/%Y') as fecha, TIME(m.fecha) as hora,u1.correo as usuario, t.tipo as movimiento, m.afectado as objetivo, COALESCE(u2.correo, bien.codigo) as identificador FROM movimiento_bien m
    INNER JOIN usuario u1 ON u1.userId=m.usuario
    LEFT JOIN usuario u2 ON u2.userId=m.usuario_afectado
    LEFT JOIN bien ON bien.id=m.bien_afectado
    INNER JOIN tipo_movimiento t ON t.id=m.tipo_movimiento;`;
    
    const result = await query(sql);

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Total');

    // titulo

    var myStyle = workbook.createStyle({
      font: {
          bold: true
      }
    });
    var myStyle2 = workbook.createStyle({
      font: {
          bold: true,

          size: 16
      }
    });

    worksheet.cell(2, 1).string("Bitacora").style(myStyle2);
    worksheet.cell(6, 1).string("Fecha").style(myStyle);
    worksheet.cell(6, 2).string("Hora").style(myStyle);
    worksheet.cell(6, 3).string("Usuario").style(myStyle);
    worksheet.cell(6, 4).string("Movimiento").style(myStyle);
    worksheet.cell(6, 5).string("Objeto").style(myStyle);
    worksheet.cell(6, 6).string("N.Usuario/B.Codigo").style(myStyle);

    result.forEach((row, index) => {
      let cast=""+row.fecha+""
      worksheet.cell(index + 7, 1).string(cast);
      cast=""+row.hora+""
      worksheet.cell(index + 7, 2).string(cast);
      cast=""+row.usuario+""
      worksheet.cell(index + 7, 3).string(cast);
      cast=""+row.movimiento+""
      worksheet.cell(index + 7, 4).string(cast);
      if(row.objetivo==0){
        cast="Usuario";
      }else{
        cast="Bien";
      }
      worksheet.cell(index + 7, 5).string(cast);
      if(row.identificador){
        cast=""+row.identificador+"";
      }else{
        cast="";
      }
      
      worksheet.cell(index + 7, 6).string(cast);
    });


    workbook.writeToBuffer().then((buffer) => {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
            res.send(buffer);
        });
    return;
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error al Descargar", error:error});
    return;
  }
});



//------------------------------------------------ DESCARGAR BITACORA -------------------------------------

app.get('/DescargarBienesBaja', async function (req, res) {

  try{

    let sql = `SELECT bien.id, DATE_FORMAT(r.fecha, '%d/%m/%Y') AS fecha,concat_ws(' ', u.nombres,u.apellidos) AS usuario,codigo,marca.nombre AS marca,modelo,serie,descripcion,
    IFNULL(bien.precio,"No ingresado") AS precio FROM responsable_activo r
    INNER JOIN tarjeta_responsabilidad t ON r.tarjeta = t.id
    INNER JOIN bien ON bien.id = r.bien
    INNER JOIN usuario u ON u.userId = t.usuario
    LEFT JOIN marca ON bien.marca = marca.marcaId
    WHERE r.fecha IN (SELECT max(r.fecha) FROM responsable_activo r
    WHERE r.activo=0 and bien.activo=0
    GROUP BY r.bien)
    UNION
    SELECT bien.id,"Sin usuario","Sin Usuario",codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(precio,"No ingresado") AS precio FROM bien
    LEFT JOIN marca ON bien.marca = marca.marcaId
    WHERE bien.activo=0 AND bien.id NOT IN (SELECT r.bien FROM responsable_activo r
    WHERE r.activo=0);`;
    
    const result = await query(sql);

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Total');

    // titulo

    var myStyle = workbook.createStyle({
      font: {
          bold: true
      }
    });
    var myStyle2 = workbook.createStyle({
      font: {
          bold: true,

          size: 16
      }
    });

    worksheet.cell(2, 1).string("Bienes dados de baja").style(myStyle2);
    worksheet.cell(6, 1).string("Fecha").style(myStyle);
    worksheet.cell(6, 2).string("Usuario").style(myStyle);
    worksheet.cell(6, 3).string("Codigo").style(myStyle);
    worksheet.cell(6, 4).string("Marca").style(myStyle);
    worksheet.cell(6, 5).string("Modelo").style(myStyle);
    worksheet.cell(6, 6).string("Serie").style(myStyle);
    worksheet.cell(6, 7).string("Descripcion").style(myStyle);
    worksheet.cell(6, 8).string("Precio").style(myStyle);

    result.forEach((row, index) => {
      let cast=""+row.fecha+""
      worksheet.cell(index + 7, 1).string(cast);
      cast=""+row.usuario+""
      worksheet.cell(index + 7, 2).string(cast);
      cast=""+row.codigo+""
      worksheet.cell(index + 7, 3).string(cast);
      cast=""+row.marca+""
      worksheet.cell(index + 7, 4).string(cast);
      cast=""+row.modelo+""
      worksheet.cell(index + 7, 5).string(cast);
      cast=""+row.serie+""
      worksheet.cell(index + 7, 6).string(cast);
      cast=""+row.descripcion+""
      worksheet.cell(index + 7, 7).string(cast);
      cast=""+row.precio+""
      worksheet.cell(index + 7, 8).string(cast);
    });


    workbook.writeToBuffer().then((buffer) => {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
            res.send(buffer);
        });
    return;
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "Error al Descargar", error:error});
    return;
  }
});

//------------------------------------- RESTAURAR BIEN --------------------------------------

app.put('/RestaurarBien/:id', async function (req, res) {

  try{
    let sql =  `UPDATE bien SET activo = true WHERE id =`+req.params.id+`;`;
    const result = await query(sql);
    res.json({success: true, message: "Bien restaurado satisfactoriamente"});
  }catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "No fue posible dar de baja el bien", error: error});
    return;
  }
  
});
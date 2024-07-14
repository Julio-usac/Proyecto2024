var mysql = require('mysql');
var config = require('../database/config.js');
const PDFDocument = require('pdfkit');
const excel = require('excel4node');

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

//------------------------------Descargar Excel Reporte de bienes por usuario-----------------------

exports.excel1 = async (req, res, next) => {

  try{

    let empleado= req.query.empleado;
    let usuario= req.query.usuario;

    //Retornar datos del bien

    let sql = `SELECT  IFNULL(serie,'No ingresado') AS serie, IFNULL(marca.nombre,'No ingresado') AS marca, IFNULL(modelo,'No ingresado') AS modelo, IFNULL(cuenta,'No ingresado') AS cuenta,IFNULL(codigo,'No ingresado') AS codigo,cantidad,descripcion,IFNULL(ubicacion.nombre,'No ingresado') AS ubicacion,IFNULL(bien.precio,'No ingresado') AS precio FROM bien
    INNER JOIN tarjeta_responsabilidad ON bien.tarjeta=tarjeta_responsabilidad.id and tarjeta_responsabilidad.empleado=`+empleado+`
    LEFT JOIN ubicacion ON bien.ubicacion = ubicacion.id
    LEFT JOIN marca ON bien.marca = marca.marcaId;`;
    
    const result = await query(sql);

    //Retornar datos del empleado

    sql=`SELECT empleadoId,  CONCAT_WS(' ', nombres, apellidos) AS nombre, nit, puesto.nombre as puesto FROM empleado, puesto 
    WHERE empleadoId=`+empleado+` and puesto.puestoId=empleado.puesto;`;

    const result2 = await query(sql);

    //Retornar datos del usuario

    sql=`SELECT userId,  CONCAT_WS(' ', nombres, apellidos) AS nombre FROM usuario
    WHERE userId=`+usuario+`;`;

    const result3 = await query(sql);

    //Se crea el archivo de Excel
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Users');

  
    // Inserta la imagen en la celda A1

    worksheet.addImage({
      path: 'logo.jpg',
      type: 'picture',
      position: {
          type: 'twoCellAnchor',
          from: {
              col: 1, // Columna de la celda
              row: 1, // Fila de la celda
          },
          to: {
            col: 4, // Columna de la celda inferior derecha
            row: 4, // Fila de la celda inferior derecha
        },

      },
      
    });


    // estilo para titulos de columnas de la tabla

    var myStyle = workbook.createStyle({
      font: {
          bold: true,
          
      },
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      },
      alignment: {
        horizontal: 'center',
        shrinkToFit: true,
        wrapText: true
      }
    });

    // estilo para el titulo del reporte
    var myStyle2 = workbook.createStyle({
      font: {
          bold: true,

          size: 20
      }
    });

    // estilo para centrar los datos y colocar bordes
    var myStyle3 = workbook.createStyle({
      alignment: {
        horizontal: 'center',
        shrinkToFit: true,
        wrapText: true
      },
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      }
    });

    // Estilo para colocar bordes
    var myStyle4 = workbook.createStyle({
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      },
      
      alignment: {
          shrinkToFit: true,
          wrapText: true
      }
    });

    //Ancho de la columna "Descripcion"
    worksheet.column(8).setWidth(60);
    //Ancho de la columna "No."
    worksheet.column(1).setWidth(4);

    worksheet.cell(5, 5).string("REPORTE DE BIENES ASIGNADOS AL EMPLEADO").style(myStyle2);
    worksheet.cell(8, 1).string("Código de empleado: " + result2[0].empleadoId)
    worksheet.cell(9, 1).string("Nombre de empleado: "+ result2[0].nombre);
    worksheet.cell(10, 1).string("Nit: " + result2[0].nit);
    worksheet.cell(11, 1).string("Puesto: " + result2[0].puesto);
    worksheet.cell(12, 1).string("Usuario: " + result3[0].nombre);
    
    worksheet.cell(15, 1).string("No.").style(myStyle);
    worksheet.cell(15, 2).string("IdMineco").style(myStyle);
    worksheet.cell(15, 3).string("Cantidad").style(myStyle);
    worksheet.cell(15, 4).string("Marca").style(myStyle);
    worksheet.cell(15, 5).string("Modelo").style(myStyle);
    worksheet.cell(15, 6).string("Serie").style(myStyle);
    worksheet.cell(15, 7).string("Ubicacion").style(myStyle);
    worksheet.cell(15, 8).string("Descripcion").style(myStyle);

    //Variable para contar registros

    let Ncontar= 0;

    result.forEach((row, index) => {
      //No.
      Ncontar+=1;
      worksheet.cell(index + 16, 1).number(Ncontar).style(myStyle3);

      //IdMineco
      let cast=""+row.codigo+""
      worksheet.cell(index + 16, 2).string(cast).style(myStyle3);

      //Cantidad
      cast=row.cantidad
      worksheet.cell(index + 16, 3).number(cast).style(myStyle3);

      //Marca
      cast = row.marca+""
      worksheet.cell(index + 16, 4).string(cast).style(myStyle3);

      //Modelo
      cast=""+row.modelo+""
      worksheet.cell(index + 16, 5).string(cast).style(myStyle3);

      //Serie
      cast=""+row.serie+""
      worksheet.cell(index + 16, 6).string(cast).style(myStyle3);

      //Ubicacion
      cast=""+row.ubicacion+""
      worksheet.cell(index + 16, 7).string(cast).style(myStyle3);

      //Descripcion
      cast=""+row.descripcion+""
      worksheet.cell(index + 16, 8).string(cast).style(myStyle4);
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

}

//------------------------------------------------ REPORTE EXCEL TOTAL DE BIENES -------------------------------------
exports.excel2 = async (req, res, next) => {
  
  try{


    let usuario = req.query.usuario; 

    //Retonar informacion de bienes

    let sql = `SELECT bien.id, IFNULL(CONCAT(e.nombres," ",e.apellidos),'Sin asignar') AS empleado, IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco, IFNULL(marca.nombre,"No ingresado") AS marca, bien.activo, codigo, cantidad, categoria.nombre AS categoria,IFNULL(modelo,"No ingresado") AS modelo,IFNULL(serie,"No ingresado") AS serie, IFNULL(ubicacion.nombre,"No ingresado") AS ubicacion, descripcion FROM bien 
    LEFT JOIN marca ON marca.marcaId=bien.marca 
    LEFT JOIN tarjeta_responsabilidad t ON t.id=bien.tarjeta
	  LEFT JOIN responsable_activo r ON r.tarjeta=t.id and r.bien=bien.id
    LEFT JOIN empleado e ON t.empleado=e.empleadoId
    LEFT JOIN ubicacion ON ubicacion.id=bien.ubicacion
    LEFT JOIN categoria ON categoria.catId=bien.categoria
    WHERE bien.activo=true;`;
    
    const result = await query(sql);

    //Retornar datos del usuario

    sql=`SELECT userId,  CONCAT_WS(' ', nombres, apellidos) AS nombre FROM usuario
    WHERE userId=`+usuario+`;`;

    const result2 = await query(sql);

    //Creacion de archivo Excel

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Total');

    
    // Inserta la imagen en la celda A1

    worksheet.addImage({
      path: 'logo.jpg',
      type: 'picture',
      position: {
          type: 'twoCellAnchor',
          from: {
              col: 1, // Columna de la celda
              row: 1, // Fila de la celda
          },
          to: {
            col: 4, // Columna de la celda inferior derecha
            row: 4, // Fila de la celda inferior derecha
        },

      },
      
    });

    //estilo del titulo del documento
    var myStyle2 = workbook.createStyle({
      font: {
          bold: true,

          size: 18
      }
    });

    //estilo del titulo de las columnas

    var myStyle = workbook.createStyle({
      alignment: {
        horizontal: 'center',
        shrinkToFit: true
      },
      font: {
          bold: true
      },
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      }
    });
    
    // estilo para centrar los datos y colocar bordes
    var myStyle3 = workbook.createStyle({
      alignment: {
        horizontal: 'center',
        shrinkToFit: true,
        wrapText: true
      },
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      }
    });

    // estilo para centrar el nombre de empleado y colocar bordes
    var myStyle4 = workbook.createStyle({
      alignment: {
        horizontal: 'center',
        shrinkToFit: true
      },
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      }
    });

    // Estilo para la descripcion
    var myStyle5 = workbook.createStyle({
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      },
      
      alignment: {
          shrinkToFit: true,
          wrapText: true
      }
    });

    //Ancho de la columna "No."
    worksheet.column(1).setWidth(4);

    //Ancho de la columna "Descripcion"
    worksheet.column(11).setWidth(45);
    

    worksheet.cell(5, 3).string("INVENTARIO GENERAL DE BIENES ACTIVOS Y\n BIENES FUNGIBLES").style(myStyle2);
    worksheet.cell(7, 2).string("Usuario: "+ result2[0].nombre);
    worksheet.cell(9, 1).string("No.").style(myStyle);
    worksheet.cell(9, 2).string("Fecha de compra").style(myStyle);
    worksheet.cell(9, 3).string("IdMineco").style(myStyle);
    worksheet.cell(9, 4).string("Cantidad").style(myStyle);
    worksheet.cell(9, 5).string("Marca").style(myStyle);
    worksheet.cell(9, 6).string("Modelo").style(myStyle);
    worksheet.cell(9, 7).string("Serie").style(myStyle);
    worksheet.cell(9, 8).string("Bien Asignado A:").style(myStyle);
    worksheet.cell(9, 9).string("Tipo de bien").style(myStyle);
    worksheet.cell(9, 10).string("ubicacion").style(myStyle);
    worksheet.cell(9, 11).string("descripcion").style(myStyle);

    //Variable para contar registros

    let Ncontar= 0;

    result.forEach((row, index) => {
      //No.
      Ncontar+=1;
      worksheet.cell(index + 10, 1).number(Ncontar).style(myStyle3);

      //fecha de compra 
      let cast = "";
      cast = ""+row.fechaco+"";
      worksheet.cell(index + 10, 2).string(cast).style(myStyle3);

      //IdMineco
      cast=""+row.codigo+""
      worksheet.cell(index + 10, 3).string(cast).style(myStyle3);

      //Cantidad
      cast = row.cantidad
      worksheet.cell(index + 10, 4).number(cast).style(myStyle3);

      //Marca
      cast=""+row.marca+""
      worksheet.cell(index + 10, 5).string(cast).style(myStyle3);
      
      //Modelo
      cast=""+row.modelo+""
      worksheet.cell(index + 10, 6).string(cast).style(myStyle3);

      //Serie
      cast=""+row.serie+""
      worksheet.cell(index + 10, 7).string(cast).style(myStyle3);

      //Bien asignado a
      cast=""+row.empleado+""
      worksheet.cell(index + 10, 8).string(cast).style(myStyle4);
      
      //tipo de bien
      cast=""+row.categoria+"";
      worksheet.cell(index + 10, 9).string(cast).style(myStyle3);

      //ubicacion
      cast=""+row.ubicacion+"";
      worksheet.cell(index + 10, 10).string(cast).style(myStyle3);

      //descripcion
      cast=""+row.descripcion+"";
      worksheet.cell(index + 10, 11).string(cast).style(myStyle5);
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
}

//------------------------------------------------ DESCARGAR EXCEL bienes de baja -------------------------------------
exports.excel3 = async (req, res, next) => {

  try{

    let sql = `SELECT bien.id, DATE_FORMAT(r.fecha, '%d/%m/%Y') AS fecha,concat_ws(' ', u.nombres,u.apellidos) AS empleado,codigo,marca.nombre AS marca,modelo,serie,descripcion,
    IFNULL(bien.fecha_mod,"No ingresado") AS fechamod, cantidad FROM responsable_activo r
    INNER JOIN tarjeta_responsabilidad t ON r.tarjeta = t.id
    INNER JOIN bien ON bien.id = r.bien
    INNER JOIN empleado u ON u.empleadoId = t.empleado
    LEFT JOIN marca ON bien.marca = marca.marcaId
    WHERE r.fecha IN (SELECT max(r.fecha) FROM responsable_activo r
    WHERE r.activo=0 and bien.activo=0
    GROUP BY r.bien)
    UNION
    SELECT bien.id,"Sin asignacion","Sin asignacion",codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(bien.fecha_mod,"No ingresado") AS fechamod, cantidad FROM bien
    LEFT JOIN marca ON bien.marca = marca.marcaId
    WHERE bien.activo=0 AND bien.id NOT IN (SELECT r.bien FROM responsable_activo r
    WHERE r.activo=0);`;
    
    const result = await query(sql);

    //Retornar datos del usuario

    let usuario = req.query.usuario; 

    sql=`SELECT userId,  CONCAT_WS(' ', nombres, apellidos) AS nombre FROM usuario
    WHERE userId=`+usuario+`;`;

    const result2 = await query(sql);


    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Total');

    // Inserta la imagen en la celda A1

    worksheet.addImage({
      path: 'logo.jpg',
      type: 'picture',
      position: {
          type: 'twoCellAnchor',
          from: {
              col: 1, // Columna de la celda
              row: 1, // Fila de la celda
          },
          to: {
            col: 4, // Columna de la celda inferior derecha
            row: 4, // Fila de la celda inferior derecha
        },

      },
      
    });

     //estilo del titulo de las columnas

     let myStyle = workbook.createStyle({
      alignment: {
        horizontal: 'center',
        shrinkToFit: true
      },
      font: {
          bold: true
      },
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      }
    });

    //estilo del titulo del documento
    let myStyle2 = workbook.createStyle({
      font: {
          bold: true,

          size: 18
      }
    });
    
    // estilo para centrar los datos y colocar bordes
    let myStyle3 = workbook.createStyle({
      alignment: {
        horizontal: 'center',
        shrinkToFit: true,
        wrapText: true
      },
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      }
    });

    // estilo para  colocar bordes
    let myStyle4 = workbook.createStyle({
      alignment: {
        shrinkToFit: true,
        wrapText: true
      },
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      }
    });

    //Ancho de la columna "No."
    worksheet.column(1).setWidth(4);

    //Ancho de la columna "Descripcion"
    worksheet.column(8).setWidth(45);

    //Ancho de la columna "empleado"
    worksheet.column(9).setWidth(25);
    
    worksheet.cell(5, 4).string("REPORTE DE BIENES DADOS DE BAJA\n ACTIVOS Y FUNGIBLES").style(myStyle2);
    worksheet.cell(7, 2).string("Usuario: "+ result2[0].nombre);
    worksheet.cell(9, 1).string("No.").style(myStyle);
    worksheet.cell(9, 2).string("Fecha de baja").style(myStyle);
    worksheet.cell(9, 3).string("IdMineco").style(myStyle);
    worksheet.cell(9, 4).string("Cantidad").style(myStyle);
    worksheet.cell(9, 5).string("Marca").style(myStyle);
    worksheet.cell(9, 6).string("Modelo").style(myStyle);
    worksheet.cell(9, 7).string("Serie").style(myStyle);
    worksheet.cell(9, 8).string("Descripcion").style(myStyle);
    worksheet.cell(9, 9).string("Ultimo asignado").style(myStyle);

    let Ncontar= 0;
    result.forEach((row, index) => {

      //No.
      Ncontar+=1;
      worksheet.cell(index + 10, 1).number(Ncontar).style(myStyle3);      

      //fecha de compra 
      cast = ""+row.fechamod+"";
      worksheet.cell(index + 10, 2).string(cast).style(myStyle3);

      //IdMineco
      cast=""+row.codigo+""
      worksheet.cell(index + 10, 3).string(cast).style(myStyle3);

      //Cantidad
      cast = row.cantidad
      worksheet.cell(index + 10, 4).number(cast).style(myStyle3);

      //Marca
      cast=""+row.marca+""
      worksheet.cell(index + 10, 5).string(cast).style(myStyle3);
      
      //Modelo
      cast=""+row.modelo+""
      worksheet.cell(index + 10, 6).string(cast).style(myStyle3);

      //Serie
      cast=""+row.serie+""
      worksheet.cell(index + 10, 7).string(cast).style(myStyle3);

      //descripcion
      cast=""+row.descripcion+"";
      worksheet.cell(index + 10, 8).string(cast).style(myStyle4);

      //Bien asignado a
      cast=""+row.empleado+""
      worksheet.cell(index + 10, 9).string(cast).style(myStyle4);
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

};

//------------------------------------------------ DESCARGAR BITACORA -------------------------------------

exports.excel4 = async (req, res, next) => {

  try{
    let fecha1= req.query.fecha1;
    let fecha2= req.query.fecha2;
    let sql = `SELECT m.id, DATE_FORMAT(m.fecha, '%d/%m/%Y') as fecha, TIME(m.fecha) as hora,u1.correo as usuario, t.tipo as movimiento, m.afectado as objetivo, COALESCE(u2.nit, bien.codigo) as identificador FROM movimiento_bien m
    INNER JOIN usuario u1 ON u1.userId=m.usuario
    LEFT JOIN empleado u2 ON u2.empleadoId=m.empleado_afectado
    LEFT JOIN bien ON bien.id=m.bien_afectado
    INNER JOIN tipo_movimiento t ON t.id=m.tipo_movimiento
    WHERE DATE(m.fecha)>=STR_TO_DATE("`+fecha1+`","%Y-%m-%d") AND DATE(m.fecha)<=STR_TO_DATE("`+fecha2+`","%Y-%m-%d") ORDER BY fecha DESC;`;
    
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

};


//------------------------------------------------ DESCARGAR Bienes activos -------------------------------------

exports.excel5 = async (req, res, next) => {

  try{

    let usuario= req.query.usuario;
    let fecha1=`STR_TO_DATE("`+req.query.fecha1+`","%Y-%m-%d")`;
    let fecha2=`STR_TO_DATE("`+req.query.fecha2+`","%Y-%m-%d")`;
    //Retornar datos del bien

    let sql = `SELECT IFNULL(fechaco,'No ingresado') AS fechaco, IFNULL(serie,'No ingresado') AS serie, IFNULL(marca.nombre,'No ingresado') AS marca, IFNULL(modelo,'No ingresado') AS modelo,IFNULL(codigo,'No ingresado') AS codigo,cantidad,descripcion FROM bien
    LEFT JOIN marca ON bien.marca = marca.marcaId
    WHERE bien.categoria=1 and ((fechaco BETWEEN `+fecha1+` and `+fecha2+`) OR fechaco is null)
    ORDER BY fechaco;`;
    
    const result = await query(sql);

    //Retornar datos del usuario

    sql=`SELECT userId,  CONCAT_WS(' ', nombres, apellidos) AS nombre FROM usuario
    WHERE userId=`+usuario+`;`;

    const result3 = await query(sql);

    //Se crea el archivo de Excel
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de bienes Activos');

  
    // Inserta la imagen en la celda A1

    worksheet.addImage({
      path: 'logo.jpg',
      type: 'picture',
      position: {
          type: 'twoCellAnchor',
          from: {
              col: 1, // Columna de la celda
              row: 1, // Fila de la celda
          },
          to: {
            col: 4, // Columna de la celda inferior derecha
            row: 4, // Fila de la celda inferior derecha
        },

      },
      
    });


    // estilo para titulos de columnas de la tabla

    var myStyle = workbook.createStyle({
      font: {
          bold: true,
          
      },
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      },
      alignment: {
        horizontal: 'center',
        shrinkToFit: true,
        wrapText: true
      }
    });

    // estilo para el titulo del reporte
    var myStyle2 = workbook.createStyle({
      font: {
          bold: true,

          size: 20
      }
    });

    // estilo para centrar los datos y colocar bordes
    var myStyle3 = workbook.createStyle({
      alignment: {
        horizontal: 'center',
        shrinkToFit: true,
        wrapText: true
      },
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      }
    });

    // Estilo para colocar bordes
    var myStyle4 = workbook.createStyle({
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      },
      
      alignment: {
          shrinkToFit: true,
          wrapText: true
      }
    });

    //Ancho de la columna "Descripcion"
    worksheet.column(7).setWidth(60);
    //Ancho de la columna "No."
    worksheet.column(1).setWidth(4);

    worksheet.cell(5, 5).string("INVENTARIO GENERAL DE BIENES ACTIVOS ").style(myStyle2);
    worksheet.cell(7, 1).string("Usuario: " + result3[0].nombre);
    worksheet.cell(9, 1).string("Fecha inicio: " + req.query.fecha1);
    worksheet.cell(9, 6).string("Fecha fin: " + req.query.fecha2);
    worksheet.cell(11, 1).string("No.").style(myStyle);
    worksheet.cell(11, 2).string("IdMineco").style(myStyle);
    worksheet.cell(11, 3).string("Cantidad").style(myStyle);
    worksheet.cell(11, 4).string("Marca").style(myStyle);
    worksheet.cell(11, 5).string("Modelo").style(myStyle);
    worksheet.cell(11, 6).string("Serie").style(myStyle);
    worksheet.cell(11, 7).string("Descripcion").style(myStyle);

    //Variable para contar registros

    let Ncontar= 0;

    result.forEach((row, index) => {
      //No.
      Ncontar+=1;
      worksheet.cell(index + 12, 1).number(Ncontar).style(myStyle3);

      //IdMineco
      let cast=""+row.codigo+""
      worksheet.cell(index + 12, 2).string(cast).style(myStyle3);

      //Cantidad
      cast=row.cantidad
      worksheet.cell(index + 12, 3).number(cast).style(myStyle3);

      //Marca
      cast = row.marca+""
      worksheet.cell(index + 12, 4).string(cast).style(myStyle3);

      //Modelo
      cast=""+row.modelo+""
      worksheet.cell(index + 12, 5).string(cast).style(myStyle3);

      //Serie
      cast=""+row.serie+""
      worksheet.cell(index + 12, 6).string(cast).style(myStyle3);

      //Descripcion
      cast=""+row.descripcion+""
      worksheet.cell(index + 12, 7).string(cast).style(myStyle4);
    });


    workbook.writeToBuffer().then((buffer) => {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Reporte de bienes Activos.xlsx');
            res.send(buffer);
        });
    return;
  }catch (error) {
    console.log(error);
    res.json({success: false, message: "Error al descargar"});
    return;
  }

};


//------------------------------------------------ Reporte Bienes fungibles -------------------------------------

exports.excel6 = async (req, res, next) => {

  try{

    let usuario= req.query.usuario;
    let fecha1=`STR_TO_DATE("`+req.query.fecha1+`","%Y-%m-%d")`;
    let fecha2=`STR_TO_DATE("`+req.query.fecha2+`","%Y-%m-%d")`;
    //Retornar datos del bien

    let sql = `SELECT IFNULL(fechaco,'No ingresado') AS fechaco, IFNULL(serie,'No ingresado') AS serie, IFNULL(marca.nombre,'No ingresado') AS marca, IFNULL(modelo,'No ingresado') AS modelo,IFNULL(codigo,'No ingresado') AS codigo,cantidad,descripcion FROM bien
    LEFT JOIN marca ON bien.marca = marca.marcaId
    WHERE bien.categoria=2 and ((fechaco BETWEEN `+fecha1+` and `+fecha2+`) OR fechaco is null)
    ORDER BY fechaco;`;
    
    const result = await query(sql);

    //Retornar datos del usuario

    sql=`SELECT userId,  CONCAT_WS(' ', nombres, apellidos) AS nombre FROM usuario
    WHERE userId=`+usuario+`;`;

    const result3 = await query(sql);

    //Se crea el archivo de Excel
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de bienes Fungibles');

  
    // Inserta la imagen en la celda A1

    worksheet.addImage({
      path: 'logo.jpg',
      type: 'picture',
      position: {
          type: 'twoCellAnchor',
          from: {
              col: 1, // Columna de la celda
              row: 1, // Fila de la celda
          },
          to: {
            col: 4, // Columna de la celda inferior derecha
            row: 4, // Fila de la celda inferior derecha
        },

      },
      
    });


    // estilo para titulos de columnas de la tabla

    var myStyle = workbook.createStyle({
      font: {
          bold: true,
          
      },
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      },
      alignment: {
        horizontal: 'center',
        shrinkToFit: true,
        wrapText: true
      }
    });

    // estilo para el titulo del reporte
    var myStyle2 = workbook.createStyle({
      font: {
          bold: true,

          size: 20
      }
    });

    // estilo para centrar los datos y colocar bordes
    var myStyle3 = workbook.createStyle({
      alignment: {
        horizontal: 'center',
        shrinkToFit: true,
        wrapText: true
      },
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      }
    });

    // Estilo para colocar bordes
    var myStyle4 = workbook.createStyle({
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      },
      
      alignment: {
          shrinkToFit: true,
          wrapText: true
      }
    });

    //Ancho de la columna "Descripcion"
    worksheet.column(7).setWidth(60);
    //Ancho de la columna "No."
    worksheet.column(1).setWidth(4);

    worksheet.cell(5, 5).string("INVENTARIO GENERAL DE BIENES FUNGIBLES ").style(myStyle2);
    worksheet.cell(7, 1).string("Usuario: " + result3[0].nombre);
    worksheet.cell(9, 1).string("Fecha inicio: " + req.query.fecha1);
    worksheet.cell(9, 6).string("Fecha fin: " + req.query.fecha2);
    worksheet.cell(11, 1).string("No.").style(myStyle);
    worksheet.cell(11, 2).string("IdMineco").style(myStyle);
    worksheet.cell(11, 3).string("Cantidad").style(myStyle);
    worksheet.cell(11, 4).string("Marca").style(myStyle);
    worksheet.cell(11, 5).string("Modelo").style(myStyle);
    worksheet.cell(11, 6).string("Serie").style(myStyle);
    worksheet.cell(11, 7).string("Descripcion").style(myStyle);

    //Variable para contar registros

    let Ncontar= 0;

    result.forEach((row, index) => {
      //No.
      Ncontar+=1;
      worksheet.cell(index + 12, 1).number(Ncontar).style(myStyle3);

      //IdMineco
      let cast=""+row.codigo+""
      worksheet.cell(index + 12, 2).string(cast).style(myStyle3);

      //Cantidad
      cast=row.cantidad
      worksheet.cell(index + 12, 3).number(cast).style(myStyle3);

      //Marca
      cast = row.marca+""
      worksheet.cell(index + 12, 4).string(cast).style(myStyle3);

      //Modelo
      cast=""+row.modelo+""
      worksheet.cell(index + 12, 5).string(cast).style(myStyle3);

      //Serie
      cast=""+row.serie+""
      worksheet.cell(index + 12, 6).string(cast).style(myStyle3);

      //Descripcion
      cast=""+row.descripcion+""
      worksheet.cell(index + 12, 7).string(cast).style(myStyle4);
    });


    workbook.writeToBuffer().then((buffer) => {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Reporte de bienes Fungibles.xlsx');
            res.send(buffer);
        });
    return;
  }catch (error) {
    console.log(error);
    res.json({success: false, message: "Error al descargar"});
    return;
  }

};


//------------------------------------------------ Reporte Bienes fungibles -------------------------------------

exports.excel7 = async (req, res, next) => {

  try{

    let usuario = req.query.usuario;
    let fecha1=`STR_TO_DATE("`+req.query.fecha1+`","%Y-%m-%d")`;
    let fecha2=`STR_TO_DATE("`+req.query.fecha2+`","%Y-%m-%d")`;
    let marca =  req.query.marca;
    //Retornar datos del bien

    let sql = `SELECT IFNULL(fechaco,'No ingresado') AS fechaco, IFNULL(serie,'No ingresado') AS serie, IFNULL(marca.nombre,'No ingresado') AS marca, IFNULL(modelo,'No ingresado') AS modelo,IFNULL(codigo,'No ingresado') AS codigo,cantidad,descripcion FROM bien
    LEFT JOIN marca ON bien.marca = marca.marcaId
    WHERE marca.nombre LIKE '%`+marca+`%' and ((fechaco BETWEEN `+fecha1+` and `+fecha2+`) OR fechaco is null)
    ORDER BY fechaco;`;
    
    const result = await query(sql);

    //Retornar datos del usuario

    sql=`SELECT userId,  CONCAT_WS(' ', nombres, apellidos) AS nombre FROM usuario
    WHERE userId=`+usuario+`;`;

    const result3 = await query(sql);

    //Se crea el archivo de Excel
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de bienes Fungibles');

  
    // Inserta la imagen en la celda A1

    worksheet.addImage({
      path: 'logo.jpg',
      type: 'picture',
      position: {
          type: 'twoCellAnchor',
          from: {
              col: 1, // Columna de la celda
              row: 1, // Fila de la celda
          },
          to: {
            col: 4, // Columna de la celda inferior derecha
            row: 4, // Fila de la celda inferior derecha
        },

      },
      
    });


    // estilo para titulos de columnas de la tabla

    var myStyle = workbook.createStyle({
      font: {
          bold: true,
          
      },
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      },
      alignment: {
        horizontal: 'center',
        shrinkToFit: true,
        wrapText: true
      }
    });

    // estilo para el titulo del reporte
    var myStyle2 = workbook.createStyle({
      font: {
          bold: true,

          size: 20
      }
    });

    // estilo para centrar los datos y colocar bordes
    var myStyle3 = workbook.createStyle({
      alignment: {
        horizontal: 'center',
        shrinkToFit: true,
        wrapText: true
      },
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      }
    });

    // Estilo para colocar bordes
    var myStyle4 = workbook.createStyle({
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' }
      },
      
      alignment: {
          shrinkToFit: true,
          wrapText: true
      }
    });

    //Ancho de la columna "Descripcion"
    worksheet.column(7).setWidth(60);
    //Ancho de la columna "No."
    worksheet.column(1).setWidth(4);

    worksheet.cell(5, 5).string("INVENTARIO GENERAL DE BIENES FUNGIBLES ").style(myStyle2);
    worksheet.cell(7, 1).string("Usuario: " + result3[0].nombre);
    worksheet.cell(9, 1).string("Fecha inicio: " + req.query.fecha1);
    worksheet.cell(9, 6).string("Fecha fin: " + req.query.fecha2);
    worksheet.cell(11, 1).string("No.").style(myStyle);
    worksheet.cell(11, 2).string("IdMineco").style(myStyle);
    worksheet.cell(11, 3).string("Cantidad").style(myStyle);
    worksheet.cell(11, 4).string("Marca").style(myStyle);
    worksheet.cell(11, 5).string("Modelo").style(myStyle);
    worksheet.cell(11, 6).string("Serie").style(myStyle);
    worksheet.cell(11, 7).string("Descripcion").style(myStyle);

    //Variable para contar registros

    let Ncontar= 0;

    result.forEach((row, index) => {
      //No.
      Ncontar+=1;
      worksheet.cell(index + 12, 1).number(Ncontar).style(myStyle3);

      //IdMineco
      let cast=""+row.codigo+""
      worksheet.cell(index + 12, 2).string(cast).style(myStyle3);

      //Cantidad
      cast=row.cantidad
      worksheet.cell(index + 12, 3).number(cast).style(myStyle3);

      //Marca
      cast = row.marca+""
      worksheet.cell(index + 12, 4).string(cast).style(myStyle3);

      //Modelo
      cast=""+row.modelo+""
      worksheet.cell(index + 12, 5).string(cast).style(myStyle3);

      //Serie
      cast=""+row.serie+""
      worksheet.cell(index + 12, 6).string(cast).style(myStyle3);

      //Descripcion
      cast=""+row.descripcion+""
      worksheet.cell(index + 12, 7).string(cast).style(myStyle4);
    });


    workbook.writeToBuffer().then((buffer) => {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Reporte de bienes Fungibles.xlsx');
            res.send(buffer);
        });
    return;
  }catch (error) {
    console.log(error);
    res.json({success: false, message: "Error al descargar"});
    return;
  }

};

//------------------------------------- Reporte PDF bienes por empleado --------------------------------------

exports.pdf1 = async (req, res, next) => {

  // Crear una instancia de PDFKit
  const pdf = new PDFDocument({
    layout: 'landscape',
    size: 'LETTER'
  });

  try {
     
     if(req.query.empleado==''){
      res.json({success: false, message: "Error al descargar"});
      return;
    }

    
  // Configurar Headers
  
  res.setHeader('Content-Type', 'application/pdf');
  pdf.pipe(res);

  pdf.image('logo.jpg', {
    fit: [150, 150],
    x: 25,
    y: 20
  });

  // Añadir un espacio
  pdf.moveDown();

  // Añadir un título al PDF
  pdf.fontSize(20).text('REPORTE DE BIENES ASIGNADOS AL EMPLEADO',{
    align: 'center'
  })

  // Añadir un espacio
  pdf.moveDown();


    let empleado= req.query.empleado;
    let usuario= req.query.usuario;

    //Retornar datos del empleado
    let sql1=`SELECT empleadoId,  CONCAT_WS(' ', nombres, apellidos) AS nombre, nit, puesto.nombre as puesto FROM empleado, puesto 
    WHERE empleadoId=`+empleado+` and puesto.puestoId=empleado.puesto;`;
 
    const result1 = await query(sql1);
    
    //Retornar datos del usuario

    let sql2=`SELECT userId,  CONCAT_WS(' ', nombres, apellidos) AS nombre FROM usuario
    WHERE userId=`+usuario+`;`;

    const result2 = await query(sql2);

    // texto
    pdf.fontSize(11).text('Código de empleado: '+result1[0].empleadoId,25,119)

    // texto
    pdf.fontSize(11).text('Nombre de Empleado: '+result1[0].nombre,25,131)

    // texto
    pdf.fontSize(11).text('Nit: '+result1[0].nit,25,143)

    // texto
    pdf.fontSize(11).text('Puesto: '+result1[0].puesto,25,155)

    // texto
    pdf.fontSize(11).text('Usuario: '+result2[0].nombre,25,167)

     // Añadir un espacio
    pdf.moveDown();

  } catch (error) {
    console.log(error);
  }
  // Añadir un espacio
  pdf.moveDown();
  

  // Crear un arreglo con los datos de la tabla
  const data = [
    ['No.','IdMineco','Cantidad','Marca','Modelo','Serie','Ubicacion','Descripcion']
  ];

  // Definir el ancho y el alto de cada celda
  let cellWidth = 80;
  let cellHeight = 30;

  // Definir el punto inicial de la tabla
  let x = 25;
  let y = 200;

  // Recorrer el arreglo de datos
  for (let i = 0; i < data.length; i++) {
    // Recorrer cada fila del arreglo
    for (let j = 0; j < data[i].length; j++) {
      if(data[i][j]=="Cantidad"){
        cellWidth=65
      }else if(data[i][j]=="Descripcion"){
        cellWidth=140
      }else{
        cellWidth=90
      }
      
      // Añadir el texto de la celda
      if(data[i][j]=="No."){
        cellWidth=25
        pdf.font('Helvetica-Bold').fontSize(8).text(data[i][j], x + 5, y + 10, {
          width: cellWidth - 25,
          align: 'center'
        });
      }else{
        pdf.font('Helvetica-Bold').fontSize(8).text(data[i][j], x + 10, y + 10, {
          width: cellWidth - 20,
          align: 'center'
        });
      }

      // Dibujar el borde de la celda
      pdf.rect(x, y, cellWidth, cellHeight).stroke();
      
      // Mover el punto x al siguiente valor
      
      x += cellWidth;
      
    }
    // Restablecer el punto x al valor inicial
    x = 25;
    // Mover el punto y al siguiente valor
    y += cellHeight;
  }
  cellWidth=80

  //Funcion para ajustar el tamaño de las celdas

  function tamano(texto1,texto2,texto3) {

    let texto=(texto1.length > texto2.length) ? texto1 : texto2

    if(texto2.length>texto1.length && texto2.length>texto3.length){
      if(texto.length > 57){

        cellHeight = Math.round((texto.length / 16)*18)
        cellHeight -= Math.round(texto.length / 3)
  
      }else if(texto.length<13){
  
        cellHeight = 20;
  
      }else if(texto.length > 35 && texto.length < 57){
  
        cellHeight=50;
  
      }
      else if(texto.length > 13 && texto.length < 35){
  
        cellHeight=30;
  
      }
      return;
    }
    
    if(texto.length > 57){

      cellHeight = Math.round((texto.length / 16)*18)
      cellHeight -= Math.round(texto.length / 2)

    }else if(texto.length<13){

      cellHeight = 20;

    }else if(texto.length > 32 && texto.length < 57){

      cellHeight=50;

    }
    else if(texto.length > 13 && texto.length < 32){

      cellHeight=30;

    }
    
  }

  //Funcion para agregar celdas
  function celdas(texto) {
    
    // Añadir el texto de la celda
    pdf.rect(x, y, cellWidth, cellHeight).stroke();

    pdf.font('Helvetica').text(texto, x + 5, y + 7, {
      width: cellWidth - 7,
      align: 'left'
    });
    // Mover el punto x al siguiente valor
    x += cellWidth;

  }

  try{
    let empleado= req.query.empleado;
    
    let sql = `SELECT  IFNULL(serie,'No ingresado') AS serie, IFNULL(marca.nombre,'No ingresado') AS marca, IFNULL(modelo,'No ingresado') AS modelo, IFNULL(cuenta,'No ingresado') AS cuenta,IFNULL(codigo,'No ingresado') AS codigo,cantidad,descripcion,IFNULL(ubicacion.nombre,'No ingresado') AS ubicacion,IFNULL(bien.precio,'No ingresado') AS precio FROM bien
    INNER JOIN tarjeta_responsabilidad ON bien.tarjeta=tarjeta_responsabilidad.id and tarjeta_responsabilidad.empleado=`+empleado+`
    LEFT JOIN ubicacion ON bien.ubicacion = ubicacion.id
    LEFT JOIN marca ON bien.marca = marca.marcaId;`;
    
    const result = await query(sql);
    //Variable para contar registros

    let Ncontar= 0;
    // Recorrer cada fila del arreglo
    for (let i = 0; i < result.length; i++) {
      
      tamano(result[i].descripcion+"",result[i].modelo+"",result[i].serie+"")
      // Añadir el texto de la celda
      Ncontar+=1
      cellWidth = 25;
      celdas(Ncontar);
      cellWidth = 90;
      celdas(result[i].codigo)
      cellWidth = 65;
      celdas(result[i].cantidad)
      cellWidth = 90;
      celdas(result[i].marca)
      celdas(result[i].modelo)
      celdas(result[i].serie)
      celdas(result[i].ubicacion)
      cellWidth = 140;
      celdas(result[i].descripcion)
      
      // Restablecer el punto x al valor inicial
      x = 25;
      // Mover el punto y al siguiente valor
      y += cellHeight;

      if(y>450){
        pdf.addPage();
        y=100
      }
    }
    
    // Finalizar el documento
    pdf.end();  
  
  }catch (error) {
    console.log(error);
    res.json({success: false, message: "Error al obtener"});
    return;
  }
}

//------------------------------------- Reporte PDF total de bienes --------------------------------------

exports.pdf2 = async (req, res, next) => {
  
  // Crear una instancia de PDFKit
  const pdf = new PDFDocument({
    layout: 'landscape',
    size: 'A4'
  });
  // Enviar el PDF al cliente
  
  res.setHeader('Content-Type', 'application/pdf');
  pdf.pipe(res);

  pdf.image('logo.jpg', {
    fit: [150, 150],
    x: 25,
    y: 20
  });

  pdf.moveDown();

  // Añadir un título al PDF
  pdf.fontSize(20).text('INVENTARIO GENERAL DE BIENES ACTIVOS Y\n BIENES FUNGIBLES',{
    align: 'center'
  })

  // Añadir un espacio
  pdf.moveDown();

  // Crear un arreglo con los datos de la tabla
  const data = [
    ['No.','Fecha de compra','IdMineco','Cantidad','Marca','Modelo','Serie','Bien asignado A','Tipo de bien','Ubicacion','Descripcion']
  ];

  // Definir el ancho y el alto de cada celda
  let cellWidth = 80;
  let cellHeight = 30;

  // Definir el punto inicial de la tabla
  let x = 25;
  let y = 170;

  // Recorrer el arreglo de datos
  for (let i = 0; i < data.length; i++) {
    // Recorrer cada fila del arreglo
    for (let j = 0; j < data[i].length; j++) {
      if(data[i][j]=="Fecha de compra" || data[i][j]=="IdMineco" || data[i][j]=="Modelo" || data[i][j]=="Serie"){
        cellWidth=90
      }else if(data[i][j]=="Descripcion"){
        cellWidth=140
      }else{
        cellWidth=65
      }
      
      // Añadir el texto de la celda
      if(data[i][j]=="No."){
        cellWidth=25
        pdf.font('Helvetica-Bold').fontSize(8).text(data[i][j], x + 5, y + 10, {
          width: cellWidth - 25,
          align: 'center'
        });
      }else if(data[i][j]=="Cantidad"){
        cellWidth=45
        pdf.font('Helvetica-Bold').fontSize(8).text(data[i][j], x + 5, y + 10, {
          width: cellWidth - 45,
          align: 'center'
        });
      }else if(data[i][j]=="Tipo de bien"){
        cellWidth=35
        pdf.font('Helvetica-Bold').fontSize(8).text(data[i][j], x + 3, y + 10, {
          width: cellWidth - 5,
          align: 'center'
        });
      }else{
        pdf.font('Helvetica-Bold').fontSize(8).text(data[i][j], x + 10, y + 10, {
          width: cellWidth - 20,
          align: 'center'
        });
      }

      // Dibujar el borde de la celda
      pdf.rect(x, y, cellWidth, cellHeight).stroke();
      // Mover el punto x al siguiente valor
      x += cellWidth;
      
    }
    // Restablecer el punto x al valor inicial
    x = 25;
    // Mover el punto y al siguiente valor
    y += cellHeight;
  }

  function tamano(texto1,texto2,texto3) {

    //typeof texto === 'string'
    let calculo =(texto1.length > texto2.length) ? texto1 : texto2
    let texto = (calculo.length > texto3.length) ?  calculo : texto3
    
    if(texto2.length>texto1.length && texto2.length>texto3.length){
      if(texto.length > 57){

        cellHeight = Math.round((texto.length / 16)*18)
        cellHeight -= Math.round(texto.length / 3)
  
      }else if(texto.length<13){
  
        cellHeight = 20;
  
      }else if(texto.length > 35 && texto.length < 57){
  
        cellHeight=50;
  
      }
      else if(texto.length > 13 && texto.length < 35){
  
        cellHeight=30;
  
      }
      return;
    }

    if(texto.length > 57){

      cellHeight = Math.round((texto.length / 16)*18)
      cellHeight -= Math.round(texto.length / 2)

    }else if(texto.length<13){

      cellHeight = 20;

    }else if(texto.length > 35 && texto.length < 57){

      cellHeight=50;

    }
    else if(texto.length > 13 && texto.length < 35){

      cellHeight=30;

    }
    
  }
  //Funcion para agregar celdas
  function celdas(texto) {
    
    // Añadir el texto de la celda
    pdf.rect(x, y, cellWidth, cellHeight).stroke();

    pdf.font('Helvetica').fontSize(8).text(texto, x + 5, y + 7, {
      width: cellWidth - 7,
      align: 'left'
    });
    // Mover el punto x al siguiente valor
    x += cellWidth;

  }


  try{
    
    //Retornar informacion de bienes

    let sql = `SELECT bien.id, IFNULL(CONCAT(e.nombres," ",e.apellidos),'Sin asignar') AS empleado, IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco, IFNULL(marca.nombre,"No ingresado") AS marca, bien.activo, codigo, cantidad, categoria.nombre AS categoria,IFNULL(modelo,"No ingresado") AS modelo,IFNULL(serie,"No ingresado") AS serie, IFNULL(ubicacion.nombre,"No ingresado") AS ubicacion, descripcion FROM bien 
    LEFT JOIN marca ON marca.marcaId=bien.marca 
    LEFT JOIN tarjeta_responsabilidad t ON t.id=bien.tarjeta
	  LEFT JOIN responsable_activo r ON r.tarjeta=t.id and r.bien=bien.id
    LEFT JOIN empleado e ON t.empleado=e.empleadoId
    LEFT JOIN ubicacion ON ubicacion.id=bien.ubicacion
    LEFT JOIN categoria ON categoria.catId=bien.categoria
    WHERE bien.activo=true;`;
    
    const result = await query(sql);

    //Retornar datos del usuario

    let sql2=`SELECT userId,  CONCAT_WS(' ', nombres, apellidos) AS nombre FROM usuario
    WHERE userId=`+req.query.usuario+`;`;

    const result2 = await query(sql2);

    pdf.font('Helvetica').fontSize(11).text('Usuario: '+result2[0].nombre,25,150)

    //Variable para contar registros

    let Ncontar= 0;
    // Recorrer cada fila del arreglo
    for (let i = 0; i < result.length; i++) {

      tamano(result[i].descripcion+"",result[i].modelo+"",result[i].serie+"")
      
      // Añadir el texto de la celda
      Ncontar+=1;
      cellWidth = 25;
      celdas(Ncontar)

      cellWidth = 90;
      celdas(result[i].fechaco)
      celdas(result[i].codigo)
      cellWidth = 45;
      celdas(result[i].cantidad)
      cellWidth = 65;
      celdas(result[i].marca)
      cellWidth = 90;
      celdas(result[i].modelo)
      celdas(result[i].serie)
      cellWidth = 65;
      celdas(result[i].empleado)
      cellWidth = 35;
      celdas(result[i].categoria)
      cellWidth = 65;
      celdas(result[i].ubicacion)
      cellWidth = 140;
      celdas(result[i].descripcion)
      
      // Restablecer el punto x al valor inicial
      x = 25;
      // Mover el punto y al siguiente valor
      y += cellHeight;

      if(y>450){
        pdf.addPage();
        y=100
      }
    }
    
    // Finalizar el documento
    pdf.end();  
  
  }catch (error) {
    console.log(error);
    res.json({success: false, message: "Error al obtener"});
    return;
  }
}
//------------------------------------- Reporte PDF bienes de baja --------------------------------------

exports.pdf3 = async (req, res, next) => {


  // Crear una instancia de PDFKit
  const pdf = new PDFDocument({
    layout: 'landscape',
    size: 'LETTER'
  });
  // Enviar el PDF al cliente
  
  res.setHeader('Content-Type', 'application/pdf');
  pdf.pipe(res);

  pdf.image('logo.jpg', {
    fit: [150, 150],
    x: 25,
    y: 20
  });

  pdf.moveDown();

  // Añadir un título al PDF
  pdf.fontSize(20).text('REPORTE DE BIENES DADOS DE BAJA\n ACTIVOS Y FUNGIBLES',{
    align: 'center'
  })

  // Añadir un espacio
  pdf.moveDown();

  // Crear un arreglo con los datos de la tabla
  const data = [
    ['No.','Fecha de baja','IdMineco','Cantidad','Marca','Modelo','Serie','Descripcion','Ultimo asignado']
  ];

  // Definir el ancho y el alto de cada celda
  let cellWidth = 90;
  let cellHeight = 30;

  // Definir el punto inicial de la tabla
  let x = 25;
  let y = 175;

  // Recorrer el arreglo de datos
  for (let i = 0; i < data.length; i++) {
    // Recorrer cada fila del arreglo
    for (let j = 0; j < data[i].length; j++) {
      if(data[i][j]=="Fecha de baja" || data[i][j]=="IdMineco" || data[i][j]=="Modelo" || data[i][j]=="Serie"){
        cellWidth=90
      }else if(data[i][j]=="Descripcion"){
        cellWidth=140
      }else{
        cellWidth=65
      }
      // Añadir el texto de la celda
      if(data[i][j]=="No."){
        cellWidth=25
        pdf.font('Helvetica-Bold').fontSize(8).text(data[i][j], x + 5, y + 10, {
          width: cellWidth - 25,
          align: 'center'
        });
      }else if(data[i][j]=="Cantidad"){
        cellWidth=45
        pdf.font('Helvetica-Bold').fontSize(8).text(data[i][j], x + 5, y + 10, {
          width: cellWidth - 45,
          align: 'center'
        });
      }else{
        pdf.font('Helvetica-Bold').fontSize(8).text(data[i][j], x + 10, y + 10, {
          width: cellWidth - 20,
          align: 'center'
        });
      }

      // Dibujar el borde de la celda
      pdf.rect(x, y, cellWidth, cellHeight).stroke();
      // Mover el punto x al siguiente valor
      x += cellWidth;
      
    }
    // Restablecer el punto x al valor inicial
    x = 25;
    // Mover el punto y al siguiente valor
    y += cellHeight;
  }
  function tamano(texto1,texto2,texto3) {

    //typeof texto === 'string'
    let calculo =(texto1.length > texto2.length) ? texto1 : texto2
    let texto = (calculo.length > texto3.length) ?  calculo : texto3
    
    if(texto2.length>texto1.length && texto2.length>texto3.length){
      if(texto.length > 57){

        cellHeight = Math.round((texto.length / 16)*18)
        cellHeight -= Math.round(texto.length / 3)
  
      }else if(texto.length<13){
  
        cellHeight = 20;
  
      }else if(texto.length > 35 && texto.length < 57){
  
        cellHeight=50;
  
      }
      else if(texto.length > 13 && texto.length < 35){
  
        cellHeight=30;
  
      }
      return;
    }

    if(texto.length > 57){

      cellHeight = Math.round((texto.length / 16)*18)
      cellHeight -= Math.round(texto.length / 2)

    }else if(texto.length<13){

      cellHeight = 20;

    }else if(texto.length > 35 && texto.length < 57){

      cellHeight=50;

    }
    else if(texto.length > 13 && texto.length < 35){

      cellHeight=30;

    }
    
  }
  //Funcion para agregar celdas
  function celdas(texto) {
    
    // Añadir el texto de la celda
    pdf.rect(x, y, cellWidth, cellHeight).stroke();

    pdf.font('Helvetica').fontSize(8).text(texto, x + 5, y + 7, {
      width: cellWidth - 7,
      align: 'left'
    });
    // Mover el punto x al siguiente valor
    x += cellWidth;

  }

  try{

    //Consulta
    
    let sql = `SELECT bien.id, DATE_FORMAT(r.fecha, '%d/%m/%Y') AS fecha,concat_ws(' ', u.nombres,u.apellidos) AS empleado,codigo,marca.nombre AS marca,modelo,serie,descripcion,
    IFNULL(bien.fecha_mod,"No ingresado") AS fechamod, cantidad FROM responsable_activo r
    INNER JOIN tarjeta_responsabilidad t ON r.tarjeta = t.id
    INNER JOIN bien ON bien.id = r.bien
    INNER JOIN empleado u ON u.empleadoId = t.empleado
    LEFT JOIN marca ON bien.marca = marca.marcaId
    WHERE r.fecha IN (SELECT max(r.fecha) FROM responsable_activo r
    WHERE r.activo=0 and bien.activo=0
    GROUP BY r.bien)
    UNION
    SELECT bien.id,"Sin asignacion","Sin asignacion",codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(bien.fecha_mod,"No ingresado") AS fechamod, cantidad FROM bien
    LEFT JOIN marca ON bien.marca = marca.marcaId
    WHERE bien.activo=0 AND bien.id NOT IN (SELECT r.bien FROM responsable_activo r
    WHERE r.activo=0);`;
    
    const result = await query(sql);

    //Retornar datos del usuario

    let usuario = req.query.usuario; 

    sql=`SELECT userId,  CONCAT_WS(' ', nombres, apellidos) AS nombre FROM usuario
    WHERE userId=`+usuario+`;`;

    const result2 = await query(sql);


    pdf.font('Helvetica').fontSize(11).text('Usuario: '+result2[0].nombre,25,150)

    let Ncontar=0;
    // Recorrer cada fila del arreglo
    for (let i = 0; i < result.length; i++) {

      tamano(result[i].descripcion+"",result[i].modelo+"",result[i].serie+"")
      
      // Añadir el texto de la celda
      Ncontar+=1;
      cellWidth = 25;
      celdas(Ncontar)
      
      cellWidth = 90;
      celdas(result[i].fechamod)
      celdas(result[i].codigo)
      cellWidth = 45;
      celdas(result[i].cantidad)
      cellWidth = 65;
      celdas(result[i].marca)
      cellWidth = 90;
      celdas(result[i].modelo)
      celdas(result[i].serie)
      cellWidth = 140;
      celdas(result[i].descripcion)
      cellWidth = 65;
      celdas(result[i].empleado)
      
      // Restablecer el punto x al valor inicial
      x = 25;
      // Mover el punto y al siguiente valor
      y += cellHeight;

      if(y>400){
        pdf.addPage();
        y=100
      }
    }
    
    // Finalizar el documento
    pdf.end();  
  
  }catch (error) {
    console.log(error);
    res.json({success: false, message: "Error al obtener"});
    return;
  }

};

//------------------------------------- Descargar numero de bienes por usuario --------------------------------------

/*
exports.excel5 = async (req, res, next) => {

  try{

    let sql = `SELECT CONCAT_WS(" ",u.nombres,u.apellidos) as nombre, u.nit, COUNT(bien.id) as cantidad FROM bien, tarjeta_responsabilidad t, empleado u  
    WHERE t.id=bien.tarjeta AND bien.activo=True AND u.empleadoId=t.empleado
    GROUP BY t.empleado;`;
    
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

    worksheet.cell(2, 1).string("Total de bienes por usuario").style(myStyle2);
    worksheet.cell(6, 1).string("Nombre").style(myStyle);
    worksheet.cell(6, 2).string("Usuario").style(myStyle);
    worksheet.cell(6, 3).string("Bienes asignados").style(myStyle);

    result.forEach((row, index) => {
      let cast=""+row.nombre+""
      worksheet.cell(index + 7, 1).string(cast);
      cast=""+row.nit+""
      worksheet.cell(index + 7, 2).string(cast);
      cast=""+row.cantidad+""
      worksheet.cell(index + 7, 3).string(cast);
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
};

*/
//------------------------------------- Descargar bienes por ubicacion --------------------------------------

/*
exports.excel6 = async (req, res, next) => {

  
  try{

    let sql = `SELECT u.nombre, COUNT(bien.id) as cantidad FROM bien, ubicacion u
    WHERE bien.ubicacion=u.id AND bien.activo=True
    GROUP BY u.nombre;`;
    
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

    worksheet.cell(2, 1).string("Total de bienes por Ubicacion").style(myStyle2);
    worksheet.cell(6, 1).string("Ubicacion").style(myStyle);
    worksheet.cell(6, 2).string("Bienes").style(myStyle);

    result.forEach((row, index) => {
      let cast=""+row.nombre+""
      worksheet.cell(index + 7, 1).string(cast);
      cast=""+row.cantidad+""
      worksheet.cell(index + 7, 2).string(cast);
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

};

*/
//------------------------------------- Descargar cantidad de tarjetas por usuario --------------------------------------

/*
exports.excel7 = async (req, res, next) => {

  try{

    let sql = `SELECT CONCAT_WS(" ",u.nombres,u.apellidos) AS nombre, u.nit, COUNT(*) AS tarjetas  FROM empleado u, tarjeta_responsabilidad
    WHERE u.empleadoId=tarjeta_responsabilidad.empleado
    GROUP BY u.empleadoId;`;
    
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

    worksheet.cell(2, 1).string("Cantidad de tarjetas por empleado").style(myStyle2);
    worksheet.cell(6, 1).string("Nombre").style(myStyle);
    worksheet.cell(6, 2).string("Empleado").style(myStyle);
    worksheet.cell(6, 2).string("Tarjetas asignadas").style(myStyle);

    result.forEach((row, index) => {
      let cast=""+row.nombre+""
      worksheet.cell(index + 7, 1).string(cast);
      cast=""+row.nit+""
      worksheet.cell(index + 7, 2).string(cast);
      cast=""+row.tarjetas+""
      worksheet.cell(index + 7, 3).string(cast);
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
};
*/
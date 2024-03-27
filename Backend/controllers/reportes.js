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

    let sql = `SELECT IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco, IFNULL(cuenta,'No ingresado') AS cuenta,IFNULL(codigo,'No ingresado') AS codigo,cantidad,descripcion,IFNULL(ubicacion.nombre,'No ingresado') AS ubicacion,IFNULL(bien.precio,'No ingresado') AS precio FROM bien
    INNER JOIN tarjeta_responsabilidad ON bien.tarjeta=tarjeta_responsabilidad.id and tarjeta_responsabilidad.empleado=`+empleado+`
    LEFT JOIN ubicacion ON bien.ubicacion = ubicacion.id;`;
    
    const result = await query(sql);

    sql=`SELECT empleadoId,  CONCAT_WS(' ', nombres, apellidos) AS nombre FROM empleado WHERE empleadoId=`+empleado+`;`;

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
    worksheet.cell(4, 1).string("Empleado:").style(myStyle);
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

}

//------------------------------------------------ REPORTE EXCEL TOTAL DE BIENES -------------------------------------
exports.excel2 = async (req, res, next) => {
  
  try{

    let sql = `SELECT nit,codigo, marca.nombre as marca,modelo,serie,descripcion,precio FROM bien 
    LEFT JOIN marca ON marca.marcaId=bien.marca 
    LEFT JOIN tarjeta_responsabilidad t ON t.id=bien.tarjeta
    LEFT JOIN empleado ON t.empleado=empleado.empleadoId
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
      if(row.nit){
        cast=""+row.nit+"";
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
}

//------------------------------------------------ DESCARGAR EXCEL bienes de baja -------------------------------------
exports.excel3 = async (req, res, next) => {

  try{

    let sql = `SELECT bien.id, DATE_FORMAT(r.fecha, '%d/%m/%Y') AS fecha,concat_ws(' ', u.nombres,u.apellidos) AS empleado,codigo,marca.nombre AS marca,modelo,serie,descripcion,
    IFNULL(bien.precio,"No ingresado") AS precio FROM responsable_activo r
    INNER JOIN tarjeta_responsabilidad t ON r.tarjeta = t.id
    INNER JOIN bien ON bien.id = r.bien
    INNER JOIN empleado u ON u.empleadoId = t.empleado
    LEFT JOIN marca ON bien.marca = marca.marcaId
    WHERE r.fecha IN (SELECT max(r.fecha) FROM responsable_activo r
    WHERE r.activo=0 and bien.activo=0
    GROUP BY r.bien)
    UNION
    SELECT bien.id,"Sin asignacion","Sin asignacion",codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(precio,"No ingresado") AS precio FROM bien
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
    worksheet.cell(6, 2).string("Empleado").style(myStyle);
    worksheet.cell(6, 3).string("Codigo").style(myStyle);
    worksheet.cell(6, 4).string("Marca").style(myStyle);
    worksheet.cell(6, 5).string("Modelo").style(myStyle);
    worksheet.cell(6, 6).string("Serie").style(myStyle);
    worksheet.cell(6, 7).string("Descripcion").style(myStyle);
    worksheet.cell(6, 8).string("Precio").style(myStyle);

    result.forEach((row, index) => {
      let cast=""+row.fecha+""
      worksheet.cell(index + 7, 1).string(cast);
      cast=""+row.empleado+""
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

};

//------------------------------------------------ DESCARGAR BITACORA -------------------------------------

exports.excel4 = async (req, res, next) => {

  try{

    let sql = `SELECT m.id, DATE_FORMAT(m.fecha, '%d/%m/%Y') as fecha, TIME(m.fecha) as hora,u1.correo as usuario, t.tipo as movimiento, m.afectado as objetivo, COALESCE(u2.nit, bien.codigo) as identificador FROM movimiento_bien m
    INNER JOIN usuario u1 ON u1.userId=m.usuario
    LEFT JOIN empleado u2 ON u2.empleadoId=m.empleado_afectado
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

};

//------------------------------------- Reporte PDF bienes por usuario --------------------------------------

exports.pdf1 = async (req, res, next) => {

  // Crear una instancia de PDFKit
  const pdf = new PDFDocument({
    size: 'LETTER'
  });
  // Enviar el PDF al cliente
  
  res.setHeader('Content-Type', 'application/pdf');
  pdf.pipe(res);

  pdf.image('logo.jpg', {
    fit: [150, 150],
    x: 400,
    y: 20
  });

  pdf.moveDown();

  // Añadir un título al PDF
  pdf.fontSize(20).text('Bienes por empleado',{
    align: 'center'
  })

  // Añadir un espacio
  pdf.moveDown();

  // Crear un arreglo con los datos de la tabla
  const data = [
    ['Fecha_Compra','No.cuenta','Codigo','Cantidad','Descripcion','Ubicacion','Saldo']
  ];

  // Definir el ancho y el alto de cada celda
  let cellWidth = 80;
  let cellHeight = 30;

  // Definir el punto inicial de la tabla
  let x = 25;
  let y = 150;

  // Recorrer el arreglo de datos
  for (let i = 0; i < data.length; i++) {
    // Recorrer cada fila del arreglo
    for (let j = 0; j < data[i].length; j++) {
      if(data[i][j]=="Cantidad"){
        cellWidth=65
      }else if(data[i][j]=="Saldo"){
        cellWidth=70
      }else if(data[i][j]=="Descripcion"){
        cellWidth=105
      }else{
        cellWidth=80
      }
      // Dibujar el borde de la celda
      pdf.rect(x, y, cellWidth, cellHeight).stroke();
      // Añadir el texto de la celda
      
      pdf.font('Helvetica-Bold').fontSize(8).text(data[i][j], x + 10, y + 10, {
        width: cellWidth - 20,
        align: 'center'
      });
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

  function tamano(texto1,texto2) {

   
    let texto=(texto1.length > texto2.length) ? texto1 : texto2
    
    if(texto.length > 57){

      cellHeight = Math.round((texto.length / 16)*18)
      cellHeight -= Math.round(texto.length / 3)

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
    
    let sql = `SELECT IFNULL(DATE_FORMAT(fechaco, '%d/%m/%Y'),'No ingresado') AS fechaco, IFNULL(cuenta,'No ingresado') AS cuenta,IFNULL(codigo,'No ingresado') AS codigo,cantidad,descripcion,IFNULL(ubicacion.nombre,'No ingresado') AS ubicacion,IFNULL(bien.precio,'No ingresado') AS precio FROM bien
    INNER JOIN tarjeta_responsabilidad ON bien.tarjeta=tarjeta_responsabilidad.id and tarjeta_responsabilidad.empleado=`+empleado+`
    LEFT JOIN ubicacion ON bien.ubicacion = ubicacion.id;`;
    
    const result = await query(sql);

   
// Recorrer cada fila del arreglo
    for (let i = 0; i < result.length; i++) {
      
      tamano(result[i].descripcion+"",result[i].ubicacion+"")
      // Añadir el texto de la celda
      celdas(result[i].fechaco)
      celdas(result[i].cuenta)
      celdas(result[i].codigo)
      cellWidth = 65;
      celdas(result[i].cantidad)
      cellWidth = 105;
      celdas(result[i].descripcion)
      cellWidth = 80;
      celdas(result[i].ubicacion)
      cellWidth = 70;
      celdas(result[i].precio)
      cellWidth = 80;
      
      // Restablecer el punto x al valor inicial
      x = 25;
      // Mover el punto y al siguiente valor
      y += cellHeight;

      if(y>600){
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
    size: 'LETTER'
  });
  // Enviar el PDF al cliente
  
  res.setHeader('Content-Type', 'application/pdf');
  pdf.pipe(res);

  pdf.image('logo.jpg', {
    fit: [150, 150],
    x: 400,
    y: 20
  });

  pdf.moveDown();

  // Añadir un título al PDF
  pdf.fontSize(20).text('Bienes por empleado',{
    align: 'center'
  })

  // Añadir un espacio
  pdf.moveDown();

  // Crear un arreglo con los datos de la tabla
  const data = [
    ['Usuario','Codigo','Marca','Modelo','Serie','Descripcion','Saldo']
  ];

  // Definir el ancho y el alto de cada celda
  let cellWidth = 80;
  let cellHeight = 30;

  // Definir el punto inicial de la tabla
  let x = 25;
  let y = 150;

  // Recorrer el arreglo de datos
  for (let i = 0; i < data.length; i++) {
    // Recorrer cada fila del arreglo
    for (let j = 0; j < data[i].length; j++) {
      if(data[i][j]=="Usuario"){
        cellWidth=60
      }else if(data[i][j]=="Descripcion"){
        cellWidth=105
      }else{
        cellWidth=80
      }
      // Dibujar el borde de la celda
      pdf.rect(x, y, cellWidth, cellHeight).stroke();
      // Añadir el texto de la celda
      
      pdf.font('Helvetica-Bold').fontSize(8).text(data[i][j], x + 10, y + 10, {
        width: cellWidth - 20,
        align: 'center'
      });
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
    
    let sql = `SELECT nit,codigo, marca.nombre as marca,modelo,serie,descripcion,precio FROM bien 
    LEFT JOIN marca ON marca.marcaId=bien.marca 
    LEFT JOIN tarjeta_responsabilidad t ON t.id=bien.tarjeta
    LEFT JOIN empleado ON t.empleado=empleado.empleadoId
    WHERE bien.activo=True;`;
    
    const result = await query(sql);

   
// Recorrer cada fila del arreglo
    for (let i = 0; i < result.length; i++) {

      
      tamano(result[i].descripcion+"",result[i].serie+"",result[i].modelo+"")
      
      // Añadir el texto de la celda
      cellWidth = 60;
      celdas(result[i].nit)
      cellWidth = 80;
      celdas(result[i].codigo)
      celdas(result[i].marca)
      celdas(result[i].modelo)
      celdas(result[i].serie)
      cellWidth = 105;
      celdas(result[i].descripcion)
      cellWidth = 80;
      celdas(result[i].precio)
      
      // Restablecer el punto x al valor inicial
      x = 25;
      // Mover el punto y al siguiente valor
      y += cellHeight;

      if(y>600){
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
    size: 'LETTER'
  });
  // Enviar el PDF al cliente
  
  res.setHeader('Content-Type', 'application/pdf');
  pdf.pipe(res);

  pdf.image('logo.jpg', {
    fit: [150, 150],
    x: 400,
    y: 20
  });

  pdf.moveDown();

  // Añadir un título al PDF
  pdf.fontSize(20).text('Bienes de Baja',{
    align: 'center'
  })

  // Añadir un espacio
  pdf.moveDown();

  // Crear un arreglo con los datos de la tabla
  const data = [
    ['Fecha de baja','Empleado','Codigo','Modelo','Serie','Descripcion','Precio']
  ];

  // Definir el ancho y el alto de cada celda
  let cellWidth = 80;
  let cellHeight = 30;

  // Definir el punto inicial de la tabla
  let x = 25;
  let y = 150;

  // Recorrer el arreglo de datos
  for (let i = 0; i < data.length; i++) {
    // Recorrer cada fila del arreglo
    for (let j = 0; j < data[i].length; j++) {
      if(data[i][j]=="Fecha de baja" || data[i][j]=="Empleado" || data[i][j]=="Precio"){
        cellWidth=65
      }else if(data[i][j]=="Descripcion"){
        cellWidth=105
      }else{
        cellWidth=80
      }
      // Dibujar el borde de la celda
      pdf.rect(x, y, cellWidth, cellHeight).stroke();
      // Añadir el texto de la celda
      
      pdf.font('Helvetica-Bold').fontSize(8).text(data[i][j], x + 10, y + 10, {
        width: cellWidth - 20,
        align: 'center'
      });
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
    
    let sql = `SELECT bien.id, DATE_FORMAT(r.fecha, '%d/%m/%Y') AS fecha,u.nit,codigo,marca.nombre AS marca,modelo,serie,descripcion,
    IFNULL(bien.precio,"No ingresado") AS precio FROM responsable_activo r
    INNER JOIN tarjeta_responsabilidad t ON r.tarjeta = t.id
    INNER JOIN bien ON bien.id = r.bien
    INNER JOIN empleado u ON u.empleadoId = t.empleado
    LEFT JOIN marca ON bien.marca = marca.marcaId
    WHERE r.fecha IN (SELECT max(r.fecha) FROM responsable_activo r
    WHERE r.activo=0 and bien.activo=0
    GROUP BY r.bien)
    UNION
    SELECT bien.id,"Sin Asignacion","Sin Asignacion",codigo,marca.nombre AS marca,modelo,serie,descripcion,IFNULL(precio,"No ingresado") AS precio FROM bien
    LEFT JOIN marca ON bien.marca = marca.marcaId
    WHERE bien.activo=0 AND bien.id NOT IN (SELECT r.bien FROM responsable_activo r
    WHERE r.activo=0);`;
    
    const result = await query(sql);

   
// Recorrer cada fila del arreglo
    for (let i = 0; i < result.length; i++) {

      
      tamano(result[i].descripcion+"",result[i].serie+"",result[i].modelo+"")
      
      // Añadir el texto de la celda
      cellWidth = 65;
      celdas(result[i].fecha)
      celdas(result[i].nit)
      cellWidth = 80;
      celdas(result[i].codigo)
      celdas(result[i].modelo)
      celdas(result[i].serie)
      cellWidth = 105;
      celdas(result[i].descripcion)
      cellWidth = 65;
      celdas(result[i].precio)
      
      // Restablecer el punto x al valor inicial
      x = 25;
      // Mover el punto y al siguiente valor
      y += cellHeight;

      if(y>600){
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


//------------------------------------- Descargar bienes por ubicacion --------------------------------------


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


//------------------------------------- Descargar cantidad de tarjetas por usuario --------------------------------------


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
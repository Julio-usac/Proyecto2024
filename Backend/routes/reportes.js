const express = require("express");
const userController = require('../controllers/reportes');
const checkAuth=require('../middleware/check-auth');

const router = express.Router();

router.get("/DescargarReporteUsuario",checkAuth, userController.excel1);
router.get("/DescargarReporteTotal",checkAuth, userController.excel2);
router.get("/DescargarBienesBaja",checkAuth, userController.excel3);
router.get("/DescargarBitacora",checkAuth, userController.excel4);
router.get("/DescargarBienesUsuario",checkAuth, userController.excel5);
router.get("/DescargarBienesUbicacion",checkAuth, userController.excel6);
router.get("/DescargarUsuariosTarjetas",checkAuth, userController.excel7);

router.get("/ReportePDFbienesUsuario",checkAuth, userController.pdf1);
router.get("/ReportePDFbienesTotal",checkAuth, userController.pdf2);
router.get("/ReportePDFbienesBaja",checkAuth, userController.pdf3);


module.exports = router;

const express = require("express");
const userController = require('../controllers/reportes');
const checkAuth=require('../middleware/check-auth');

const router = express.Router();

router.get("/DescargarReporteUsuario",checkAuth, userController.excel1);
router.get("/DescargarReporteTotal",checkAuth, userController.excel2);
router.get("/DescargarBienesBaja",checkAuth, userController.excel3);
router.get("/DescargarBitacora",checkAuth, userController.excel4);

router.get("/DescargarBienesActivos",checkAuth, userController.excel5);
router.get("/DescargarBienesFungibles",checkAuth, userController.excel6);
router.get("/DescargarBienesMarca",checkAuth, userController.excel7);

router.get("/ReportePDFbienesUsuario",checkAuth, userController.pdf1);
router.get("/ReportePDFbienesTotal",checkAuth, userController.pdf2);
router.get("/ReportePDFbienesBaja",checkAuth, userController.pdf3);
router.get("/ReportePDFbienesActivos",checkAuth, userController.pdf4);
router.get("/ReportePDFbienesFungibles",checkAuth, userController.pdf5);
router.get("/ReportePDFMarca",checkAuth, userController.pdf6);


module.exports = router;

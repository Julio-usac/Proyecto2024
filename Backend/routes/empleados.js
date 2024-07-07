const express = require("express");
const userController = require('../controllers/empleados');
const checkAuth=require('../middleware/check-auth');

const router = express.Router();

router.post("/CrearEmpleado", checkAuth,userController.crear);
router.put("/EditarEmpleado", checkAuth,userController.editar);
router.put("/ActualizarEstadoEmpleado", checkAuth,userController.estado);
router.get("/HistorialEmpleado", checkAuth,userController.historial);
router.get("/BuscarEmpleado", checkAuth,userController.buscar);
router.get("/listaPersonal", checkAuth,userController.lista);
router.get("/tarjetasAsignadas/:id", checkAuth,userController.tarjetas);
router.post("/bienAsignado2", checkAuth,userController.asignado2);
router.get("/saldoUsuario", checkAuth,userController.saldo);


module.exports = router;

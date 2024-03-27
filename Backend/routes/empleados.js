const express = require("express");
const userController = require('../controllers/empleados');
const checkAuth=require('../middleware/check-auth');

const router = express.Router();

router.post("/CrearEmpleado", checkAuth,userController.crear);
router.put("/EditarEmpleado", checkAuth,userController.editar);
router.put("/ActualizarEstadoEmpleado", checkAuth,userController.estado);


module.exports = router;

const express = require("express");
const userController = require('../controllers/bitacora');
const checkAuth=require('../middleware/check-auth');

const router = express.Router();

router.post("/IngresarBitacora", checkAuth,userController.ingresar);
router.get("/ObtenerBitacora", checkAuth,userController.obtener);



module.exports = router;

const express = require("express");
const userController = require('../controllers/users');
const checkAuth=require('../middleware/check-auth');

const router = express.Router();

router.post("/Login", userController.login);
router.post("/VerificarPass", checkAuth,userController.comparar);
router.put("/ActualizarPass", checkAuth,userController.actualizar);
router.put("/RestablecerPass", checkAuth,userController.restablecer);


router.get("/listaUsuarios", checkAuth,userController.lista);
router.post("/CrearUsuario", checkAuth,userController.crear);
router.put("/ActualizarEstado", checkAuth,userController.estado);
router.put("/EditarUsuario", checkAuth,userController.editar);
router.delete("/EliminarUsuario/:id", checkAuth,userController.eliminar);
router.get("/ObtenerRoles", checkAuth,userController.Roles);


module.exports = router;

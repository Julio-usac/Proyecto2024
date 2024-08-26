const express = require("express");
const userController = require('../controllers/bienes');
const checkAuth=require('../middleware/check-auth');

const router = express.Router();

//Operaciones

router.post("/InBien", checkAuth,userController.crear);
router.post("/EditarBien", checkAuth,userController.editar);
router.delete("/DardeBaja/:id", checkAuth,userController.baja);
router.put("/RestaurarBien/:id", checkAuth,userController.restaurar);
router.post("/bienAsignado", checkAuth,userController.asignado);
router.post("/AsignarBien", checkAuth,userController.asignar);

//Consultas

router.get("/RetornarImagen/:id", checkAuth,userController.imagen);
router.get("/SinAsignar", checkAuth,userController.sinasignar);
router.get("/BuscarBienes", checkAuth,userController.buscar);
router.get("/DadosdeBaja", checkAuth,userController.buscarbaja);
router.get("/BienesActivos", checkAuth,userController.BienesActivos);
router.get("/BienesFungibles", checkAuth,userController.BienesFungibles);
router.get("/BienesMarca", checkAuth,userController.BienesMarca);
router.get("/ubicacion", checkAuth,userController.BienesUbicacion);
router.get("/tipo", checkAuth,userController.BienesTipo);




module.exports = router;

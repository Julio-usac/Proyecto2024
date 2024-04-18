const express = require("express");
const userController = require('../controllers/bienes');
const checkAuth=require('../middleware/check-auth');

const router = express.Router();

router.post("/InBien", checkAuth,userController.crear);
router.post("/EditarBien", checkAuth,userController.editar);
router.delete("/DardeBaja/:id", checkAuth,userController.baja);

router.get("/BuscarBienes", checkAuth,userController.buscar);
router.get("/DadosdeBaja", checkAuth,userController.buscarbaja);
router.put("/RestaurarBien/:id", checkAuth,userController.restaurar);



module.exports = router;

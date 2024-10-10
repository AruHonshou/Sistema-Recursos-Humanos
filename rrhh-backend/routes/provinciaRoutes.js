const express = require('express');
const router = express.Router();
const provinciaController = require('../controllers/provinciaController');

router.post('/', provinciaController.crearProvincia);
router.get('/', provinciaController.obtenerTodasProvincias);
router.get('/:idProvincia', provinciaController.obtenerProvinciaPorId);
router.put('/:idProvincia', provinciaController.actualizarProvincia);
router.delete('/:idProvincia', provinciaController.eliminarProvincia);

module.exports = router;

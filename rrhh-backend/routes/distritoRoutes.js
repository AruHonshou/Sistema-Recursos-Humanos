const express = require('express');
const router = express.Router();
const distritoController = require('../controllers/distritoController');

router.post('/', distritoController.crearDistrito);
router.get('/', distritoController.obtenerTodosDistritos);
router.get('/:idDistrito/canton/:cantonId/provincia/:provinciaId', distritoController.obtenerDistritoPorId);
router.put('/:idDistrito/canton/:cantonId/provincia/:provinciaId', distritoController.actualizarDistrito);
router.delete('/:idDistrito/canton/:cantonId/provincia/:provinciaId', distritoController.eliminarDistrito);

module.exports = router;

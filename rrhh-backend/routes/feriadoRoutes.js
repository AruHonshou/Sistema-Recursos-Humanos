const express = require('express');
const router = express.Router();
const feriadoController = require('../controllers/feriadoController');

router.post('/', feriadoController.crearFeriado);
router.get('/', feriadoController.obtenerTodosFeriados);
router.get('/:fechaFeriado', feriadoController.obtenerFeriadoPorFecha);
router.put('/:fechaFeriado', feriadoController.actualizarFeriado);
router.delete('/:fechaFeriado', feriadoController.eliminarFeriado);

module.exports = router;

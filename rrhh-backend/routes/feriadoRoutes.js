const express = require('express');
const router = express.Router();
const feriadoController = require('../controllers/feriadoController');

// Crear un nuevo feriado
router.post('/', feriadoController.crearFeriado);

// Obtener un feriado por fecha
router.get('/:fechaFeriado', feriadoController.obtenerFeriadoPorFecha);

// Obtener todos los feriados
router.get('/', feriadoController.obtenerTodosFeriados);

// Actualizar un feriado
router.put('/:fechaFeriado', feriadoController.actualizarFeriado);

// Eliminar un feriado
router.delete('/:fechaFeriado', feriadoController.eliminarFeriado);

module.exports = router;

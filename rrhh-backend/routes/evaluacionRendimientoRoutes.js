// routes/evaluacionRendimientoRoutes.js

const express = require('express');
const router = express.Router();
const evaluacionRendimientoController = require('../controllers/evaluacionRendimientoController');

// Ruta para obtener todas las evaluaciones
router.get('/', evaluacionRendimientoController.leerTodasEvaluaciones);

// Ruta para obtener evaluaciones por idUsuario
router.get('/usuario/:idUsuario', evaluacionRendimientoController.leerEvaluacionesPorUsuario);

// Ruta para registrar una evaluación de rendimiento
router.post('/', evaluacionRendimientoController.registrarEvaluacionRendimientoCompleta);

// Ruta para eliminar una evaluación de rendimiento
router.delete('/', evaluacionRendimientoController.eliminarEvaluacion);

module.exports = router;

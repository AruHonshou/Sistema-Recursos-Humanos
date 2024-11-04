// routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Ruta para verificar marca de inicio
router.get('/verificar-marca-inicio/:idUsuario', dashboardController.verificarMarcaInicio);

// Ruta para verificar marca de salida
router.get('/verificar-marca-salida/:idUsuario', dashboardController.verificarMarcaSalida);

// Ruta para calcular horas extras mensuales
router.get('/horas-extras-mensuales/:idUsuario', dashboardController.calcularHorasExtrasMensuales);

// Nueva ruta para obtener nombre y evaluaciones
router.get('/nombre-evaluaciones/:idUsuario', dashboardController.obtenerNombreYEvaluaciones);

module.exports = router;

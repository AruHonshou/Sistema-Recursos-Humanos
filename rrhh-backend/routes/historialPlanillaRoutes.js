// routes/historialPlanillaRoutes.js

const express = require('express');
const router = express.Router();
const historialPlanillaController = require('../controllers/historialPlanillaController');

// Route to get the complete payroll history
router.get('/', historialPlanillaController.obtenerHistorialPlanilla);

// Route to get payroll history for a specific user
router.get('/:idUsuario', historialPlanillaController.obtenerHistorialPlanillaPorUsuario);

module.exports = router;

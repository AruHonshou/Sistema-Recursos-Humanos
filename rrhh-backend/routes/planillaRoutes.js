// routes/planillaRoutes.js

const express = require('express');
const router = express.Router();
const planillaController = require('../controllers/planillaController');

// Route to calculate payroll in bulk
router.post('/calcular', planillaController.calcularPlanillaMasiva);

// Route to delete payroll by date
router.delete('/eliminar', planillaController.eliminarPlanillaPorFecha);

// Route to read payroll for a specific date
router.get('/:fechaPlanilla', planillaController.leerPlanilla);

// Route to read all payrolls
router.get('/', planillaController.leerTodasPlanillas);

module.exports = router;

// routes/liquidacionesRoutes.js

const express = require('express');
const router = express.Router();
const liquidacionesController = require('../controllers/liquidacionesController');

// Ruta para calcular liquidación
router.post('/calcular', liquidacionesController.calcularLiquidacion);

// Ruta para leer todas las liquidaciones completas
router.get('/completas', liquidacionesController.leerIncapacidadCompleta);

// Ruta para eliminar una liquidación
router.delete('/eliminar/:idEmpleado/:fechaLiquidacion', liquidacionesController.eliminarLiquidacion);

module.exports = router;

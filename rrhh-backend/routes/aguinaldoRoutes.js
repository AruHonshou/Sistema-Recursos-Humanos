// routes/aguinaldoRoutes.js

const express = require('express');
const router = express.Router();
const aguinaldoController = require('../controllers/aguinaldoController');

// Ruta para calcular y registrar el aguinaldo
router.post('/calcular', aguinaldoController.calcularYRegistrarAguinaldo);

// Ruta para obtener el reporte de aguinaldos
router.get('/reporte', aguinaldoController.obtenerReporteAguinaldo);

// Ruta para leer el catálogo de tipos de aguinaldo
router.get('/catalogo', aguinaldoController.leerCatalogoAguinaldo);

// Rutas en aguinaldoRoutes.js
router.delete('/eliminar', aguinaldoController.eliminarAguinaldo);

module.exports = router;

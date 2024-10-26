const express = require('express');
const router = express.Router();
const personaTablaController = require('../controllers/personaTablaController');

// Ruta para obtener los detalles de los empleados
router.get('/', personaTablaController.obtenerDetallesEmpleado);

module.exports = router;

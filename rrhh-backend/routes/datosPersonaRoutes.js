const express = require('express');
const router = express.Router();
const datosPersonaController = require('../controllers/datosPersonaController');

// Ruta para obtener los datos de un empleado por su ID
router.get('/:empleados_idEmpleado', datosPersonaController.obtenerDatos);

module.exports = router;

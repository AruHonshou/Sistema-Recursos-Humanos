const express = require('express');
const router = express.Router();
const incapacidadController = require('../controllers/incapacidadController');

// Crear Incapacidad
router.post('/', incapacidadController.crearIncapacidad);

// Leer Incapacidad por Fecha_Inicio
router.get('/:Fecha_Inicio', incapacidadController.leerIncapacidadPorID);

// Leer Todas las Incapacidades
router.get('/', incapacidadController.leerIncapacidades);

// Actualizar Incapacidad
router.put('/', incapacidadController.actualizarIncapacidad);

// Eliminar Incapacidad por Fecha_Inicio y empleados_idEmpleado
router.delete('/:Fecha_Inicio/:empleados_idEmpleado', incapacidadController.eliminarIncapacidad);

module.exports = router;

// routes/vacacionesRoutes.js

const express = require('express');
const router = express.Router();
const vacacionesController = require('../controllers/vacacionesController');

// Ruta para obtener todas las vacaciones
router.get('/', vacacionesController.obtenerVacaciones);

// Ruta para crear una vacación
router.post('/', vacacionesController.crearVacacion);

// Ruta para obtener las vacaciones de un empleado específico
router.get('/:empleados_idEmpleado', vacacionesController.leerVacacion);

// Ruta para actualizar el estado de una vacación
router.put('/', vacacionesController.actualizarEstadoVacacion);

// Ruta para eliminar una vacación
router.delete('/:Fecha_Inicio/:empleados_idEmpleado', vacacionesController.eliminarVacacion);

module.exports = router;
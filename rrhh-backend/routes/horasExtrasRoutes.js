// routes/horasExtrasRoutes.js

const express = require('express');
const router = express.Router();
const horasExtrasController = require('../controllers/horasExtrasController');

// Ruta para obtener todas las horas extras y detalles
router.get('/', horasExtrasController.leerHorasExtraPersona);

// Ruta para crear una solicitud de horas extras
router.post('/', horasExtrasController.crearHorasExtras);

// Ruta para actualizar el estado de una solicitud de horas extras
router.put('/', horasExtrasController.actualizarEstadoHorasExtras);

// Ruta para eliminar una solicitud de horas extras
router.delete('/:fecha_hora_extra/:empleados_idEmpleado', horasExtrasController.eliminarHorasExtras);

router.get('/usuario/:idusuarios', horasExtrasController.leerHorasExtraPorUsuarioId);

module.exports = router;

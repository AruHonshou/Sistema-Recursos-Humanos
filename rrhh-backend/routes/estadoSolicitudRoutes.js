// routes/estadoSolicitudRoutes.js
const express = require('express');
const router = express.Router();
const estadoSolicitudController = require('../controllers/estadoSolicitudController');

// Rutas para el estado de solicitud
router.post('/', estadoSolicitudController.crearEstadoSolicitud); // Crear un nuevo estado de solicitud
router.get('/', estadoSolicitudController.leerTodosLosEstadosSolicitud); // Leer todos los estados de solicitud
router.get('/:idestado_solicitud', estadoSolicitudController.leerEstadoSolicitudPorID); // Leer un estado de solicitud por ID
router.put('/:idestado_solicitud', estadoSolicitudController.actualizarEstadoSolicitud); // Actualizar un estado de solicitud
router.delete('/:idestado_solicitud', estadoSolicitudController.eliminarEstadoSolicitud); // Eliminar un estado de solicitud

module.exports = router;

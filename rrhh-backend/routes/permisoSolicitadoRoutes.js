// routes/permisoSolicitadoRoutes.js

const express = require('express');
const router = express.Router();
const permisoSolicitadoController = require('../controllers/permisoSolicitadoController');

// Ruta para crear un permiso solicitado
router.post('/', permisoSolicitadoController.crearPermisoSolicitud);

// Ruta para obtener los permisos de un empleado específico
router.get('/:empleados_idEmpleado', permisoSolicitadoController.leerPermisosPorEmpleado);

// Ruta para actualizar el estado de un permiso solicitado
router.put('/', permisoSolicitadoController.actualizarEstadoPermiso);

// Ruta para eliminar un permiso solicitado
router.delete('/:fecha_permiso/:empleados_idEmpleado', permisoSolicitadoController.eliminarPermiso);

// Ruta para mostrar permisos con detalles completos
router.get('/', permisoSolicitadoController.mostrarPermisosDetalles);

router.get('/usuario/:idusuarios', permisoSolicitadoController.mostrarPermisosPorUsuarioId);


module.exports = router;
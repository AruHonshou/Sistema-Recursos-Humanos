const express = require('express');
const router = express.Router();
const permisoSolicitadoController = require('../controllers/permisoSolicitadoController');

router.post('/permisos-solicitados', permisoSolicitadoController.crearPermisoSolicitado);
router.get('/permisos-solicitados/:fecha_permiso/:empleados_idEmpleado', permisoSolicitadoController.leerPermisoSolicitadoPorFechaYEmpleado);
router.get('/permisos-solicitados', permisoSolicitadoController.leerTodosPermisosSolicitados);
router.put('/permisos-solicitados', permisoSolicitadoController.actualizarPermisoSolicitado);
router.delete('/permisos-solicitados/:fecha_permiso/:empleados_idEmpleado', permisoSolicitadoController.eliminarPermisoSolicitado);

module.exports = router;

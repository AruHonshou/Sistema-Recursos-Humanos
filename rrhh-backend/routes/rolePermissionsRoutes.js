// routes/rolePermissionsRoutes.js
const express = require('express');
const router = express.Router();
const rolePermissionsController = require('../controllers/rolePermissionsController');

// Ruta para obtener los permisos de un rol específico
router.get('/:role_id', rolePermissionsController.obtenerRolePermissions);

// Otras rutas
router.post('/', rolePermissionsController.crearRolePermission);
router.put('/rol', rolePermissionsController.actualizarRolePermission);
router.delete('/:id', rolePermissionsController.eliminarRolePermission);
router.get('/', rolePermissionsController.obtenerTodosRolePermissions);
router.put('/', rolePermissionsController.guardarRolePermissions);

module.exports = router;

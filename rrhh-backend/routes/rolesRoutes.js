const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');

router.post('/', rolesController.crearRol);
router.get('/', rolesController.obtenerTodosRoles);
router.get('/:idroles', rolesController.obtenerRolPorId);
router.put('/:idroles', rolesController.actualizarRol);
router.delete('/:idroles', rolesController.eliminarRol);

module.exports = router;

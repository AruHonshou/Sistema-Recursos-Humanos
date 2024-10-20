// routes/empleadoRoutes.js

const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

router.post('/', empleadoController.crearEmpleado);
router.get('/', empleadoController.leerTodosEmpleados);
router.get('/:idEmpleado/:persona_idPersona', empleadoController.leerEmpleadoPorID);
router.put('/', empleadoController.actualizarEmpleado);
router.delete('/:idEmpleado/:persona_idPersona', empleadoController.eliminarEmpleado);

module.exports = router;

// routes/empleadoRoutes.js

const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

router.post('/', empleadoController.crearEmpleado);
router.get('/', empleadoController.leerTodosEmpleados);
router.get('/:idEmpleado/:persona_idPersona', empleadoController.leerEmpleadoPorID);
router.put('/', empleadoController.actualizarEmpleado);
router.delete('/:idEmpleado/:persona_idPersona', empleadoController.eliminarEmpleado);
// Ruta para obtener todos los empleados con nombre completo
router.get('/nombre-completo', empleadoController.leerEmpleadosConNombreCompleto);

module.exports = router;

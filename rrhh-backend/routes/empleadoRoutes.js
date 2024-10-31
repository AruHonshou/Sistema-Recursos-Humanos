// routes/empleadoRoutes.js

const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

// Ruta para obtener un empleado por idUsuario (colocada antes para evitar confusión)
router.get('/usuario/:idUsuario', empleadoController.leerEmpleadoPorIdUsuario);

// Otras rutas
router.get('/:idEmpleado/:persona_idPersona', empleadoController.leerEmpleadoPorID);
router.post('/', empleadoController.crearEmpleado);
router.get('/', empleadoController.leerTodosEmpleados);
router.put('/', empleadoController.actualizarEmpleado);
router.delete('/:idEmpleado/:persona_idPersona', empleadoController.eliminarEmpleado);
router.get('/nombre-completo', empleadoController.leerEmpleadosConNombreCompleto);

module.exports = router;

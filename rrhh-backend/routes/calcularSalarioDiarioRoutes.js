const express = require('express');
const router = express.Router();
const calcularSalarioDiarioController = require('../controllers/calcularSalarioDiarioController');

// Ruta para calcular el salario diario de un empleado por su ID
router.get('/:empleados_idEmpleado', calcularSalarioDiarioController.calcularSalarioDiario);

module.exports = router;

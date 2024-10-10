const express = require('express');
const router = express.Router();
const puestoLaboralController = require('../controllers/puestoLaboralController');

router.post('/', puestoLaboralController.crearPuestoLaboral);
router.get('/', puestoLaboralController.obtenerTodosPuestosLaborales);
router.get('/:idpuesto_laboral', puestoLaboralController.obtenerPuestoLaboralPorId);
router.put('/:idpuesto_laboral', puestoLaboralController.actualizarPuestoLaboral);
router.delete('/:idpuesto_laboral', puestoLaboralController.eliminarPuestoLaboral);

module.exports = router;

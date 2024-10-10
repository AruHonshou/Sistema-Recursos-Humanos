const express = require('express');
const router = express.Router();
const tipoHorarioController = require('../controllers/tipoHorarioController');

router.post('/', tipoHorarioController.crearTipoHorario);
router.get('/', tipoHorarioController.obtenerTodosTiposHorario);
router.get('/:idtipo_horario', tipoHorarioController.obtenerTipoHorarioPorId);
router.put('/:idtipo_horario', tipoHorarioController.actualizarTipoHorario);
router.delete('/:idtipo_horario', tipoHorarioController.eliminarTipoHorario);

module.exports = router;

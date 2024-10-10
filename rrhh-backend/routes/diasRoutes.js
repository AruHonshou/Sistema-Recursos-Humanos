const express = require('express');
const router = express.Router();
const diasController = require('../controllers/diasController');

router.post('/', diasController.crearDia);
router.get('/', diasController.obtenerTodosDias);
router.get('/:idDia', diasController.obtenerDiaPorId);
router.put('/:idDia', diasController.actualizarDia);
router.delete('/:idDia', diasController.eliminarDia);

module.exports = router;

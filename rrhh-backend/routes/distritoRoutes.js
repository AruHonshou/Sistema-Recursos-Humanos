const express = require('express');
const router = express.Router();
const distritoController = require('../controllers/distritoController');

router.post('/', distritoController.crearDistrito);
router.get('/', distritoController.obtenerTodosDistritos);
router.get('/:idDistrito/canton/:cantonId/provincia/:provinciaId', distritoController.obtenerDistritoPorId);
router.put('/:idDistrito/canton/:cantonId/provincia/:provinciaId', distritoController.actualizarDistrito);
router.delete('/:idDistrito/canton/:cantonId/provincia/:provinciaId', distritoController.eliminarDistrito);
router.get('/api/distritos', async (req, res) => {
    const { cantonId } = req.query;
    // Lógica para obtener solo los distritos del cantón indicado.
});

module.exports = router;

const express = require('express');
const router = express.Router();
const cantonController = require('../controllers/cantonController');

router.post('/', cantonController.crearCanton);
router.get('/', cantonController.obtenerTodosCantones);
router.get('/:idCanton/provincia/:provinciaId', cantonController.obtenerCantonPorId);
router.put('/:idCanton/provincia/:provinciaId', cantonController.actualizarCanton);
router.delete('/:idCanton/provincia/:provinciaId', cantonController.eliminarCanton);
router.get('/api/cantones', async (req, res) => {
    const { provinciaId } = req.query;
    // Lógica para obtener solo los cantones de la provincia indicada.
});

module.exports = router;

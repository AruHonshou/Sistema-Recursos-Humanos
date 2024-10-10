const express = require('express');
const router = express.Router();
const catalogoTipoLiquidacionController = require('../controllers/catalogoTipoLiquidacionController');

router.post('/', catalogoTipoLiquidacionController.crearTipoLiquidacion);
router.get('/', catalogoTipoLiquidacionController.obtenerTodosTiposLiquidacion);
router.get('/:idcatalogo_tipo_liquidacion', catalogoTipoLiquidacionController.obtenerTipoLiquidacionPorId);
router.put('/:idcatalogo_tipo_liquidacion', catalogoTipoLiquidacionController.actualizarTipoLiquidacion);
router.delete('/:idcatalogo_tipo_liquidacion', catalogoTipoLiquidacionController.eliminarTipoLiquidacion);

module.exports = router;

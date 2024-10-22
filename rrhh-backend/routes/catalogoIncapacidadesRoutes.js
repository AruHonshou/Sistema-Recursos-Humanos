const express = require('express');
const router = express.Router();
const catalogoIncapacidadesController = require('../controllers/catalogoIncapacidadesController');

// Crear Incapacidad
router.post('/', catalogoIncapacidadesController.crearIncapacidad);
router.get('/:id', catalogoIncapacidadesController.leerIncapacidadPorID);
router.get('/', catalogoIncapacidadesController.leerTodasIncapacidades);
router.put('/', catalogoIncapacidadesController.actualizarIncapacidad);
router.delete('/:id', catalogoIncapacidadesController.eliminarIncapacidad);

module.exports = router;

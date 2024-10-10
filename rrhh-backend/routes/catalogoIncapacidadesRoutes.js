const express = require('express');
const router = express.Router();
const catalogoIncapacidadesController = require('../controllers/catalogoIncapacidadesController');

// Crear Incapacidad
router.post('/', catalogoIncapacidadesController.crearIncapacidad);

// Leer Incapacidad por ID
router.get('/:id', catalogoIncapacidadesController.leerIncapacidadPorID);

// Leer Todas las Incapacidades
router.get('/', catalogoIncapacidadesController.leerTodasIncapacidades);

// Actualizar Incapacidad
router.put('/', catalogoIncapacidadesController.actualizarIncapacidad);

// Eliminar Incapacidad
router.delete('/:id', catalogoIncapacidadesController.eliminarIncapacidad);

module.exports = router;

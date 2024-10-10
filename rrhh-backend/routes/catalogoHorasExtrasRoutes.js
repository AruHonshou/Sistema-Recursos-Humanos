const express = require('express');
const router = express.Router();
const catalogoHorasExtrasController = require('../controllers/catalogoHorasExtrasController');

// Crear Horas Extras
router.post('/', catalogoHorasExtrasController.crearHorasExtras);

// Leer Horas Extras por ID
router.get('/:id', catalogoHorasExtrasController.leerHorasExtrasPorID);

// Leer Todas las Horas Extras
router.get('/', catalogoHorasExtrasController.leerTodasHorasExtras);

// Actualizar Horas Extras
router.put('/', catalogoHorasExtrasController.actualizarHorasExtras);

// Eliminar Horas Extras
router.delete('/:id', catalogoHorasExtrasController.eliminarHorasExtras);

module.exports = router;

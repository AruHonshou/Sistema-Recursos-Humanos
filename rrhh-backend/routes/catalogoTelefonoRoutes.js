// routes/catalogoTelefonoRoutes.js

const express = require('express');
const router = express.Router();
const catalogoTelefonoController = require('../controllers/catalogoTelefonoController');

// Ruta para insertar un catálogo de teléfono
router.post('/', catalogoTelefonoController.insertarCatalogoTelefono);

// Ruta para obtener todos los teléfonos del catálogo
router.get('/', catalogoTelefonoController.obtenerCatalogoTelefonos);

// Ruta para obtener un teléfono por ID
router.get('/:idCatalogo_Telefono', catalogoTelefonoController.obtenerCatalogoTelefonoPorID);

// Ruta para actualizar un teléfono
router.put('/', catalogoTelefonoController.actualizarCatalogoTelefono);

// Ruta para eliminar un teléfono
router.delete('/:idCatalogo_Telefono', catalogoTelefonoController.eliminarCatalogoTelefono);

module.exports = router;

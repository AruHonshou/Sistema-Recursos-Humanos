// routes/catalogoTelefonoRoutes.js

const express = require('express');
const router = express.Router();
const catalogoTelefonoController = require('../controllers/catalogoTelefonoController');

// Ruta para insertar un catálogo de teléfono
router.post('/', catalogoTelefonoController.insertarCatalogoTelefono);
router.get('/', catalogoTelefonoController.obtenerCatalogoTelefonos);
router.get('/:idCatalogo_Telefono', catalogoTelefonoController.obtenerCatalogoTelefonoPorID);
router.put('/', catalogoTelefonoController.actualizarCatalogoTelefono);
router.delete('/:idCatalogo_Telefono', catalogoTelefonoController.eliminarCatalogoTelefono);

module.exports = router;

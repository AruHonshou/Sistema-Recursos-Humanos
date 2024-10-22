// routes/catalogoPersonaRoutes.js

const express = require('express');
const router = express.Router();
const catalogoPersonaController = require('../controllers/catalogoPersonaController');

router.post('/', catalogoPersonaController.insertarCatalogoPersona);
router.get('/', catalogoPersonaController.obtenerCatalogoPersonas);
router.get('/:idCatalogo_Persona', catalogoPersonaController.obtenerCatalogoPersonaPorID);
router.put('/', catalogoPersonaController.actualizarCatalogoPersona);
router.delete('/:idCatalogo_Persona', catalogoPersonaController.eliminarCatalogoPersona);

module.exports = router;

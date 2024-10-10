// routes/catalogoPersonaRoutes.js

const express = require('express');
const router = express.Router();
const catalogoPersonaController = require('../controllers/catalogoPersonaController');

// Ruta para insertar un catálogo de persona
router.post('/', catalogoPersonaController.insertarCatalogoPersona);

// Ruta para obtener todas las personas del catálogo
router.get('/', catalogoPersonaController.obtenerCatalogoPersonas);

// Ruta para obtener una persona por ID
router.get('/:idCatalogo_Persona', catalogoPersonaController.obtenerCatalogoPersonaPorID);

// Ruta para actualizar una persona
router.put('/', catalogoPersonaController.actualizarCatalogoPersona);

// Ruta para eliminar una persona
router.delete('/:idCatalogo_Persona', catalogoPersonaController.eliminarCatalogoPersona);

module.exports = router;

// routes/catalogoCorreoRoutes.js

const express = require('express');
const router = express.Router();
const catalogoCorreoController = require('../controllers/catalogoCorreoController');

// Ruta para insertar un catálogo de correo
router.post('/', catalogoCorreoController.insertarCatalogoCorreo);

// Ruta para obtener todos los correos del catálogo
router.get('/', catalogoCorreoController.obtenerCatalogoCorreos);

// Ruta para obtener un correo por ID
router.get('/:idCatalogo_Correo', catalogoCorreoController.obtenerCatalogoCorreoPorID);

// Ruta para actualizar un correo
router.put('/', catalogoCorreoController.actualizarCatalogoCorreo);

// Ruta para eliminar un correo
router.delete('/:idCatalogo_Correo', catalogoCorreoController.eliminarCatalogoCorreo);

module.exports = router;

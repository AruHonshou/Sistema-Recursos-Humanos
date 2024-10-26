const express = require('express');
const router = express.Router();
const personaController = require('../controllers/personaController');

// Crear una nueva persona
router.post('/', personaController.crearPersona);

// Obtener todas las personas
router.get('/', personaController.obtenerTodasPersonas);

// Obtener una persona por ID
router.get('/:idPersona', personaController.obtenerPersonaPorId);

// Actualizar una persona
router.put('/:idPersona', personaController.actualizarPersona);

// Eliminar una persona
router.delete('/:idPersona', personaController.eliminarPersona);

// Actualizar el estado de Usuario_Activo
router.put('/:idPersona/estado', personaController.actualizarUsuarioActivo);



module.exports = router;

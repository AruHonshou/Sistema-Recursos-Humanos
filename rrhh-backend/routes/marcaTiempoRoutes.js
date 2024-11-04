// routes/marcaTiempoRoutes.js

const express = require('express');
const router = express.Router();
const marcaTiempoController = require('../controllers/marcaTiempoController');

// Ruta para registrar la marca de inicio de jornada
router.post('/inicio', marcaTiempoController.registrarMarcaInicio);

// Ruta para registrar la marca de salida de jornada
router.post('/salida', marcaTiempoController.registrarMarcaSalida);

// Ruta para verificar la marca de inicio
router.post('/verificar-inicio', marcaTiempoController.verificarMarcaInicio);

// Ruta para verificar la marca de salida
router.post('/verificar-salida', marcaTiempoController.verificarMarcaSalida);

// Ruta para actualizar una marca de tiempo
router.put('/actualizar', marcaTiempoController.actualizarMarcaTiempo);

// Ruta para eliminar una marca de tiempo
router.delete('/eliminar/:idEmpleado/:Fecha/:TipoMovimiento', marcaTiempoController.eliminarMarcaTiempo);

// Ruta para leer todas las marcas de tiempo
router.get('/', marcaTiempoController.leerTodasMarcas);

// Ruta para leer todas las marcas de tiempo de todas las personas
router.get('/todas-marcas-persona', marcaTiempoController.leerTodasMarcasPersona);

// Ruta para leer todas las marcas de tiempo por idUsuario
router.get('/marcas-persona/:idUsuario', marcaTiempoController.leerTodasMarcasPorIdUsuario);

// Ruta para justificar tardanza en la entrada
router.post('/justificar-entrada', marcaTiempoController.justificarTardanzaEntrada);

// Ruta para justificar tardanza en la salida
router.post('/justificar-salida', marcaTiempoController.justificarTardanzaSalida);


module.exports = router;

const express = require('express');
const router = express.Router();
const mapeoDireccionController = require('../controllers/mapeoDireccionController');

// Ruta para obtener cantones por provincia
router.get('/cantones/:provinciaId', mapeoDireccionController.obtenerCantonesPorProvincia);

// Ruta para obtener distritos por provincia y cantón
router.get('/distritos/:provinciaId/:cantonId', mapeoDireccionController.obtenerDistritosPorProvinciaYCanton);

module.exports = router;

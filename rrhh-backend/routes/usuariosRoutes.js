const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Ruta para autenticar usuario
router.post('/autenticar', usuariosController.autenticarUsuario);

module.exports = router;

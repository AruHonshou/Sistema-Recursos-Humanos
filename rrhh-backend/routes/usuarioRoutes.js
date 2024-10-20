const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/usuarios', usuarioController.crearUsuario);
router.get('/usuarios/:idusuarios', usuarioController.leerUsuarioPorID);
router.get('/usuarios', usuarioController.leerTodosUsuarios);
router.put('/usuarios', usuarioController.actualizarUsuario);
router.delete('/usuarios/:idusuarios', usuarioController.eliminarUsuario);

module.exports = router;

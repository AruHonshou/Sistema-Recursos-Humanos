// routes/catalogoPermisoRoutes.js

const express = require('express');
const router = express.Router();
const catalogoPermisoController = require('../controllers/catalogoPermisoController');

router.post('/', catalogoPermisoController.insertarCatalogoPermiso);
router.get('/', catalogoPermisoController.obtenerCatalogoPermisos);
router.get('/:idCatalogo_Permiso', catalogoPermisoController.obtenerCatalogoPermisoPorID);
router.put('/', catalogoPermisoController.actualizarCatalogoPermiso);
router.delete('/:idCatalogo_Permiso', catalogoPermisoController.eliminarCatalogoPermiso);

module.exports = router;

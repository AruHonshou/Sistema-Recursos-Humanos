// controllers/rolePermissionsController.js
const db = require('../config/db');

// Crear un nuevo permiso
async function crearRolePermission(req, res) {
    const { role_id, page_path, has_access } = req.body;
    try {
        await db.query('CALL CrearRolePermission(?, ?, ?)', [role_id, page_path, has_access]);
        res.status(201).json({ mensaje: 'Permiso creado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el permiso' });
    }
}

// Obtener permisos de un rol específico
async function obtenerRolePermissions(req, res) {
    const { role_id } = req.params;
    try {
        const [rows] = await db.query('CALL LeerRolePermissionsPorRoleId(?)', [role_id]);
        res.status(200).json(rows[0]); // Selecciona el primer conjunto de resultados
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los permisos' });
    }
}

// Actualizar un permiso
async function actualizarRolePermission(req, res) {
    const { id, has_access } = req.body;
    try {
        await db.query('CALL ActualizarRolePermission(?, ?)', [id, has_access]);
        res.status(200).json({ mensaje: 'Permiso actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el permiso' });
    }
}

// Eliminar un permiso
async function eliminarRolePermission(req, res) {
    const { id } = req.params;
    try {
        await db.query('CALL EliminarRolePermission(?)', [id]);
        res.status(200).json({ mensaje: 'Permiso eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el permiso' });
    }
}

// Obtener todos los permisos
async function obtenerTodosRolePermissions(req, res) {
    try {
        const [rows] = await db.query('CALL LeerTodosRolePermissions()');
        res.status(200).json(rows[0]); // Selecciona el primer conjunto de resultados
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener todos los permisos' });
    }
}

// Guardar permisos actualizados para un rol
async function guardarRolePermissions(req, res) {
    const { role_id, permissions } = req.body;
    try {
        await db.query('CALL GuardarRolePermissions(?, ?)', [role_id, JSON.stringify(permissions)]);
        res.status(200).json({ mensaje: 'Permisos actualizados exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar los permisos' });
    }
}

module.exports = {
    crearRolePermission,
    obtenerRolePermissions,
    actualizarRolePermission,
    eliminarRolePermission,
    obtenerTodosRolePermissions,
    guardarRolePermissions
};
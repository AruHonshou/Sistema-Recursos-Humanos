// controllers/permisoSolicitadoController.js

const db = require('../config/db');

// Función para crear un permiso solicitado
async function crearPermisoSolicitud(req, res) {
    const { fecha_permiso, detalle_permiso, fecha_solicitud, con_gose, catalogo_permiso_id, empleados_idEmpleado, horas_permiso } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [result] = await connection.query(
            'CALL CrearPermisoSolicitud(?, ?, ?, ?, ?, ?, ?, @resultado)',
            [fecha_permiso, detalle_permiso, fecha_solicitud, con_gose, catalogo_permiso_id, empleados_idEmpleado, horas_permiso]
        );

        const [[{ "@resultado": mensaje }]] = await connection.query('SELECT @resultado');
        await connection.commit();
        res.status(201).json({ mensaje });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al crear el permiso' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para leer permisos por empleado
async function leerPermisosPorEmpleado(req, res) {
    const { empleados_idEmpleado } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerPermisosPorEmpleadoSolicitud(?)', [empleados_idEmpleado]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los permisos del empleado' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para actualizar el estado de un permiso solicitado
async function actualizarEstadoPermiso(req, res) {
    const { fecha_permiso, empleados_idEmpleado, estado_solicitud_id } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [result] = await connection.query(
            'CALL ActualizarEstadoPermisoSolicitud(?, ?, ?, @resultado)',
            [fecha_permiso, empleados_idEmpleado, estado_solicitud_id]
        );

        const [[{ "@resultado": mensaje }]] = await connection.query('SELECT @resultado');
        await connection.commit();
        res.status(200).json({ mensaje });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el estado del permiso' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para eliminar un permiso solicitado
async function eliminarPermiso(req, res) {
    const { fecha_permiso, empleados_idEmpleado } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [result] = await connection.query(
            'CALL EliminarPermisoSolicitud(?, ?, @resultado)',
            [fecha_permiso, empleados_idEmpleado]
        );

        const [[{ "@resultado": mensaje }]] = await connection.query('SELECT @resultado');
        await connection.commit();
        res.status(200).json({ mensaje });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el permiso' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para mostrar permisos con detalles completos
async function mostrarPermisosDetalles(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL MostrarPermisosDetalles()');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los permisos con detalles completos' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    crearPermisoSolicitud,
    leerPermisosPorEmpleado,
    actualizarEstadoPermiso,
    eliminarPermiso,
    mostrarPermisosDetalles
};
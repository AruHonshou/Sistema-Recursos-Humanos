// controllers/horasExtrasController.js

const db = require('../config/db');

// Función para obtener todas las horas extras y detalles
async function leerHorasExtraPersona(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerHorasExtraPersona()');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las horas extras' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para crear una solicitud de horas extras
async function crearHorasExtras(req, res) {
    const { fecha_hora_extra, empleados_idEmpleado, cantidad_horas, hora_inicio, hora_final } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL CrearSolicitudHorasExtras(?, ?, ?, ?, ?)',
            [fecha_hora_extra, empleados_idEmpleado, cantidad_horas, hora_inicio, hora_final]
        );

        await connection.commit();
        res.status(201).json({ mensaje: 'Solicitud de horas extras creada exitosamente' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al crear la solicitud de horas extras' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para actualizar el estado de una solicitud de horas extras
async function actualizarEstadoHorasExtras(req, res) {
    const { fecha_hora_extra, empleados_idEmpleado, estado_solicitud_idestado_solicitud } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL ActualizarEstadoSolicitudHorasExtras(?, ?, ?)',
            [fecha_hora_extra, empleados_idEmpleado, estado_solicitud_idestado_solicitud]
        );

        await connection.commit();
        res.status(200).json({ mensaje: 'Estado de la solicitud de horas extras actualizado exitosamente' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error en el servidor:', error);
        res.status(500).json({ error: 'Error al actualizar el estado de la solicitud de horas extras' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para eliminar una solicitud de horas extras
async function eliminarHorasExtras(req, res) {
    const { fecha_hora_extra, empleados_idEmpleado } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL EliminarSolicitudHorasExtras(?, ?)',
            [fecha_hora_extra, empleados_idEmpleado]
        );

        await connection.commit();
        res.status(200).json({ mensaje: 'Solicitud de horas extras eliminada exitosamente' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la solicitud de horas extras' });
    } finally {
        if (connection) connection.release();
    }
}

async function leerHorasExtraPorUsuarioId(req, res) {
    const { idusuarios } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerHorasExtraPersonaPorUsuarioId(?)', [idusuarios]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las horas extra del usuario' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    leerHorasExtraPersona,
    crearHorasExtras,
    actualizarEstadoHorasExtras,
    eliminarHorasExtras,
    leerHorasExtraPorUsuarioId
};

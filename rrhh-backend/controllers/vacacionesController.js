// controllers/vacacionesController.js

const db = require('../config/db');

// Función para obtener todas las vacaciones
async function obtenerVacaciones(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL VacacionTabla()');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las vacaciones' });
    } finally {
        if (connection) connection.release();
    }
}


async function crearVacacion(req, res) {
    const { Fecha_Inicio, Fecha_Fin, Cantidad_Dias_Solicitados, Fecha_Solicitud, Motivo_Vacacion, empleados_idEmpleado } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL CrearVacacion(?, ?, ?, ?, ?, ?)',
            [Fecha_Inicio, Fecha_Fin, Cantidad_Dias_Solicitados, Fecha_Solicitud, Motivo_Vacacion, empleados_idEmpleado]
        );

        await connection.commit();
        res.status(201).json({ mensaje: 'Vacación solicitada' }); // Success message
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);

        // Specific error handling
        if (error.message.includes('el empleado no tiene suficientes días disponibles')) {
            res.status(400).json({ error: 'No se puede crear la vacación porque el empleado no tiene suficientes días disponibles' });
        } else if (error.message.includes('hay un día feriado de por medio')) {
            res.status(400).json({ error: 'No se puede crear la vacación porque hay un día feriado de por medio' });
        } else if (error.message.includes('la fecha de fin es menor que la fecha de inicio')) {
            res.status(400).json({ error: 'No se puede crear la vacación porque la fecha de fin es menor que la fecha de inicio' });
        } else if (error.message.includes('el empleado está inactivo')) {
            res.status(400).json({ error: 'No se puede crear la vacación porque el empleado está inactivo' });
        } else if (error.message.includes('Ya tiene vacaciones solicitadas para estos días')) {
            res.status(400).json({ error: 'Ya tiene vacaciones solicitadas para estos días' });
        } else {
            res.status(500).json({ error: 'Error al crear la vacación' });
        }
    } finally {
        if (connection) connection.release();
    }
}





// Función para leer las vacaciones de un empleado específico
async function leerVacacion(req, res) {
    const { empleados_idEmpleado } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerVacacion(?)', [empleados_idEmpleado]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las vacaciones del empleado' });
    } finally {
        if (connection) connection.release();
    }
}

async function actualizarEstadoVacacion(req, res) {
    const { Fecha_Inicio, empleados_idEmpleado, estado_solicitud_idestado_solicitud } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL ActualizarEstadoVacacion(?, ?, ?)',
            [Fecha_Inicio, empleados_idEmpleado, estado_solicitud_idestado_solicitud]
        );

        await connection.commit();

        // Mensajes de respuesta según el estado
        let mensaje;
        if (estado_solicitud_idestado_solicitud === 1) {
            mensaje = 'Solicitud aceptada correctamente';
        } else if (estado_solicitud_idestado_solicitud === 2) {
            mensaje = 'Solicitud rechazada correctamente';
        }

        res.status(200).json({ mensaje });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);

        // Manejo específico de errores
        if (error.message.includes('No puedes cambiar el estado de la solicitud')) {
            res.status(400).json({ error: 'La solicitud ya fue aceptada o rechazada y no se puede modificar nuevamente.' });
        } else if (error.message.includes('el empleado no tiene suficientes días disponibles')) {
            res.status(400).json({ error: 'El empleado no tiene suficientes días disponibles para aprobar esta solicitud.' });
        } else {
            res.status(500).json({ error: 'Error al actualizar el estado de la vacación' });
        }
    } finally {
        if (connection) connection.release();
    }
}



// Función para eliminar una vacación
async function eliminarVacacion(req, res) {
    const { Fecha_Inicio, empleados_idEmpleado } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL EliminarVacacion(?, ?)',
            [Fecha_Inicio, empleados_idEmpleado]
        );

        await connection.commit();
        res.status(200).json({ mensaje: 'Vacación eliminada exitosamente' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la vacación' });
    } finally {
        if (connection) connection.release();
    }
}

async function obtenerVacacionesPorUsuario(req, res) {
    const { idusuarios } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL VacacionTablaPorUsuario(?)', [idusuarios]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las vacaciones para el usuario' });
    } finally {
        if (connection) connection.release();
    }
}

// Function to get available and consumed vacation days for a user
async function obtenerDiasDelEmpleadoVacacion(req, res) {
    const { idusuarios } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL DiasDelEmpleadoVacacion(?)', [idusuarios]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los días de vacaciones del empleado' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    obtenerVacaciones,
    crearVacacion,
    leerVacacion,
    actualizarEstadoVacacion,
    eliminarVacacion,
    obtenerVacacionesPorUsuario,
    obtenerDiasDelEmpleadoVacacion // Add this line
};
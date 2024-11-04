// controllers/marcaTiempoController.js

const db = require('../config/db');

async function registrarMarcaInicio(req, res) {
    const { idEmpleado, Fecha, Hora } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query('CALL RegistrarMarcaInicio(?, ?, ?)', [idEmpleado, Fecha, Hora]);

        await connection.commit();
        res.status(201).json({ mensaje: 'Marca de inicio registrada exitosamente' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error capturado:', error);

        // Detectar y enviar mensajes específicos basados en el texto del error
        if (error.message.includes('El usuario está inactivo')) {
            res.status(400).json({ error: 'El usuario está inactivo. No se puede registrar la entrada.' });
        } else if (error.message.includes('Ya existe una marca de inicio para este día')) {
            res.status(400).json({ error: 'Ya existe una marca de inicio para este día.' });
        } else if (error.message.includes('No se puede registrar asistencia en una fecha futura')) {
            res.status(400).json({ error: 'No se puede registrar asistencia en una fecha futura.' });
        } else if (error.message.includes('No se puede registrar asistencia los sábados y domingos')) {
            res.status(400).json({ error: 'No se puede registrar asistencia los sábados y domingos.' });
        } else {
            res.status(500).json({ error: 'Error al registrar la marca de inicio' });
        }
    } finally {
        if (connection) connection.release();
    }
}

async function registrarMarcaSalida(req, res) {
    const { idEmpleado, Fecha, Hora } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query('CALL RegistrarMarcaSalida(?, ?, ?)', [idEmpleado, Fecha, Hora]);

        await connection.commit();
        res.status(201).json({ mensaje: 'Marca de salida registrada exitosamente' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error capturado:', error);

        // Detectar y enviar mensajes específicos basados en el texto del error
        if (error.message.includes('El usuario está inactivo')) {
            res.status(400).json({ error: 'El usuario está inactivo. No se puede registrar la salida.' });
        } else if (error.message.includes('No se ha registrado una marca de inicio para este día')) {
            res.status(400).json({ error: 'No se ha registrado una marca de inicio para este día.' });
        } else if (error.message.includes('No se puede registrar asistencia en una fecha futura')) {
            res.status(400).json({ error: 'No se puede registrar asistencia en una fecha futura.' });
        } else if (error.message.includes('No se puede registrar asistencia los sábados y domingos')) {
            res.status(400).json({ error: 'No se puede registrar asistencia los sábados y domingos.' });
        } else {
            res.status(500).json({ error: 'Error al registrar la marca de salida' });
        }
    } finally {
        if (connection) connection.release();
    }
}

// Función para verificar la marca de inicio
async function verificarMarcaInicio(req, res) {
    const { idEmpleado, Fecha } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query(
            'CALL VerificarMarcaInicio(?, ?, @Resultado)',
            [idEmpleado, Fecha]
        );
        const [resultado] = await connection.query('SELECT @Resultado AS Resultado');
        res.status(200).json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al verificar la marca de inicio' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para verificar la marca de salida
async function verificarMarcaSalida(req, res) {
    const { idEmpleado, Fecha } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query(
            'CALL VerificarMarcaSalida(?, ?, @Resultado)',
            [idEmpleado, Fecha]
        );
        const [resultado] = await connection.query('SELECT @Resultado AS Resultado');
        res.status(200).json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al verificar la marca de salida' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para actualizar una marca de tiempo
async function actualizarMarcaTiempo(req, res) {
    const { idEmpleado, Fecha, HoraNueva, TipoMovimiento } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL ActualizarMarcaTiempo(?, ?, ?, ?)',
            [idEmpleado, Fecha, HoraNueva, TipoMovimiento]
        );

        await connection.commit();
        res.status(200).json({ mensaje: 'Marca de tiempo actualizada exitosamente' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la marca de tiempo' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para eliminar una marca de tiempo
async function eliminarMarcaTiempo(req, res) {
    const { idEmpleado, Fecha, TipoMovimiento } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL EliminarMarcaTiempo(?, ?, ?)',
            [idEmpleado, Fecha, TipoMovimiento]
        );

        await connection.commit();
        res.status(200).json({ mensaje: 'Marca de tiempo eliminada exitosamente' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la marca de tiempo' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para leer todas las marcas de tiempo
async function leerTodasMarcas(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerTodasMarcas()');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener todas las marcas de tiempo' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para leer todas las marcas de tiempo de todas las personas
async function leerTodasMarcasPersona(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerTodosMarcasPersona()');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener todas las marcas de tiempo' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para leer todas las marcas de tiempo por idUsuario
async function leerTodasMarcasPorIdUsuario(req, res) {
    const { idUsuario } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerTodosMarcasPorIdUsuario(?)', [idUsuario]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las marcas de tiempo por idUsuario' });
    } finally {
        if (connection) connection.release();
    }
}

async function justificarTardanzaEntrada(req, res) {
    const { idEmpleado, Fecha, Motivo } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query('CALL JustificarTardanzaEntrada(?, ?, ?)', [idEmpleado, Fecha, Motivo]);

        await connection.commit();
        res.status(200).json({ mensaje: 'Tardanza en entrada justificada exitosamente' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error capturado:', error);
        res.status(500).json({ error: 'Error al justificar tardanza en la entrada' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para justificar tardanza en la salida
async function justificarTardanzaSalida(req, res) {
    const { idEmpleado, Fecha, Motivo } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query('CALL JustificarTardanzaSalida(?, ?, ?)', [idEmpleado, Fecha, Motivo]);

        await connection.commit();
        res.status(200).json({ mensaje: 'Tardanza en salida justificada exitosamente' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error capturado:', error);
        res.status(500).json({ error: 'Error al justificar tardanza en la salida' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    registrarMarcaInicio,
    registrarMarcaSalida,
    verificarMarcaInicio,
    verificarMarcaSalida,
    actualizarMarcaTiempo,
    eliminarMarcaTiempo,
    leerTodasMarcas,
    leerTodasMarcasPersona,
    leerTodasMarcasPorIdUsuario,
    justificarTardanzaEntrada,
    justificarTardanzaSalida  // Exportamos la nueva función
};
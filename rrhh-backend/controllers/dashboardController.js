// controllers/dashboardController.js

const db = require('../config/db');

// Función para verificar la marca de inicio
async function verificarMarcaInicio(req, res) {
    const { idUsuario } = req.params;
    const fecha = new Date().toISOString().slice(0, 10); // Fecha actual en formato YYYY-MM-DD
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL VerificarMarcaInicio(?, ?, @resultado)', [idUsuario, fecha]);
        const [[{ resultado }]] = await connection.query('SELECT @resultado AS resultado');
        res.status(200).json({ mensaje: resultado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al verificar la marca de inicio' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para verificar la marca de salida
async function verificarMarcaSalida(req, res) {
    const { idUsuario } = req.params;
    const fecha = new Date().toISOString().slice(0, 10); // Fecha actual en formato YYYY-MM-DD
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL VerificarMarcaSalida(?, ?, @resultado)', [idUsuario, fecha]);
        const [[{ resultado }]] = await connection.query('SELECT @resultado AS resultado');
        res.status(200).json({ mensaje: resultado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al verificar la marca de salida' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para calcular horas extras mensuales
async function calcularHorasExtrasMensuales(req, res) {
    const { idUsuario } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL CalcularHorasExtrasMensuales(?, @totalHorasExtras, @totalVeces)', [idUsuario]);
        const [[{ totalHorasExtras, totalVeces }]] = await connection.query('SELECT @totalHorasExtras AS totalHorasExtras, @totalVeces AS totalVeces');
        res.status(200).json({ totalHorasExtras, totalVeces });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al calcular las horas extras mensuales' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para obtener nombre y evaluaciones
async function obtenerNombreYEvaluaciones(req, res) {
    const { idUsuario } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        
        // Llamada al procedimiento para obtener el nombre completo
        const [rows1] = await connection.query('CALL ObtenerNombreYEvaluaciones(?, @nombreCompleto)', [idUsuario]);
        const [[{ nombreCompleto }]] = await connection.query('SELECT @nombreCompleto AS nombreCompleto');

        // Llamada para obtener todas las descripciones de evaluaciones
        const [evaluaciones] = await connection.query('SELECT descripcion_evaluacion FROM fundacioncentrovrai.tipo_evaluacion');

        res.status(200).json({ nombreCompleto, evaluaciones });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el nombre y las evaluaciones' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    verificarMarcaInicio,
    verificarMarcaSalida,
    calcularHorasExtrasMensuales,
    obtenerNombreYEvaluaciones
};

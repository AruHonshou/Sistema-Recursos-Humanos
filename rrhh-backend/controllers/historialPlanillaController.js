// controllers/historialPlanillaController.js

const db = require('../config/db');

// Function to get the complete payroll history
async function obtenerHistorialPlanilla(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL HistorialPlanilla()');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el historial de planillas' });
    } finally {
        if (connection) connection.release();
    }
}

// Function to get payroll history for a specific user
async function obtenerHistorialPlanillaPorUsuario(req, res) {
    const { idUsuario } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL HistorialPlanillaIdUsuario(?)', [idUsuario]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el historial de planillas para el usuario' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    obtenerHistorialPlanilla,
    obtenerHistorialPlanillaPorUsuario
};

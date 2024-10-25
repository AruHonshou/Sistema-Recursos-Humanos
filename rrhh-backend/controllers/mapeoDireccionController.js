const db = require('../config/db'); // Asegúrate de que el archivo de configuración de la DB está correcto

// Función para obtener todos los cantones por provincia
async function obtenerCantonesPorProvincia(req, res) {
    const { provinciaId } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL ObtenerCantonesPorProvincia(?)', [provinciaId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los cantones' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para obtener todos los distritos por provincia y cantón
async function obtenerDistritosPorProvinciaYCanton(req, res) {
    const { provinciaId, cantonId } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL ObtenerDistritosPorProvinciaYCanton(?, ?)', [provinciaId, cantonId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los distritos' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    obtenerCantonesPorProvincia,
    obtenerDistritosPorProvinciaYCanton
};

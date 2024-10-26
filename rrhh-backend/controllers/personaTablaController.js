const db = require('../config/db'); // Asegúrate de que el archivo de configuración de la DB está correcto

// Función para obtener los detalles de los empleados
async function obtenerDetallesEmpleado(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerDetallesEmpleado()');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los detalles de los empleados' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    obtenerDetallesEmpleado
};

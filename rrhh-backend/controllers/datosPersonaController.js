const db = require('../config/db'); // Asegúrate de que el archivo de configuración de la DB está correcto

// Función para obtener los datos de un empleado por ID
async function obtenerDatos(req, res) {
    const { empleados_idEmpleado } = req.params; 
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL obtenerDatos(?)', [empleados_idEmpleado]);

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ error: 'Empleado no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los datos del empleado' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    obtenerDatos,
};

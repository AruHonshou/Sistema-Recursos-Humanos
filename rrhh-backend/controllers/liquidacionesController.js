// controllers/liquidacionesController.js

const db = require('../config/db');

// controllers/liquidacionesController.js

async function calcularLiquidacion(req, res) {
    const { idEmpleado, fechaLiquidacion, tipoLiquidacion } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query('CALL CalcularLiquidacion(?, ?, ?)', [idEmpleado, fechaLiquidacion, tipoLiquidacion]);

        await connection.commit();
        res.status(201).json({ mensaje: 'Liquidación calculada exitosamente' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);

        // Check if the error is due to a duplicate liquidation entry
        if (error.message.includes("Este empleado ya tiene una liquidación registrada")) {
            res.status(400).json({ error: 'Este empleado ya tiene una liquidación registrada y no se le permite otra' });
        } else {
            res.status(500).json({ error: 'Error al calcular la liquidación', detalle: error.message });
        }
    } finally {
        if (connection) connection.release();
    }
}


// Controlador para leer todas las liquidaciones completas
async function leerIncapacidadCompleta(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerIncapacidadCompleta()');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las liquidaciones completas' });
    } finally {
        if (connection) connection.release();
    }
}

// Controlador para eliminar una liquidación
async function eliminarLiquidacion(req, res) {
    const { idEmpleado, fechaLiquidacion } = req.params;
    let connection;
    try {
        // Formatear la fecha para eliminar la información de tiempo y zona horaria
        const fechaFormateada = fechaLiquidacion.split('T')[0]; // Extrae solo la fecha en formato 'YYYY-MM-DD'
        
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query('CALL EliminarLiquidacion(?, ?)', [idEmpleado, fechaFormateada]);

        await connection.commit();
        res.status(200).json({ mensaje: 'Liquidación eliminada exitosamente' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la liquidación' });
    } finally {
        if (connection) connection.release();
    }
}


module.exports = {
    calcularLiquidacion,
    leerIncapacidadCompleta,
    eliminarLiquidacion
};

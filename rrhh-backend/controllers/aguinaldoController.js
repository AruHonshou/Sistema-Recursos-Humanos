// controllers/aguinaldoController.js

const db = require('../config/db');

// Función para calcular y registrar el aguinaldo
async function calcularYRegistrarAguinaldo(req, res) {
    const { idEmpleado, fechaAguinaldo, idCatalogoAguinaldo } = req.body; // Usa idCatalogoAguinaldo aquí
    let connection;
    try {
        connection = await db.getConnection();
        await connection.query(
            'CALL CalcularYRegistrarAguinaldo(?, ?, ?)',
            [idEmpleado, fechaAguinaldo, idCatalogoAguinaldo]
        );
        res.status(201).json({ mensaje: 'Aguinaldo calculado y registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al calcular y registrar el aguinaldo' });
    } finally {
        if (connection) connection.release();
    }
}


// Función para obtener el reporte de aguinaldos
async function obtenerReporteAguinaldo(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL ObtenerReporteAguinaldo()');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el reporte de aguinaldos' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para leer el catálogo de tipos de aguinaldo
async function leerCatalogoAguinaldo(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerCatalogoAguinaldo()');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al leer el catálogo de aguinaldo' });
    } finally {
        if (connection) connection.release();
    }
}

// Controlador para eliminar un aguinaldo
async function eliminarAguinaldo(req, res) {
    const { idEmpleado, fechaAguinaldo } = req.body; // Obtener datos de req.body
    let connection;
    try {
        connection = await db.getConnection();
        await connection.query('CALL EliminarAguinaldo(?, ?)', [idEmpleado, fechaAguinaldo]);
        res.status(200).json({ mensaje: 'Aguinaldo eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el aguinaldo' });
    } finally {
        if (connection) connection.release();
    }
}


module.exports = {
    calcularYRegistrarAguinaldo,
    obtenerReporteAguinaldo,
    leerCatalogoAguinaldo,
    eliminarAguinaldo
};

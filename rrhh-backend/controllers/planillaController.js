// controllers/planillaController.js

const db = require('../config/db');

// Function to calculate payroll in bulk
async function calcularPlanillaMasiva(req, res) {
    const { mes, anio } = req.body; // Captura ambos parámetros

    if (!mes || !anio) {
        return res.status(400).json({ mensaje: 'Mes y año son requeridos' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Llama al procedimiento con los dos parámetros
        await connection.query('CALL CalcularPlanillaMasiva(?, ?)', [mes, anio]);

        await connection.commit();
        res.status(201).json({ mensaje: 'Planilla calculada exitosamente' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error al calcular planilla masiva:", error);
        res.status(500).json({ error: 'Error al calcular la planilla' });
    } finally {
        if (connection) connection.release();
    }
}

// Function to delete payroll by date
async function eliminarPlanillaPorFecha(req, res) {
    const { fechaPlanilla } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query('CALL EliminarPlanillaPorFecha(?)', [fechaPlanilla]);

        await connection.commit();
        res.status(200).json({ mensaje: 'Planilla eliminada exitosamente' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la planilla' });
    } finally {
        if (connection) connection.release();
    }
}

// Function to read payroll for a specific date
async function leerPlanilla(req, res) {
    const { fechaPlanilla } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerPlanilla(?)', [fechaPlanilla]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al leer la planilla' });
    } finally {
        if (connection) connection.release();
    }
}

// Function to read all payrolls
async function leerTodasPlanillas(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerTodasPlanillas()');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener todas las planillas' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    calcularPlanillaMasiva,
    eliminarPlanillaPorFecha,
    leerPlanilla,
    leerTodasPlanillas
};

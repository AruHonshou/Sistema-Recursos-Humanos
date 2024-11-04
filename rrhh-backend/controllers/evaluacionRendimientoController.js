// controllers/evaluacionRendimientoController.js

const db = require('../config/db');

// Leer todas las evaluaciones
async function leerTodasEvaluaciones(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerTodasEvaluaciones()');
        res.status(200).json(rows[0]);  // Devuelve la primera lista de resultados
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener todas las evaluaciones' });
    } finally {
        if (connection) connection.release();
    }
}

// Leer evaluaciones por idUsuario
async function leerEvaluacionesPorUsuario(req, res) {
    const { idUsuario } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerEvaluacionesPorUsuario(?)', [idUsuario]);
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las evaluaciones del usuario' });
    } finally {
        if (connection) connection.release();
    }
}

// Crear evaluación de rendimiento
async function registrarEvaluacionRendimientoCompleta(req, res) {
    const { idEmpleado_Evaluador, idEmpleado_Evaluado, Fecha_evaluacion, Puntuaje_Productividad, Puntuaje_Puntualidad, Puntuaje_Colaboracion, Puntuaje_Adaptabilidad, Comentarios } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL RegistrarEvaluacionRendimientoCompleta(?, ?, ?, ?, ?, ?, ?, ?)',
            [idEmpleado_Evaluador, idEmpleado_Evaluado, Fecha_evaluacion, Puntuaje_Productividad, Puntuaje_Puntualidad, Puntuaje_Colaboracion, Puntuaje_Adaptabilidad, Comentarios]
        );

        await connection.commit();
        res.status(201).json({ mensaje: 'Evaluación de rendimiento registrada exitosamente' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);

        // Verifica si el error es por inactividad del evaluador
        if (error.message.includes('El evaluador está inactivo')) {
            res.status(400).json({ error: 'El evaluador está inactivo y no puede registrar evaluaciones.' });
        } else {
            res.status(500).json({ error: 'Error al registrar la evaluación de rendimiento' });
        }
    } finally {
        if (connection) connection.release();
    }
}

// Eliminar una evaluación de rendimiento
async function eliminarEvaluacion(req, res) {
    const { Fecha_evaluacion, idEmpleado_Evaluador, idEmpleado_Evaluado } = req.body;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL EliminarEvaluacion(?, ?, ?)',
            [Fecha_evaluacion, idEmpleado_Evaluador, idEmpleado_Evaluado]
        );

        await connection.commit();
        res.status(200).json({ mensaje: 'Evaluación de rendimiento eliminada exitosamente' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la evaluación de rendimiento' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    leerTodasEvaluaciones,
    leerEvaluacionesPorUsuario,
    registrarEvaluacionRendimientoCompleta,
    eliminarEvaluacion
};

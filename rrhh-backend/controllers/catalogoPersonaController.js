// controllers/catalogoPersonaController.js

// const mysql = require('mysql2/promise');//NO SIURVIO PARA UNA MIERDA ESTO
const db = require('../config/db'); // Asegúrate de que el archivo de configuración de la DB está correcto

// Función para insertar una persona en el catálogo
async function insertarCatalogoPersona(req, res) {
    const { Descripcion_Catalogo_Persona } = req.body; 
    let resultado;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Llama al procedimiento almacenado
        await connection.query(
            'CALL InsertarCatalogoPersona(?, @resultado)',
            [Descripcion_Catalogo_Persona]
        );

        const [rows] = await connection.query('SELECT @resultado AS resultado');
        resultado = rows[0].resultado;

        await connection.commit();
        res.status(200).json({ mensaje: resultado });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al insertar en el catálogo' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para obtener todas las personas del catálogo
async function obtenerCatalogoPersonas(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL ObtenerCatalogoPersonas()');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el catálogo de personas' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para obtener una persona por ID
async function obtenerCatalogoPersonaPorID(req, res) {
    const { idCatalogo_Persona } = req.params; 
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL ObtenerCatalogoPersonaPorID(?)', [idCatalogo_Persona]);
        
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ error: 'Persona no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la persona' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para actualizar una persona
async function actualizarCatalogoPersona(req, res) {
    const { idCatalogo_Persona, Descripcion_Catalogo_Persona } = req.body; 
    let resultado;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL ActualizarCatalogoPersona(?, ?, @resultado)',
            [idCatalogo_Persona, Descripcion_Catalogo_Persona]
        );

        const [rows] = await connection.query('SELECT @resultado AS resultado');
        resultado = rows[0].resultado;

        await connection.commit();
        res.status(200).json({ mensaje: resultado });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar en el catálogo' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para eliminar una persona
async function eliminarCatalogoPersona(req, res) {
    const { idCatalogo_Persona } = req.params; 
    let resultado;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL EliminarCatalogoPersona(?, @resultado)',
            [idCatalogo_Persona]
        );

        const [rows] = await connection.query('SELECT @resultado AS resultado');
        resultado = rows[0].resultado;

        await connection.commit();
        res.status(200).json({ mensaje: resultado });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar en el catálogo' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    insertarCatalogoPersona,
    obtenerCatalogoPersonas,
    obtenerCatalogoPersonaPorID,
    actualizarCatalogoPersona,
    eliminarCatalogoPersona
};

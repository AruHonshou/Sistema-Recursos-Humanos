// controllers/catalogoTelefonoController.js

const db = require('../config/db'); // Asegúrate de que el archivo de configuración de la DB está correcto

// Función para insertar un catálogo de teléfono
async function insertarCatalogoTelefono(req, res) {
    const { Descripcion_Catalogo_Telefono } = req.body; 
    let resultado;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Llama al procedimiento almacenado
        await connection.query(
            'CALL CrearCatalogoTelefono(?, @resultado)',
            [Descripcion_Catalogo_Telefono]
        );

        const [rows] = await connection.query('SELECT @resultado AS resultado');
        resultado = rows[0].resultado;

        await connection.commit();
        res.status(201).json({ mensaje: resultado });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al insertar en el catálogo de teléfonos' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para obtener todos los teléfonos del catálogo
async function obtenerCatalogoTelefonos(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerTodosCatalogoTelefono()');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el catálogo de teléfonos' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para obtener un teléfono por ID
async function obtenerCatalogoTelefonoPorID(req, res) {
    const { idCatalogo_Telefono } = req.params; 
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerCatalogoTelefonoPorID(?)', [idCatalogo_Telefono]);
        
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ error: 'Teléfono no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el teléfono' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para actualizar un teléfono
async function actualizarCatalogoTelefono(req, res) {
    const { idCatalogo_Telefono, Descripcion_Catalogo_Telefono } = req.body; 
    let resultado;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL ActualizarCatalogoTelefono(?, ?, @resultado)',
            [idCatalogo_Telefono, Descripcion_Catalogo_Telefono]
        );

        const [rows] = await connection.query('SELECT @resultado AS resultado');
        resultado = rows[0].resultado;

        await connection.commit();
        res.status(200).json({ mensaje: resultado });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar en el catálogo de teléfonos' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para eliminar un teléfono
async function eliminarCatalogoTelefono(req, res) {
    const { idCatalogo_Telefono } = req.params; 
    let resultado;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL EliminarCatalogoTelefono(?, @resultado)',
            [idCatalogo_Telefono]
        );

        const [rows] = await connection.query('SELECT @resultado AS resultado');
        resultado = rows[0].resultado;

        await connection.commit();
        res.status(200).json({ mensaje: resultado });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar en el catálogo de teléfonos' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    insertarCatalogoTelefono,
    obtenerCatalogoTelefonos,
    obtenerCatalogoTelefonoPorID,
    actualizarCatalogoTelefono,
    eliminarCatalogoTelefono
};

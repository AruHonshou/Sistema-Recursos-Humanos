// controllers/catalogoCorreoController.js

const db = require('../config/db'); // Asegúrate de que el archivo de configuración de la DB está correcto

// Función para insertar un correo en el catálogo
async function insertarCatalogoCorreo(req, res) {
    const { Tipo_Correo } = req.body; 
    let resultado;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Llama al procedimiento almacenado
        await connection.query(
            'CALL CrearCatalogoCorreo(?, @resultado)',
            [Tipo_Correo]
        );

        const [rows] = await connection.query('SELECT @resultado AS resultado');
        resultado = rows[0].resultado;

        await connection.commit();
        res.status(200).json({ mensaje: 'Correo insertado exitosamente.' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al insertar en el catálogo de correos' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para obtener todos los correos del catálogo
async function obtenerCatalogoCorreos(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerTodosCatalogoCorreo()');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el catálogo de correos' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para obtener un correo por ID
async function obtenerCatalogoCorreoPorID(req, res) {
    const { idCatalogo_Correo } = req.params; 
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerCatalogoCorreoPorID(?)', [idCatalogo_Correo]);
        
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ error: 'Correo no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el correo' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para actualizar un correo
async function actualizarCatalogoCorreo(req, res) {
    const { idCatalogo_Correo, Tipo_Correo } = req.body; 
    let resultado;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL ActualizarCatalogoCorreo(?, ?, @resultado)',
            [idCatalogo_Correo, Tipo_Correo]
        );

        const [rows] = await connection.query('SELECT @resultado AS resultado');
        resultado = rows[0].resultado;

        await connection.commit();
        res.status(200).json({ mensaje: resultado });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar en el catálogo de correos' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para eliminar un correo
async function eliminarCatalogoCorreo(req, res) {
    const { idCatalogo_Correo } = req.params; 
    let resultado;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL EliminarCatalogoCorreo(?, @resultado)',
            [idCatalogo_Correo]
        );

        const [rows] = await connection.query('SELECT @resultado AS resultado');
        resultado = rows[0].resultado;

        await connection.commit();
        res.status(200).json({ mensaje: resultado });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar en el catálogo de correos' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    insertarCatalogoCorreo,
    obtenerCatalogoCorreos,
    obtenerCatalogoCorreoPorID,
    actualizarCatalogoCorreo,
    eliminarCatalogoCorreo
};

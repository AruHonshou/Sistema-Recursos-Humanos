// controllers/catalogoPermisoController.js

const db = require('../config/db'); // Asegúrate de que el archivo de configuración de la DB está correcto

// Función para insertar un permiso en el catálogo
async function insertarCatalogoPermiso(req, res) {
    const { Descripcion_Permiso } = req.body; 
    let resultado;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Llama al procedimiento almacenado
        await connection.query(
            'CALL InsertarCatalogoPermiso(?, @resultado)',
            [Descripcion_Permiso]
        );

        const [rows] = await connection.query('SELECT @resultado AS resultado');
        resultado = rows[0].resultado;

        await connection.commit();
        res.status(200).json({ mensaje: resultado });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al insertar en el catálogo de permisos' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para obtener todos los permisos del catálogo
async function obtenerCatalogoPermisos(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL ObtenerCatalogoPermisos()');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el catálogo de permisos' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para obtener un permiso por ID
async function obtenerCatalogoPermisoPorID(req, res) {
    const { idCatalogo_Permiso } = req.params; 
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL ObtenerCatalogoPermisoPorID(?)', [idCatalogo_Permiso]);
        
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ error: 'Permiso no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el permiso' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para actualizar un permiso
async function actualizarCatalogoPermiso(req, res) {
    const { idCatalogo_Permiso, Descripcion_Permiso } = req.body; 
    let resultado;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL ActualizarCatalogoPermiso(?, ?, @resultado)',
            [idCatalogo_Permiso, Descripcion_Permiso]
        );

        const [rows] = await connection.query('SELECT @resultado AS resultado');
        resultado = rows[0].resultado;

        await connection.commit();
        res.status(200).json({ mensaje: resultado });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el permiso en el catálogo' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para eliminar un permiso
async function eliminarCatalogoPermiso(req, res) {
    const { idCatalogo_Permiso } = req.params; 
    let resultado;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL EliminarCatalogoPermiso(?, @resultado)',
            [idCatalogo_Permiso]
        );

        const [rows] = await connection.query('SELECT @resultado AS resultado');
        resultado = rows[0].resultado;

        await connection.commit();
        res.status(200).json({ mensaje: resultado });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el permiso del catálogo' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    insertarCatalogoPermiso,
    obtenerCatalogoPermisos,
    obtenerCatalogoPermisoPorID,
    actualizarCatalogoPermiso,
    eliminarCatalogoPermiso
};

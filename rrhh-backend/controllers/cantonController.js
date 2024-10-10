const db = require('../config/db');

// Crear un nuevo cantón
exports.crearCanton = async (req, res) => {
    const { nombreCanton, provinciaId } = req.body;

    try {
        await db.query('CALL CrearCanton(?, ?, @nuevo_id);', [nombreCanton, provinciaId]);
        const [result] = await db.query('SELECT @nuevo_id AS idNuevo;');
        res.status(201).json({ message: 'Cantón creado exitosamente', idCanton: result[0].idNuevo });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el cantón', error });
    }
};

// Obtener un cantón por ID
exports.obtenerCantonPorId = async (req, res) => {
    const { idCanton, provinciaId } = req.params;

    try {
        const [rows] = await db.query('CALL LeerCantonPorID(?, ?);', [idCanton, provinciaId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cantón no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el cantón', error });
    }
};

// Obtener todos los cantones
exports.obtenerTodosCantones = async (req, res) => {
    try {
        const [rows] = await db.query('CALL LeerTodosCanton();');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los cantones', error });
    }
};

// Actualizar un cantón
exports.actualizarCanton = async (req, res) => {
    const { idCanton, provinciaId } = req.params;
    const { nombreCanton } = req.body;

    try {
        await db.query('CALL ActualizarCanton(?, ?, ?, @resultado);', [idCanton, provinciaId, nombreCanton]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el cantón', error });
    }
};

// Eliminar un cantón
exports.eliminarCanton = async (req, res) => {
    const { idCanton, provinciaId } = req.params;

    try {
        await db.query('CALL EliminarCanton(?, ?, @resultado);', [idCanton, provinciaId]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el cantón', error });
    }
};

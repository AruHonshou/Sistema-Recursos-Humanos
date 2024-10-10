const db = require('../config/db');

// Crear un nuevo distrito
exports.crearDistrito = async (req, res) => {
    const { nombreDistrito, cantonId, provinciaId } = req.body;

    try {
        await db.query('CALL CrearDistrito(?, ?, ?, @nuevo_id);', [nombreDistrito, cantonId, provinciaId]);
        const [result] = await db.query('SELECT @nuevo_id AS idNuevo;');
        res.status(201).json({ message: 'Distrito creado exitosamente', idDistrito: result[0].idNuevo });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el distrito', error });
    }
};

// Obtener un distrito por ID
exports.obtenerDistritoPorId = async (req, res) => {
    const { idDistrito, cantonId, provinciaId } = req.params;

    try {
        const [rows] = await db.query('CALL LeerDistritoPorID(?, ?, ?);', [idDistrito, cantonId, provinciaId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Distrito no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el distrito', error });
    }
};

// Obtener todos los distritos
exports.obtenerTodosDistritos = async (req, res) => {
    try {
        const [rows] = await db.query('CALL LeerTodosDistritos();');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los distritos', error });
    }
};

// Actualizar un distrito
exports.actualizarDistrito = async (req, res) => {
    const { idDistrito, cantonId, provinciaId } = req.params;
    const { nombreDistrito } = req.body;

    try {
        await db.query('CALL ActualizarDistrito(?, ?, ?, ?, @resultado);', [idDistrito, cantonId, provinciaId, nombreDistrito]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el distrito', error });
    }
};

// Eliminar un distrito
exports.eliminarDistrito = async (req, res) => {
    const { idDistrito, cantonId, provinciaId } = req.params;

    try {
        await db.query('CALL EliminarDistrito(?, ?, ?, @resultado);', [idDistrito, cantonId, provinciaId]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el distrito', error });
    }
};

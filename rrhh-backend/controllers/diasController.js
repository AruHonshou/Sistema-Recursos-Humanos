const db = require('../config/db');

// Crear un nuevo día
exports.crearDia = async (req, res) => {
    const { nombreDia } = req.body;

    try {
        await db.query('CALL CrearDia(?, @nuevo_id);', [nombreDia]);
        const [result] = await db.query('SELECT @nuevo_id AS idNuevo;');
        res.status(201).json({ message: 'Día creado exitosamente', idDia: result[0].idNuevo });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el día', error });
    }
};

// Obtener un día por ID
exports.obtenerDiaPorId = async (req, res) => {
    const { idDia } = req.params;

    try {
        const [rows] = await db.query('CALL LeerDiaPorID(?);', [idDia]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Día no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el día', error });
    }
};

// Obtener todos los días
exports.obtenerTodosDias = async (req, res) => {
    try {
        const [rows] = await db.query('CALL LeerTodosDias();');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los días', error });
    }
};

// Actualizar un día
exports.actualizarDia = async (req, res) => {
    const { idDia } = req.params;
    const { nombreDia } = req.body;

    try {
        await db.query('CALL ActualizarDia(?, ?, @resultado);', [idDia, nombreDia]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el día', error });
    }
};

// Eliminar un día
exports.eliminarDia = async (req, res) => {
    const { idDia } = req.params;

    try {
        await db.query('CALL EliminarDia(?, @resultado);', [idDia]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el día', error });
    }
};

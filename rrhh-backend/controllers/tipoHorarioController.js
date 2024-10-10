const db = require('../config/db');

// Crear un nuevo tipo de horario
exports.crearTipoHorario = async (req, res) => {
    const { idtipo_horario, tipo_horario } = req.body;

    try {
        await db.query('CALL CrearTipoHorario(?, ?);', [idtipo_horario, tipo_horario]);
        res.status(201).json({ message: 'Tipo de horario creado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el tipo de horario', error });
    }
};

// Obtener un tipo de horario por ID
exports.obtenerTipoHorarioPorId = async (req, res) => {
    const { idtipo_horario } = req.params;

    try {
        const [rows] = await db.query('CALL LeerTipoHorarioPorID(?);', [idtipo_horario]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Tipo de horario no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el tipo de horario', error });
    }
};

// Obtener todos los tipos de horario
exports.obtenerTodosTiposHorario = async (req, res) => {
    try {
        const [rows] = await db.query('CALL LeerTodosTiposHorario();');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los tipos de horario', error });
    }
};

// Actualizar un tipo de horario
exports.actualizarTipoHorario = async (req, res) => {
    const { idtipo_horario } = req.params;
    const { tipo_horario } = req.body;

    try {
        await db.query('CALL ActualizarTipoHorario(?, ?, @resultado);', [idtipo_horario, tipo_horario]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el tipo de horario', error });
    }
};

// Eliminar un tipo de horario
exports.eliminarTipoHorario = async (req, res) => {
    const { idtipo_horario } = req.params;

    try {
        await db.query('CALL EliminarTipoHorario(?, @resultado);', [idtipo_horario]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el tipo de horario', error });
    }
};

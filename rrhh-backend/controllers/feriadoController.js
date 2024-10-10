const db = require('../config/db');

// Crear un nuevo feriado
exports.crearFeriado = async (req, res) => {
    const { fechaFeriado, descripcionFeriado, dias_idDia } = req.body;

    try {
        await db.query('CALL CrearFeriado(?, ?, ?);', [fechaFeriado, descripcionFeriado, dias_idDia]);
        res.status(201).json({ message: 'Feriado creado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el feriado', error });
    }
};

// Leer un feriado por fecha
exports.obtenerFeriadoPorFecha = async (req, res) => {
    const { fechaFeriado } = req.params;

    try {
        const [rows] = await db.query('CALL LeerFeriadoPorFecha(?);', [fechaFeriado]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Feriado no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el feriado', error });
    }
};

// Obtener todos los feriados
exports.obtenerTodosFeriados = async (req, res) => {
    try {
        const [rows] = await db.query('CALL LeerTodosFeriados();');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los feriados', error });
    }
};

// Actualizar un feriado
exports.actualizarFeriado = async (req, res) => {
    const { fechaFeriado } = req.params;
    const { descripcionFeriado, dias_idDia } = req.body;

    try {
        await db.query('CALL ActualizarFeriado(?, ?, ?, @resultado);', [fechaFeriado, descripcionFeriado, dias_idDia]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el feriado', error });
    }
};

// Eliminar un feriado
exports.eliminarFeriado = async (req, res) => {
    const { fechaFeriado } = req.params;

    try {
        await db.query('CALL EliminarFeriado(?, @resultado);', [fechaFeriado]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el feriado', error });
    }
};

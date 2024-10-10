const db = require('../config/db');

// Crear un nuevo tipo de liquidación
exports.crearTipoLiquidacion = async (req, res) => {
    const { idcatalogo_tipo_liquidacion, tipo_liquidacion } = req.body;

    try {
        await db.query('CALL CrearTipoLiquidacion(?, ?);', [idcatalogo_tipo_liquidacion, tipo_liquidacion]);
        res.status(201).json({ message: 'Tipo de liquidación creado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el tipo de liquidación', error });
    }
};

// Obtener un tipo de liquidación por ID
exports.obtenerTipoLiquidacionPorId = async (req, res) => {
    const { idcatalogo_tipo_liquidacion } = req.params;

    try {
        const [rows] = await db.query('CALL LeerTipoLiquidacionPorID(?);', [idcatalogo_tipo_liquidacion]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Tipo de liquidación no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el tipo de liquidación', error });
    }
};

// Obtener todos los tipos de liquidación
exports.obtenerTodosTiposLiquidacion = async (req, res) => {
    try {
        const [rows] = await db.query('CALL LeerTodosTipoLiquidacion();');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los tipos de liquidación', error });
    }
};

// Actualizar un tipo de liquidación
exports.actualizarTipoLiquidacion = async (req, res) => {
    const { idcatalogo_tipo_liquidacion } = req.params;
    const { tipo_liquidacion } = req.body;

    try {
        await db.query('CALL ActualizarTipoLiquidacion(?, ?, @resultado);', [idcatalogo_tipo_liquidacion, tipo_liquidacion]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el tipo de liquidación', error });
    }
};

// Eliminar un tipo de liquidación
exports.eliminarTipoLiquidacion = async (req, res) => {
    const { idcatalogo_tipo_liquidacion } = req.params;

    try {
        await db.query('CALL EliminarTipoLiquidacion(?, @resultado);', [idcatalogo_tipo_liquidacion]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el tipo de liquidación', error });
    }
};

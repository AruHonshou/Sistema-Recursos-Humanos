// Controlador catalogoHorasExtrasController.js
const pool = require('../config/db');

// Crear Horas Extras
exports.crearHorasExtras = async (req, res) => {
    try {
        const { idcatalogo_horas_extras, tipo_hora_extra, porcentaje } = req.body;
        await pool.query('CALL CrearHorasExtras(?, ?, ?)', [idcatalogo_horas_extras, tipo_hora_extra, porcentaje]);
        res.status(201).send('Horas extras creadas exitosamente.');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Leer todas las Horas Extras
exports.leerTodasHorasExtras = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL LeerTodasHorasExtras()');
        res.status(200).json(rows[0]); // Ajuste si las filas están anidadas
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Leer Horas Extras por ID
exports.leerHorasExtrasPorID = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('CALL LeerHorasExtrasPorID(?)', [id]);
        if (rows[0].length === 0) {
            return res.status(404).send('Horas extras no encontradas.');
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar Horas Extras
exports.actualizarHorasExtras = async (req, res) => {
    try {
        const { idcatalogo_horas_extras, tipo_hora_extra, porcentaje } = req.body;
        const [result] = await pool.query('CALL ActualizarHorasExtras(?, ?, ?, @resultado)', [idcatalogo_horas_extras, tipo_hora_extra, porcentaje]);
        const [[{ resultado }]] = await pool.query('SELECT @resultado AS resultado');
        res.status(200).send(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar Horas Extras
exports.eliminarHorasExtras = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('CALL EliminarHorasExtras(?, @resultado)', [id]);
        const [[{ resultado }]] = await pool.query('SELECT @resultado AS resultado');
        res.status(200).send(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador catalogoIncapacidadesController.js
const pool = require('../config/db');

// Crear Incapacidad
exports.crearIncapacidad = async (req, res) => {
    try {
        const { Descripcion_Catalogo_Incapacidad, Porcentaje_Deduccion } = req.body; // Incluir el nuevo parámetro
        const [result] = await pool.query('CALL CrearCatalogoIncapacidad(?, ?, @idCatalogo_Incapacidad)', [Descripcion_Catalogo_Incapacidad, Porcentaje_Deduccion]);
        const [[{ idCatalogo_Incapacidad }]] = await pool.query('SELECT @idCatalogo_Incapacidad AS idCatalogo_Incapacidad');
        res.status(201).json({ idCatalogo_Incapacidad });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Leer todas las Incapacidades
exports.leerTodasIncapacidades = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL LeerTodosCatalogoIncapacidad()');
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Leer Incapacidad por ID
exports.leerIncapacidadPorID = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('CALL LeerCatalogoIncapacidadPorID(?)', [id]);
        if (rows[0].length === 0) {
            return res.status(404).send('Incapacidad no encontrada.');
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar Incapacidad
exports.actualizarIncapacidad = async (req, res) => {
    try {
        const { idCatalogo_Incapacidad, Descripcion_Catalogo_Incapacidad, Porcentaje_Deduccion } = req.body; // Incluir el nuevo parámetro
        const [result] = await pool.query('CALL ActualizarCatalogoIncapacidad(?, ?, ?, @resultado)', [idCatalogo_Incapacidad, Descripcion_Catalogo_Incapacidad, Porcentaje_Deduccion]);
        const [[{ resultado }]] = await pool.query('SELECT @resultado AS resultado');
        res.status(200).send(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar Incapacidad
exports.eliminarIncapacidad = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('CALL EliminarCatalogoIncapacidad(?, @resultado)', [id]);
        const [[{ resultado }]] = await pool.query('SELECT @resultado AS resultado');
        res.status(200).send(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

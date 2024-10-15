const db = require('../config/db');

// Crear una nueva provincia
exports.crearProvincia = async (req, res) => {
    const { nombre_provincia } = req.body;

    // Verifica que el valor no sea nulo o vacío
    if (!nombre_provincia) {
        return res.status(400).json({ message: "El campo 'nombre_provincia' es requerido." });
    }

    try {
        await db.query('CALL CrearProvincia(?, @nuevo_id);', [nombre_provincia]);
        const [result] = await db.query('SELECT @nuevo_id AS idNuevo;');
        res.status(201).json({ message: 'Provincia creada exitosamente', idProvincia: result[0].idNuevo });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la provincia', error });
    }
};

// Obtener una provincia por ID
exports.obtenerProvinciaPorId = async (req, res) => {
    const { idProvincia } = req.params;

    try {
        const [rows] = await db.query('CALL LeerProvinciaPorID(?);', [idProvincia]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Provincia no encontrada' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la provincia', error });
    }
};

// Obtener todas las provincias
exports.obtenerTodasProvincias = async (req, res) => {
    try {
        const [rows] = await db.query('CALL LeerTodasProvincias();');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las provincias', error });
    }
};

// Actualizar una provincia
exports.actualizarProvincia = async (req, res) => {
    const { idProvincia } = req.params;
    const { nombre_provincia } = req.body;

    // Verifica que el nombre de la provincia no sea nulo o vacío
    if (!nombre_provincia) {
        return res.status(400).json({ message: "El campo 'nombre_provincia' es requerido." });
    }

    try {
        await db.query('CALL ActualizarProvincia(?, ?, @resultado);', [idProvincia, nombre_provincia]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la provincia', error });
    }
};

// Eliminar una provincia
exports.eliminarProvincia = async (req, res) => {
    const { idProvincia } = req.params;

    try {
        await db.query('CALL EliminarProvincia(?, @resultado);', [idProvincia]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la provincia', error });
    }
};

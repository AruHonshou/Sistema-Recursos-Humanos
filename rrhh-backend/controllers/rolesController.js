const db = require('../config/db');

// Crear un nuevo rol
exports.crearRol = async (req, res) => {
    const { idroles, Descripcion_Rol } = req.body;

    try {
        await db.query('CALL CrearRol(?, ?);', [idroles, Descripcion_Rol]);
        res.status(201).json({ message: 'Rol creado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el rol', error });
    }
};

// Obtener un rol por ID
exports.obtenerRolPorId = async (req, res) => {
    const { idroles } = req.params;

    try {
        const [rows] = await db.query('CALL LeerRolPorID(?);', [idroles]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el rol', error });
    }
};

// Obtener todos los roles
exports.obtenerTodosRoles = async (req, res) => {
    try {
        const [rows] = await db.query('CALL LeerTodosRoles();');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los roles', error });
    }
};

// Actualizar un rol
exports.actualizarRol = async (req, res) => {
    const { idroles } = req.params;
    const { Descripcion_Rol } = req.body;

    try {
        await db.query('CALL ActualizarRol(?, ?, @resultado);', [idroles, Descripcion_Rol]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el rol', error });
    }
};

// Eliminar un rol
exports.eliminarRol = async (req, res) => {
    const { idroles } = req.params;

    try {
        await db.query('CALL EliminarRol(?, @resultado);', [idroles]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el rol', error });
    }
};

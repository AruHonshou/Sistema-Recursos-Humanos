// Controlador usuarioController.js
const pool = require('../config/db');

// Crear Usuario
exports.crearUsuario = async (req, res) => {
    try {
        const { Nombre_Usuario, Contrasena, Fecha_Creacion, Primer_Ingreso, roles_idroles, empleados_idEmpleado } = req.body;
        const [result] = await pool.query('CALL CrearUsuario(?, ?, ?, ?, ?, ?, @resultado)', 
            [Nombre_Usuario, Contrasena, Fecha_Creacion, Primer_Ingreso, roles_idroles, empleados_idEmpleado]);
        const [[{ resultado }]] = await pool.query('SELECT @resultado AS resultado');
        res.status(201).json({ resultado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Leer Usuario por ID
exports.leerUsuarioPorID = async (req, res) => {
    try {
        const { idusuarios } = req.params;
        const [rows] = await pool.query('CALL LeerUsuarioPorID(?)', [idusuarios]);
        if (rows[0].length === 0) {
            return res.status(404).send('Usuario no encontrado.');
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Leer Todos los Usuarios
exports.leerTodosUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL LeerTodosUsuarios()');
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar Usuario
exports.actualizarUsuario = async (req, res) => {
    try {
        const { idusuarios, Nombre_Usuario, Contrasena, Fecha_Creacion, Primer_Ingreso, roles_idroles, empleados_idEmpleado } = req.body;
        const [result] = await pool.query('CALL ActualizarUsuario(?, ?, ?, ?, ?, ?, ?, @resultado)', 
            [idusuarios, Nombre_Usuario, Contrasena, Fecha_Creacion, Primer_Ingreso, roles_idroles, empleados_idEmpleado]);
        const [[{ resultado }]] = await pool.query('SELECT @resultado AS resultado');
        res.status(200).send(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar Usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        const { idusuarios } = req.params;
        const [result] = await pool.query('CALL EliminarUsuario(?, @resultado)', [idusuarios]);
        const [[{ resultado }]] = await pool.query('SELECT @resultado AS resultado');
        res.status(200).send(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

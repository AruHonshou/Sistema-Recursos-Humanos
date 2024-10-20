// Controlador permisoSolicitadoController.js
const pool = require('../config/db');

// Crear Permiso Solicitado
exports.crearPermisoSolicitado = async (req, res) => {
    try {
        const { fecha_permiso, detalle_permiso, fecha_solicitud, catalogo_permiso_idcatalogo_permiso, empleados_idEmpleado, estado_solicitud_idestado_solicitud } = req.body;
        const [result] = await pool.query('CALL CrearPermisoSolicitado(?, ?, ?, ?, ?, ?, @resultado)', [fecha_permiso, detalle_permiso, fecha_solicitud, catalogo_permiso_idcatalogo_permiso, empleados_idEmpleado, estado_solicitud_idestado_solicitud]);
        const [[{ resultado }]] = await pool.query('SELECT @resultado AS resultado');
        res.status(201).json({ resultado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Leer Permiso Solicitado por Fecha y Empleado
exports.leerPermisoSolicitadoPorFechaYEmpleado = async (req, res) => {
    try {
        const { fecha_permiso, empleados_idEmpleado } = req.params;
        const [rows] = await pool.query('CALL LeerPermisoSolicitadoPorFechaYEmpleado(?, ?)', [fecha_permiso, empleados_idEmpleado]);
        if (rows[0].length === 0) {
            return res.status(404).send('Permiso solicitado no encontrado.');
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Leer Todos los Permisos Solicitados
exports.leerTodosPermisosSolicitados = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL LeerTodosPermisosSolicitados()');
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar Permiso Solicitado
exports.actualizarPermisoSolicitado = async (req, res) => {
    try {
        const { fecha_permiso, empleados_idEmpleado, detalle_permiso, fecha_solicitud, catalogo_permiso_idcatalogo_permiso, estado_solicitud_idestado_solicitud } = req.body;
        const [result] = await pool.query('CALL ActualizarPermisoSolicitado(?, ?, ?, ?, ?, ?, @resultado)', [fecha_permiso, empleados_idEmpleado, detalle_permiso, fecha_solicitud, catalogo_permiso_idcatalogo_permiso, estado_solicitud_idestado_solicitud]);
        const [[{ resultado }]] = await pool.query('SELECT @resultado AS resultado');
        res.status(200).send(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar Permiso Solicitado
exports.eliminarPermisoSolicitado = async (req, res) => {
    try {
        const { fecha_permiso, empleados_idEmpleado } = req.params;
        const [result] = await pool.query('CALL EliminarPermisoSolicitado(?, ?, @resultado)', [fecha_permiso, empleados_idEmpleado]);
        const [[{ resultado }]] = await pool.query('SELECT @resultado AS resultado');
        res.status(200).send(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

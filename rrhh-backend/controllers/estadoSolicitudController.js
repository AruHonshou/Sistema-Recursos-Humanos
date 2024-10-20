// controllers/estadoSolicitudController.js
const db = require('../config/db');

const estadoSolicitudController = {
    crearEstadoSolicitud: async (req, res) => {
        const { estado_solicitud } = req.body;
        try {
            const [result] = await db.query('CALL CrearEstadoSolicitud(?)', [estado_solicitud]);
            res.status(201).json({ message: 'Estado de solicitud creado', result });
        } catch (error) {
            console.error('Error al crear estado de solicitud:', error);
            res.status(500).json({ error: 'Error al crear estado de solicitud' });
        }
    },

    leerTodosLosEstadosSolicitud: async (req, res) => {
        try {
            const [rows] = await db.query('CALL LeerTodosLosEstadosSolicitud()');
            res.status(200).json(rows);
        } catch (error) {
            console.error('Error al leer estados de solicitud:', error);
            res.status(500).json({ error: 'Error al leer estados de solicitud' });
        }
    },

    leerEstadoSolicitudPorID: async (req, res) => {
        const { idestado_solicitud } = req.params;
        try {
            const [rows] = await db.query('CALL LeerEstadoSolicitudPorID(?)', [idestado_solicitud]);
            if (rows.length > 0) {
                res.status(200).json(rows[0]);
            } else {
                res.status(404).json({ message: 'Estado de solicitud no encontrado' });
            }
        } catch (error) {
            console.error('Error al leer estado de solicitud:', error);
            res.status(500).json({ error: 'Error al leer estado de solicitud' });
        }
    },

    actualizarEstadoSolicitud: async (req, res) => {
        const { idestado_solicitud } = req.params;
        const { estado_solicitud } = req.body;
        try {
            await db.query('CALL ActualizarEstadoSolicitud(?, ?)', [idestado_solicitud, estado_solicitud]);
            res.status(200).json({ message: 'Estado de solicitud actualizado' });
        } catch (error) {
            console.error('Error al actualizar estado de solicitud:', error);
            res.status(500).json({ error: 'Error al actualizar estado de solicitud' });
        }
    },

    eliminarEstadoSolicitud: async (req, res) => {
        const { idestado_solicitud } = req.params;
        try {
            await db.query('CALL EliminarEstadoSolicitud(?)', [idestado_solicitud]);
            res.status(200).json({ message: 'Estado de solicitud eliminado' });
        } catch (error) {
            console.error('Error al eliminar estado de solicitud:', error);
            res.status(500).json({ error: 'Error al eliminar estado de solicitud' });
        }
    }
};

module.exports = estadoSolicitudController;

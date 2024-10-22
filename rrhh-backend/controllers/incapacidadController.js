const pool = require('../config/db');

// Crear Incapacidad
exports.crearIncapacidad = async (req, res) => {
    try {
        const { Fecha_Inicio, Fecha_Fin, Descripcion_Incapacidades, Cantidad_Dias, Monto_Deduccion, catalogo_incapacidad_idCatalogo_Incapacidad, empleados_idEmpleado } = req.body; // Asegúrate de que estas variables coincidan
        const [result] = await pool.query('CALL CrearIncapacidad(?, ?, ?, ?, ?, ?, ?)', [
            Fecha_Inicio, 
            Fecha_Fin, 
            Descripcion_Incapacidades, 
            Cantidad_Dias, 
            Monto_Deduccion, 
            catalogo_incapacidad_idCatalogo_Incapacidad, 
            empleados_idEmpleado
        ]);
        res.status(201).json({ message: 'Incapacidad creada exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Leer todas las Incapacidades
exports.leerIncapacidades = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL LeerIncapacidades()');
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Leer Incapacidad por Fecha_Inicio
exports.leerIncapacidadPorID = async (req, res) => {
    try {
        const { Fecha_Inicio } = req.params; // El parámetro debe coincidir con la definición del enrutador
        const [rows] = await pool.query('CALL LeerIncapacidadPorID(?)', [Fecha_Inicio]);
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
        const { Fecha_Inicio, Fecha_Fin, Descripcion_Incapacidades, Cantidad_Dias, Monto_Deduccion, catalogo_incapacidad_idCatalogo_Incapacidad, empleados_idEmpleado } = req.body; // Corrige el nombre de la variable
        const [result] = await pool.query('CALL ActualizarIncapacidad(?, ?, ?, ?, ?, ?, ?)', [
            Fecha_Inicio, 
            Fecha_Fin, 
            Descripcion_Incapacidades, 
            Cantidad_Dias, // Añadido para la cantidad de días
            Monto_Deduccion, 
            catalogo_incapacidad_idCatalogo_Incapacidad, 
            empleados_idEmpleado
        ]);
        res.status(200).json({ message: 'Incapacidad actualizada exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar Incapacidad
exports.eliminarIncapacidad = async (req, res) => {
    try {
        const { Fecha_Inicio, empleados_idEmpleado } = req.params; // Asegúrate de que este parámetro esté definido correctamente
        const [result] = await pool.query('CALL EliminarIncapacidad(?, ?)', [Fecha_Inicio, empleados_idEmpleado]);
        res.status(200).json({ message: 'Incapacidad eliminada exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const db = require('../config/db');

// Crear un nuevo puesto laboral
exports.crearPuestoLaboral = async (req, res) => {
    const { Nombre_Puesto, Salario_Puesto } = req.body;

    try {
        await db.query('CALL CrearPuestoLaboral(?, ?, @nuevo_id);', [Nombre_Puesto, Salario_Puesto]);
        const [result] = await db.query('SELECT @nuevo_id AS idNuevo;');
        res.status(201).json({ message: 'Puesto laboral creado exitosamente', idPuestoLaboral: result[0].idNuevo });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el puesto laboral', error });
    }
};

// Obtener un puesto laboral por ID
exports.obtenerPuestoLaboralPorId = async (req, res) => {
    const { idpuesto_laboral } = req.params;

    try {
        const [rows] = await db.query('CALL LeerPuestoLaboralPorID(?);', [idpuesto_laboral]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Puesto laboral no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el puesto laboral', error });
    }
};

// Obtener todos los puestos laborales
exports.obtenerTodosPuestosLaborales = async (req, res) => {
    try {
        const [rows] = await db.query('CALL LeerTodosPuestosLaborales();');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los puestos laborales', error });
    }
};

// Actualizar un puesto laboral
exports.actualizarPuestoLaboral = async (req, res) => {
    const { idpuesto_laboral } = req.params;
    const { Nombre_Puesto, Salario_Puesto } = req.body;

    try {
        await db.query('CALL ActualizarPuestoLaboral(?, ?, ?, @resultado);', [idpuesto_laboral, Nombre_Puesto, Salario_Puesto]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el puesto laboral', error });
    }
};

// Eliminar un puesto laboral
exports.eliminarPuestoLaboral = async (req, res) => {
    const { idpuesto_laboral } = req.params;

    try {
        await db.query('CALL EliminarPuestoLaboral(?, @resultado);', [idpuesto_laboral]);
        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: result[0].mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el puesto laboral', error });
    }
};

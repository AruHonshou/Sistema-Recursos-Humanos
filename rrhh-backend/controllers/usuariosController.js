const db = require('../config/db');

// Crear una nueva persona (usando el procedimiento almacenado CrearPersonaCompleta)
exports.crearPersona = async (req, res) => {
    console.log(req.body); // Para verificar qué datos se están recibiendo
    const {
        idPersona, Nombre, Primer_Apellido, Segundo_Apellido, Fecha_Nacimiento, catalogo_persona_idCatalogo_Persona,
        Numero_Telefono, Detalle_Telefono, catalogo_telefono_idCatalogo_Telefono,
        Direccion_Especifica, distrito_idDistrito, distrito_canton_idCanton, distrito_canton_provincia_idprovincia,
        Descripcion_Correo, catalogo_correo_idCatalogo_Correo,
        Fecha_Ingreso, puesto_laboral_idpuesto_laboral,
        tipo_horario_idtipo_horario, Nombre_Usuario, Contrasena, roles_idroles
    } = req.body;

    try {
        // Llamada al procedimiento almacenado CrearPersonaCompleta
        await db.query(`
            CALL CrearPersonaCompleta(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @resultado);
        `, [
            idPersona, Nombre, Primer_Apellido, Segundo_Apellido, Fecha_Nacimiento, catalogo_persona_idCatalogo_Persona,
            Numero_Telefono, Detalle_Telefono, catalogo_telefono_idCatalogo_Telefono,
            Direccion_Especifica, distrito_idDistrito, distrito_canton_idCanton, distrito_canton_provincia_idprovincia,
            Descripcion_Correo, catalogo_correo_idCatalogo_Correo,
            Fecha_Ingreso, puesto_laboral_idpuesto_laboral, tipo_horario_idtipo_horario,
            Nombre_Usuario, Contrasena, roles_idroles
        ]);

        const [result] = await db.query('SELECT @resultado AS mensaje;');
        res.status(201).json({ message: result[0].mensaje });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la persona', error });
    }
};

// Obtener una persona por ID
exports.obtenerPersonaPorId = async (req, res) => {
    const { idPersona } = req.params;

    try {
        const [rows] = await db.query('CALL LeerPersona(?);', [idPersona]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Persona no encontrada' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la persona', error });
    }
};

// Obtener todas las personas
exports.obtenerTodasPersonas = async (req, res) => {
    try {
        const [rows] = await db.query('CALL LeerTodasLasPersonas();');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las personas', error });
    }
};

// Actualizar una persona
exports.actualizarPersona = async (req, res) => {
    const { idPersona, Nombre, Primer_Apellido, Segundo_Apellido, Fecha_Nacimiento, catalogo_persona_idCatalogo_Persona,
        Numero_Telefono, Detalle_Telefono, catalogo_telefono_idCatalogo_Telefono,
        Direccion_Especifica, distrito_idDistrito, distrito_canton_idCanton, distrito_canton_provincia_idprovincia,
        Descripcion_Correo, catalogo_correo_idCatalogo_Correo,
        Fecha_Ingreso, puesto_laboral_idpuesto_laboral,
        tipo_horario_idtipo_horario, Nombre_Usuario, Contrasena, roles_idroles
    } = req.body;

    try {
        // Llamada al procedimiento almacenado ActualizarPersona
        const [result] = await db.query(`
            CALL ActualizarPersona(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @resultado);
        `, [
            idPersona, Nombre, Primer_Apellido, Segundo_Apellido, Fecha_Nacimiento, catalogo_persona_idCatalogo_Persona,
            Numero_Telefono, Detalle_Telefono, catalogo_telefono_idCatalogo_Telefono,
            Direccion_Especifica, distrito_idDistrito, distrito_canton_idCanton, distrito_canton_provincia_idprovincia,
            Descripcion_Correo, catalogo_correo_idCatalogo_Correo,
            Fecha_Ingreso, puesto_laboral_idpuesto_laboral, tipo_horario_idtipo_horario,
            Nombre_Usuario, Contrasena, roles_idroles
        ]);

        const [resultado] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: resultado[0].mensaje });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la persona', error });
    }
};

// Desactivar una persona
exports.desactivarPersona = async (req, res) => {
    const { idPersona } = req.params;

    try {
        // Llamada al procedimiento almacenado DesactivarPersona
        const [result] = await db.query(`
            CALL DesactivarPersona(?, @resultado);
        `, [idPersona]);

        const [resultado] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: resultado[0].mensaje });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al desactivar la persona', error });
    }
};



// Eliminar una persona
exports.eliminarPersona = async (req, res) => {
    const { idPersona } = req.params;

    try {
        const [result] = await db.query('CALL EliminarPersona(?, @resultado);', [idPersona]);
        const [resultado] = await db.query('SELECT @resultado AS mensaje;');
        res.status(200).json({ message: resultado[0].mensaje });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la persona', error });
    }
};

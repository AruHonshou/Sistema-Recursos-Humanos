// controllers/empleadoController.js

const db = require('../config/db'); // Asegúrate de que el archivo de configuración de la DB está correcto

// Función para crear un nuevo empleado
async function crearEmpleado(req, res) {
    const { Fecha_Ingreso, puesto_laboral_idpuesto_laboral, persona_idPersona } = req.body; 
    let resultado, idEmpleado;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Llama al procedimiento almacenado
        await connection.query(
            'CALL CrearEmpleado(?, ?, ?, @idEmpleado, @resultado)',
            [Fecha_Ingreso, puesto_laboral_idpuesto_laboral, persona_idPersona]
        );

        const [rows] = await connection.query('SELECT @idEmpleado AS idEmpleado, @resultado AS resultado');
        resultado = rows[0].resultado;
        idEmpleado = rows[0].idEmpleado;

        await connection.commit();
        res.status(200).json({ mensaje: resultado, idEmpleado });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al crear el empleado' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para obtener todos los empleados
async function leerTodosEmpleados(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerTodosEmpleados()');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la lista de empleados' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para obtener un empleado por ID
async function leerEmpleadoPorID(req, res) {
    const { idEmpleado, persona_idPersona } = req.params; 
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerEmpleadoPorID(?, ?)', [idEmpleado, persona_idPersona]);
        
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ error: 'Empleado no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el empleado' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para actualizar un empleado
async function actualizarEmpleado(req, res) {
    const { idEmpleado, persona_idPersona, Fecha_Ingreso, puesto_laboral_idpuesto_laboral } = req.body; 
    let resultado;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL ActualizarEmpleado(?, ?, ?, ?, @resultado)',
            [idEmpleado, persona_idPersona, Fecha_Ingreso, puesto_laboral_idpuesto_laboral]
        );

        const [rows] = await connection.query('SELECT @resultado AS resultado');
        resultado = rows[0].resultado;

        await connection.commit();
        res.status(200).json({ mensaje: resultado });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el empleado' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para eliminar un empleado
async function eliminarEmpleado(req, res) {
    const { idEmpleado, persona_idPersona } = req.params; 
    let resultado;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'CALL EliminarEmpleado(?, ?, @resultado)',
            [idEmpleado, persona_idPersona]
        );

        const [rows] = await connection.query('SELECT @resultado AS resultado');
        resultado = rows[0].resultado;

        await connection.commit();
        res.status(200).json({ mensaje: resultado });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el empleado' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para leer todos los empleados con nombre completo
async function leerEmpleadosConNombreCompleto(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerEmpleadosConNombreCompleto()'); // Llama al procedimiento almacenado
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los empleados con nombre completo' });
    } finally {
        if (connection) connection.release();
    }
}

// Función para leer un empleado por idUsuario
async function leerEmpleadoPorIdUsuario(req, res) {
    const { idUsuario } = req.params;  // Asegúrate de que `idUsuario` sea un número entero
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('CALL LeerEmpleadoPorIdUsuario(?)', [parseInt(idUsuario, 10)]); // Convierte `idUsuario` a entero

        if (rows[0].length > 0) {
            res.status(200).json(rows[0][0]);
        } else {
            res.status(404).json({ error: 'Empleado no encontrado para el idUsuario proporcionado' });
        }
    } catch (error) {
        console.error("Error en leerEmpleadoPorIdUsuario:", error); // Mostrar el error completo
        res.status(500).json({ error: 'Error al obtener el empleado por idUsuario' });
    } finally {
        if (connection) connection.release();
    }
}


module.exports = {
    crearEmpleado,
    leerTodosEmpleados,
    leerEmpleadoPorID,
    actualizarEmpleado,
    eliminarEmpleado,
    leerEmpleadosConNombreCompleto,
    leerEmpleadoPorIdUsuario
};

const db = require('../config/db'); // Conexión a la base de datos

// Controlador para autenticar usuario
async function autenticarUsuario(req, res) {
    const { Nombre_Usuario, Contrasena } = req.body;
    let connection;
    try {
        connection = await db.getConnection();

        // Ejecutar la llamada al procedimiento almacenado
        await connection.query('CALL AutenticarUsuario(?, ?, @resultado)', [Nombre_Usuario, Contrasena]);

        // Obtener el valor del parámetro de salida
        const [rows] = await connection.query('SELECT @resultado AS resultado');

        // Extraer el resultado del procedimiento almacenado
        const resultado = rows[0]?.resultado;

        if (resultado) {
            if (resultado === 'Error:Usuario no existe') {
                res.status(401).json({ error: 'Usuario no existe' });
            } else if (resultado === 'Error:Contraseña incorrecta') {
                res.status(401).json({ error: 'Contraseña incorrecta' });
            } else if (resultado === 'Error:Usuario inactivo') {
                res.status(403).json({ error: 'Usuario inactivo' });
            } else if (resultado === 'Error:Acceso denegado hasta la fecha de ingreso') {
                res.status(403).json({ error: 'Acceso denegado hasta la fecha de ingreso' });
            } else if (resultado.startsWith('Success')) {
                const [_, idusuarios, roles_idroles] = resultado.split(':');
                res.status(200).json({
                    message: 'Autenticación exitosa',
                    idusuarios,
                    roles_idroles
                });
            } else {
                res.status(500).json({ error: 'Error desconocido al autenticar el usuario' });
            }
        } else {
            res.status(500).json({ error: 'Error desconocido al autenticar el usuario' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al autenticar el usuario' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    autenticarUsuario
};

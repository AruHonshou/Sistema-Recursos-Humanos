const express = require('express');
const cors = require('cors');  // Importar cors
const app = express();
const bodyParser = require('body-parser');

// Importar las rutas de catálogo de persona, teléfono, correo, provincia, cantón, distrito, horas extras e incapacidades
const catalogoPersonaRoutes = require('./routes/catalogoPersonaRoutes');
const catalogoTelefonoRoutes = require('./routes/catalogoTelefonoRoutes');
const catalogoCorreoRoutes = require('./routes/catalogoCorreoRoutes');
const provinciaRoutes = require('./routes/provinciaRoutes');
const cantonRoutes = require('./routes/cantonRoutes');
const distritoRoutes = require('./routes/distritoRoutes');
const catalogoHorasExtrasRoutes = require('./routes/catalogoHorasExtrasRoutes');
const catalogoIncapacidadesRoutes = require('./routes/catalogoIncapacidadesRoutes');
const diasRoutes = require('./routes/diasRoutes');
const feriadoRoutes = require('./routes/feriadoRoutes');
const tipoHorarioRoutes = require('./routes/tipoHorarioRoutes');
const catalogoTipoLiquidacionRoutes = require('./routes/catalogoTipoLiquidacionRoutes');
const puestoLaboralRoutes = require('./routes/puestoLaboralRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const personaRoutes = require('./routes/personaRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes'); // Importar las rutas de usuarios
const permisoRoutes = require('./routes/permisoSolicitadoRoutes');  // Rutas para permisos solicitados
const estadoSolicitudRoutes = require('./routes/estadoSolicitudRoutes'); // Importar las rutas de estado de solicitud
const catalogoPermisoRoutes = require('./routes/catalogoPermisoRoutes'); // Importar las rutas de catálogo de permiso
const empleadoRoutes = require('./routes/empleadoRoutes'); // Importar las rutas de estado de solicitud
const incapacidadRoutes = require('./routes/incapacidadRoutes'); // Importar las rutas de estado de solicitud
const datosPersonaRoutes = require('./routes/datosPersonaRoutes');
const calcularSalarioDiarioRoutes = require('./routes/calcularSalarioDiarioRoutes');
const mapeoDireccionRoutes = require('./routes/mapeoDireccionRoutes');
const personaTablaRoutes = require('./routes/personaTablaRoutes');
const vacacionesRoutes = require('./routes/vacacionesRoutes');


// Configuración de bodyParser para manejar datos JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de CORS para permitir peticiones desde el frontend
app.use(cors({
    origin: 'http://localhost:3001',  // Aquí va la URL del frontend, si está en el puerto 3000
    credentials: true  // Permite el envío de cookies y headers de autenticación (si es necesario)
}));

// Rutas para las diferentes entidades
app.use('/catalogoPersona', catalogoPersonaRoutes);//Ya
app.use('/catalogoTelefono', catalogoTelefonoRoutes);//ya
app.use('/catalogoCorreo', catalogoCorreoRoutes);//ya
app.use('/api/catalogoPermiso', catalogoPermisoRoutes); // Usar las rutas de catálogo de permiso
app.use('/api/provincias', provinciaRoutes);//ya
app.use('/api/cantones', cantonRoutes);//ya
app.use('/api/distritos', distritoRoutes);//ya
app.use('/catalogoHorasExtras', catalogoHorasExtrasRoutes);
app.use('/catalogoIncapacidades', catalogoIncapacidadesRoutes);
app.use('/api/dias', diasRoutes);//ya
app.use('/api/feriados', feriadoRoutes);//ya
app.use('/api/tipos-horario', tipoHorarioRoutes);//ya
app.use('/api/tipo-liquidacion', catalogoTipoLiquidacionRoutes);
app.use('/api/puesto-laboral', puestoLaboralRoutes);//ya
app.use('/api/roles', rolesRoutes);//ya
app.use('/api/personas', personaRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/permisos', permisoRoutes);  // Ruta para permisos solicitados
app.use('/api/estado-solicitud', estadoSolicitudRoutes); // Usar las rutas de estado de solicitud
app.use('/api/empleados', empleadoRoutes); // Usar las rutas de estado de solicitud
app.use('/api/incapacidad', incapacidadRoutes); // Usar las rutas de estado de solicitud
app.use('/api/datosPersona', datosPersonaRoutes);
app.use('/calcularSalarioDiario', calcularSalarioDiarioRoutes);
app.use('/api/direcciones', mapeoDireccionRoutes);
app.use('/api/detalles-empleados', personaTablaRoutes);
app.use('/api/vacaciones', vacacionesRoutes);




// Configuración del puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Importar las rutas
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
const usuariosRoutes = require('./routes/usuariosRoutes');
const permisoRoutes = require('./routes/permisoSolicitadoRoutes');
const estadoSolicitudRoutes = require('./routes/estadoSolicitudRoutes');
const catalogoPermisoRoutes = require('./routes/catalogoPermisoRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const incapacidadRoutes = require('./routes/incapacidadRoutes');
const datosPersonaRoutes = require('./routes/datosPersonaRoutes');
const calcularSalarioDiarioRoutes = require('./routes/calcularSalarioDiarioRoutes');
const mapeoDireccionRoutes = require('./routes/mapeoDireccionRoutes');
const personaTablaRoutes = require('./routes/personaTablaRoutes');
const vacacionesRoutes = require('./routes/vacacionesRoutes');
const marcaTiempoRoutes = require('./routes/marcaTiempoRoutes');
const horasExtrasRoutes = require('./routes/horasExtrasRoutes'); 
const aguinaldoRoutes = require('./routes/aguinaldoRoutes'); 
const planillaRoutes = require('./routes/planillaRoutes');   
const historialPlanillaRoutes = require('./routes/historialPlanillaRoutes');
const liquidacionesRoutes = require('./routes/liquidacionesRoutes');
const evaluacionRendimientoRoutes = require('./routes/evaluacionRendimientoRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');



// Configuración de bodyParser para manejar datos JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));

// Rutas para las diferentes entidades
app.use('/catalogoPersona', catalogoPersonaRoutes);
app.use('/catalogoTelefono', catalogoTelefonoRoutes);
app.use('/catalogoCorreo', catalogoCorreoRoutes);
app.use('/api/catalogoPermiso', catalogoPermisoRoutes);
app.use('/api/provincias', provinciaRoutes);
app.use('/api/cantones', cantonRoutes);
app.use('/api/distritos', distritoRoutes);
app.use('/catalogoHorasExtras', catalogoHorasExtrasRoutes);
app.use('/catalogoIncapacidades', catalogoIncapacidadesRoutes);
app.use('/api/dias', diasRoutes);
app.use('/api/feriados', feriadoRoutes);
app.use('/api/tipos-horario', tipoHorarioRoutes);
app.use('/api/tipo-liquidacion', catalogoTipoLiquidacionRoutes);
app.use('/api/puesto-laboral', puestoLaboralRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/permisos', permisoRoutes);
app.use('/api/estado-solicitud', estadoSolicitudRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/incapacidad', incapacidadRoutes);
app.use('/api/datosPersona', datosPersonaRoutes);
app.use('/calcularSalarioDiario', calcularSalarioDiarioRoutes);
app.use('/api/direcciones', mapeoDireccionRoutes);
app.use('/api/detalles-empleados', personaTablaRoutes);
app.use('/api/vacaciones', vacacionesRoutes);
app.use('/api/marcas', marcaTiempoRoutes);
app.use('/api/horas-extras', horasExtrasRoutes); 
app.use('/api/aguinaldo', aguinaldoRoutes);
app.use('/api/planillas', planillaRoutes); 
app.use('/api/historial-planillas', historialPlanillaRoutes); 
app.use('/api/liquidaciones', liquidacionesRoutes);
app.use('/api/evaluaciones-rendimiento', evaluacionRendimientoRoutes);
app.use('/api/dashboard', dashboardRoutes);


// Configuración del puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;

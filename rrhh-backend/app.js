const express = require('express');
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

// Configuración de bodyParser para manejar datos JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas para las diferentes entidades
app.use('/catalogoPersona', catalogoPersonaRoutes);
app.use('/catalogoTelefono', catalogoTelefonoRoutes);
app.use('/catalogoCorreo', catalogoCorreoRoutes);
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

// Configuración del puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;

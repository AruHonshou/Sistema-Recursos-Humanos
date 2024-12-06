import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [marcaInicio, setMarcaInicio] = useState('');
  const [marcaSalida, setMarcaSalida] = useState('');
  const [diasDisponibles, setDiasDisponibles] = useState(0);
  const [diasConsumidos, setDiasConsumidos] = useState(0);
  const [horasExtras, setHorasExtras] = useState(0);
  const [vecesHorasExtras, setVecesHorasExtras] = useState(0);
  const [evaluaciones, setEvaluaciones] = useState([]);

  // Obtener el nombre completo
  const obtenerNombreCompleto = async (idUsuario) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/dashboard/nombre-evaluaciones/${idUsuario}`);
      setNombreCompleto(response.data.nombreCompleto);
    } catch (error) {
      console.error('Error al obtener el nombre completo:', error);
    }
  };

  // Obtener el estado de la marca de inicio
  const verificarMarcaInicio = async (idUsuario) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/dashboard/verificar-marca-inicio/${idUsuario}`);
      setMarcaInicio(response.data.mensaje);
    } catch (error) {
      console.error('Error al verificar la marca de inicio:', error);
      setMarcaInicio('Error al verificar la marca de inicio');
    }
  };

  // Obtener el estado de la marca de salida
  const verificarMarcaSalida = async (idUsuario) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/dashboard/verificar-marca-salida/${idUsuario}`);
      setMarcaSalida(response.data.mensaje);
    } catch (error) {
      console.error('Error al verificar la marca de salida:', error);
      setMarcaSalida('Error al verificar la marca de salida');
    }
  };

  // Obtener días de vacación (disponibles y consumidos)
  const obtenerDiasVacacion = async (idUsuario) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/vacaciones/dias-vacacion/${idUsuario}`);
      const diasData = response.data[0][0];

      setDiasDisponibles(diasData.DiasDisponibles || 0);
      setDiasConsumidos(diasData.DiasConsumidos || 0);
    } catch (error) {
      console.error('Error al obtener los días de vacación:', error);
    }
  };

  // Obtener horas extras trabajadas del mes actual
  const obtenerHorasExtrasMensuales = async (idUsuario) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/dashboard/horas-extras-mensuales/${idUsuario}`);
      setHorasExtras(response.data.totalHorasExtras);
      setVecesHorasExtras(response.data.totalVeces);
    } catch (error) {
      console.error('Error al obtener las horas extras mensuales:', error);
    }
  };

  // Obtener todas las evaluaciones
  const obtenerEvaluaciones = async (idUsuario) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/dashboard/nombre-evaluaciones/${idUsuario}`);
      // Eliminar duplicados basados en descripcion_evaluacion
      const evaluacionesUnicas = response.data.evaluaciones.filter(
        (evaluacion, index, self) =>
          index === self.findIndex(e => e.descripcion_evaluacion === evaluacion.descripcion_evaluacion)
      );
      setEvaluaciones(evaluacionesUnicas);
    } catch (error) {
      console.error('Error al obtener las evaluaciones:', error);
    }
  };


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const idUsuario = user ? user.idusuarios : null;

    if (idUsuario) {
      obtenerNombreCompleto(idUsuario);
      verificarMarcaInicio(idUsuario);
      verificarMarcaSalida(idUsuario);
      obtenerDiasVacacion(idUsuario);
      obtenerHorasExtrasMensuales(idUsuario);
      obtenerEvaluaciones(idUsuario);
    } else {
      console.error('Usuario no encontrado en el local storage');
      setMarcaInicio('Usuario no encontrado');
      setMarcaSalida('Usuario no encontrado');
    }
  }, []);

  return (
    <div className="h-screen bg-[#f9f9f9] dark:bg-[#1E1E2F] p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Bienvenido al Sistema, {nombreCompleto}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Cuadro de Marca de Inicio */}
        <div className="p-6 rounded-lg shadow-lg border-l-4" style={{ backgroundColor: '#393E46', borderColor: '#00ADB5' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#00ADB5' }}>Marca de Inicio</h2>
          <p className="text-lg" style={{ color: '#EEEEEE' }}>
            {marcaInicio === 'No se ha registrado la marca de inicio para el día.'
              ? 'No, ve a registrar tu entrada'
              : marcaInicio === 'Marca de inicio registrada.'
                ? 'Registrado!!'
                : marcaInicio}
          </p>
        </div>

        {/* Cuadro de Marca de Salida */}
        <div className="p-6 rounded-lg shadow-lg border-l-4" style={{ backgroundColor: '#393E46', borderColor: '#00ADB5' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#00ADB5' }}>Marca de Salida</h2>
          <p className="text-lg" style={{ color: '#EEEEEE' }}>
            {marcaSalida === 'No se ha registrado la marca de salida para el día.'
              ? 'No, ve a registrar tu salida'
              : marcaSalida === 'Marca de salida registrada.'
                ? 'Registrado!!'
                : marcaSalida}
          </p>
        </div>

        {/* Cuadro de Días Disponibles Vacaciones */}
        <div className="p-6 rounded-lg shadow-lg border-l-4" style={{ backgroundColor: '#393E46', borderColor: '#00ADB5' }}>
          <h2 className="text-xl font-semibold mb-2" style={{ color: '#00ADB5' }}>Días Disponibles Vacaciones</h2>
          <p className="text-3xl font-bold" style={{ color: '#EEEEEE' }}>
            {diasDisponibles}
          </p>
        </div>

        {/* Cuadro de Días Consumidos Vacaciones */}
        <div className="p-6 rounded-lg shadow-lg border-l-4" style={{ backgroundColor: '#393E46', borderColor: '#00ADB5' }}>
          <h2 className="text-xl font-semibold mb-2" style={{ color: '#00ADB5' }}>Días Consumidos Vacaciones</h2>
          <p className="text-3xl font-bold" style={{ color: '#EEEEEE' }}>
            {diasConsumidos}
          </p>
        </div>

        {/* Tabla de Horas Extras Trabajadas */}
        <div className="p-6 rounded-lg shadow-lg border-l-4" style={{ backgroundColor: '#393E46', borderColor: '#00ADB5' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#00ADB5' }}>
            Horas Extras Trabajadas - {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
          </h2>
          <p className="text-lg" style={{ color: '#EEEEEE' }}>
            Horas Totales: <span className="font-semibold">{horasExtras}</span> <br />
            Veces Realizadas: <span className="font-semibold">{vecesHorasExtras}</span>
          </p>
        </div>

        {/* Tabla de Metas Anuales */}
        <div className="p-6 rounded-lg shadow-lg border-l-4" style={{ backgroundColor: '#393E46', borderColor: '#00ADB5' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#00ADB5' }}>Metas Anuales</h2>
          <ul className="text-lg" style={{ color: '#EEEEEE' }}>
            {evaluaciones.map((evaluacion, index) => (
              <li key={index} className="mb-1">
                {evaluacion.descripcion_evaluacion}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

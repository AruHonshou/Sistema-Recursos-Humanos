import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SolicitarVacaciones = () => {
  const [vacaciones, setVacaciones] = useState([]);
  const [empleados, setEmpleados] = useState([]); // Ensure empleados is an array initially
  const [diasDisponibles, setDiasDisponibles] = useState(0);
  const [diasConsumidos, setDiasConsumidos] = useState(0);
  const [modalCrear, setModalCrear] = useState(false);
  const [alertModal, setAlertModal] = useState({ visible: false, message: '', type: '' });
  const [nuevaVacacion, setNuevaVacacion] = useState({
    Fecha_Inicio: '',
    Fecha_Fin: '',
    Cantidad_Dias_Solicitados: 0,
    Fecha_Solicitud: '',
    Motivo_Vacacion: '',
    empleados_idEmpleado: ''
  });

  // Obtener todas las vacaciones
  const obtenerVacaciones = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const idusuario = user ? user.idusuarios : null;

      if (idusuario) {
        const response = await axios.get(`http://localhost:3000/api/vacaciones/usuario/${idusuario}`);
        setVacaciones(response.data[0]);
      } else {
        console.error('Usuario no encontrado en el local storage');
      }
    } catch (error) {
      console.error('Error al obtener las vacaciones:', error);
    }
  };

  // Obtener empleados
  const obtenerEmpleados = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const idusuario = user ? user.idusuarios : null;

      if (idusuario) {
        const response = await axios.get(`http://localhost:3000/api/empleados/usuario/${idusuario}`);
        setEmpleados([response.data]); // Wrap the object in an array to map over it in the dropdown
      } else {
        console.error('Usuario no encontrado en el local storage');
      }
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }
  };

  // Obtener días de vacación (disponibles y consumidos)
  const obtenerDiasVacacion = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const idusuario = user ? user.idusuarios : null;

      if (idusuario) {
        const response = await axios.get(`http://localhost:3000/api/vacaciones/dias-vacacion/${idusuario}`);
        const diasData = response.data[0][0]; // Extracting the days data

        setDiasDisponibles(diasData.DiasDisponibles || 0);
        setDiasConsumidos(diasData.DiasConsumidos || 0);
      } else {
        console.error('Usuario no encontrado en el local storage');
      }
    } catch (error) {
      console.error('Error al obtener los días de vacación:', error);
    }
  };

  const crearVacacion = async () => {
    const { Fecha_Inicio, Fecha_Fin, Cantidad_Dias_Solicitados, Motivo_Vacacion, empleados_idEmpleado } = nuevaVacacion;


    if (!Fecha_Inicio) {
      setAlertModal({ visible: true, message: 'Debe seleccionar la Fecha de Inicio', type: 'error' });
      return;
    }
    if (!Fecha_Fin) {
      setAlertModal({ visible: true, message: 'Debe seleccionar la Fecha de Fin', type: 'error' });
      return;
    }
    if (!Cantidad_Dias_Solicitados || Cantidad_Dias_Solicitados <= 0) {
      setAlertModal({ visible: true, message: 'La cantidad de días solicitados debe ser mayor a 0', type: 'error' });
      return;
    }
    if (!Motivo_Vacacion) {
      setAlertModal({ visible: true, message: 'Debe seleccionar un Motivo de Vacación', type: 'error' });
      return;
    }
    if (!empleados_idEmpleado) {
      setAlertModal({ visible: true, message: 'Debe seleccionar un Empleado', type: 'error' });
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/vacaciones/', nuevaVacacion);

      // Show success alert when vacation is successfully requested
      setAlertModal({ visible: true, message: 'Vacación solicitada', type: 'success' });

      setModalCrear(false);
      obtenerVacaciones();
    } catch (error) {
      const errorMessage = error.response && error.response.status === 400
        ? error.response.data.error
        : 'Error al crear la vacación';
      setAlertModal({ visible: true, message: errorMessage, type: 'error' });
      console.error('Error al crear la vacación:', error);
    }
  };


  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() - 6); // Adjust to UTC-6 for Costa Rica
    const costaRicaDate = now.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    setNuevaVacacion((prev) => ({ ...prev, Fecha_Solicitud: costaRicaDate }));
  }, []);
  useEffect(() => {
    obtenerVacaciones();
    obtenerEmpleados();
    obtenerDiasVacacion();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-[#393E46] dark:text-white text-center">Solicitar Vacaciones</h1>

      <button
        onClick={() => setModalCrear(true)}
        className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg mb-4 shadow-md transition duration-300 ease-in-out transform hover:scale-105 mx-auto block"
      >
        + Nueva Vacación
      </button>


      <div className="overflow-hidden rounded-lg shadow-2xl mb-4 animate-scale-up">
        <table className="min-w-full border rounded-md shadow-md">
          <thead className="bg-[#00ADB5]">
            <tr>
              <th className="px-4 py-2 text-white text-center">ID Empleado</th>
              <th className="px-4 py-2 text-white text-center">Nombre</th>
              <th className="px-4 py-2 text-white text-center">Fecha Inicio</th>
              <th className="px-4 py-2 text-white text-center">Fecha Fin</th>
              <th className="px-4 py-2 text-white text-center">Días Solicitados</th>
              <th className="px-4 py-2 text-white text-center">Fecha Solicitud</th>
              <th className="px-4 py-2 text-white text-center">Motivo</th>
              <th className="px-4 py-2 text-white text-center">Estado Solicitud</th>
            </tr>
          </thead>
          <tbody>
            {vacaciones.map((vacacion) => (
              <tr key={`${vacacion.Fecha_Inicio}-${vacacion.idEmpleado}`} className="border-b hover:bg-[#EEEEEE] dark:hover:bg-[#393E46] transition-all duration-200">
                <td className="px-4 py-2 text-[#393E46] dark:text-white text-center">{vacacion.idEmpleado}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-white text-center">{vacacion.Empleador}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-white text-center">{new Date(vacacion.Fecha_Inicio).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-white text-center">{new Date(vacacion.Fecha_Fin).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-white text-center">{vacacion.Cantidad_Dias_Solicitados}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-white text-center">{new Date(vacacion.Fecha_Solicitud).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-white text-center">{vacacion.Motivo_Vacacion}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-white text-center">
                  {vacacion.estado_solicitud_idestado_solicitud === 1 ? 'Aceptado' : vacacion.estado_solicitud_idestado_solicitud === 2 ? 'Rechazado' : 'En Espera'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>


      {/* Días Disponibles and Días Consumidos Boxes */}
      <div className="flex gap-4">
        <div className="w-1/2 p-4 bg-white dark:bg-[#2D2D3B] rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Días Disponibles</h2>
          <p className="text-2xl text-blue-500 dark:text-blue-300 font-bold">
            {diasDisponibles}
          </p>
        </div>
        <div className="w-1/2 p-4 bg-white dark:bg-[#2D2D3B] rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Días Consumidos</h2>
          <p className="text-2xl text-red-500 dark:text-red-300 font-bold">
            {diasConsumidos}
          </p>
        </div>
      </div>

      {/* Modal Crear */}
{modalCrear && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
    <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-2xl max-w-md w-full animate-scale-up">
      <h2 className="text-xl font-bold mb-4 text-[#393E46] dark:text-[#EEEEEE]">Crear Nueva Vacación</h2>
      <form>
        {/* Fecha de Inicio */}
        <div>
          <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Fecha de Inicio:</label>
          <input
            type="date"
            value={nuevaVacacion.Fecha_Inicio}
            onChange={(e) => {
              const fechaInicio = e.target.value;
              const fechaFin = nuevaVacacion.Fecha_Fin;
              const diasSolicitados = fechaInicio && fechaFin
                ? Math.ceil((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)) + 1
                : 0;
              setNuevaVacacion({ ...nuevaVacacion, Fecha_Inicio: fechaInicio, Cantidad_Dias_Solicitados: diasSolicitados });
            }}
            className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#3A3A4D] dark:text-[#EEEEEE]"
          />
        </div>

        {/* Fecha de Fin */}
        <div>
          <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Fecha de Fin:</label>
          <input
            type="date"
            value={nuevaVacacion.Fecha_Fin}
            onChange={(e) => {
              const fechaFin = e.target.value;
              const fechaInicio = nuevaVacacion.Fecha_Inicio;
              const diasSolicitados = fechaInicio && fechaFin
                ? Math.ceil((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)) + 1
                : 0;
              setNuevaVacacion({ ...nuevaVacacion, Fecha_Fin: fechaFin, Cantidad_Dias_Solicitados: diasSolicitados });
            }}
            className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#3A3A4D] dark:text-[#EEEEEE]"
          />
        </div>

        {/* Cantidad de Días Solicitados */}
        <div>
          <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Cantidad de Días Solicitados:</label>
          <input
            type="number"
            value={nuevaVacacion.Cantidad_Dias_Solicitados}
            readOnly
            className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#3A3A4D] dark:text-[#EEEEEE]"
          />
        </div>

        {/* Fecha de Solicitud (readonly) */}
        <div>
          <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Fecha de Solicitud:</label>
          <input
            type="date"
            value={nuevaVacacion.Fecha_Solicitud}
            readOnly
            className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#3A3A4D] dark:text-[#EEEEEE]"
          />
        </div>

        {/* Motivo de Vacación */}
        <div>
          <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Motivo de Vacación:</label>
          <select
            value={nuevaVacacion.Motivo_Vacacion}
            onChange={(e) => setNuevaVacacion({ ...nuevaVacacion, Motivo_Vacacion: e.target.value })}
            className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#3A3A4D] dark:text-[#EEEEEE]"
          >
            <option value="">Seleccione un Motivo</option>
            <option value="Vacaciones anuales">Vacaciones anuales</option>
            <option value="Vacaciones por motivos personales">Vacaciones por motivos personales</option>
            <option value="Vacaciones familiares">Vacaciones familiares</option>
            <option value="Vacaciones por salud">Vacaciones por salud</option>
            <option value="Vacaciones escolares">Vacaciones escolares</option>
            <option value="Vacaciones por estudios">Vacaciones por estudios</option>
            <option value="Vacaciones por viaje">Vacaciones por viaje</option>
            <option value="Vacaciones no programadas">Vacaciones no programadas</option>
            <option value="Vacaciones de fin de año">Vacaciones de fin de año</option>
            <option value="Vacaciones de medio año">Vacaciones de medio año</option>
          </select>
        </div>

        {/* Empleado */}
        <div>
          <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Empleado:</label>
          <select
            value={nuevaVacacion.empleados_idEmpleado}
            onChange={(e) => setNuevaVacacion({ ...nuevaVacacion, empleados_idEmpleado: e.target.value })}
            className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#3A3A4D] dark:text-[#EEEEEE]"
          >
            <option value="">Seleccione un Empleado</option>
            {empleados.length > 0 ? (
              empleados.map((empleado) => (
                <option key={empleado.idEmpleado} value={empleado.idEmpleado}>{empleado.NombreCompleto}</option>
              ))
            ) : (
              <option value="">Cargando empleados...</option>
            )}
          </select>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={crearVacacion}
            className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg shadow-md"
          >
            Crear
          </button>
          <button
            type="button"
            onClick={() => setModalCrear(false)}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg ml-2 shadow-md"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {alertModal.visible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className={`bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg max-w-md mx-auto text-center ${alertModal.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            <h2 className="text-xl font-bold mb-4">{alertModal.type === 'success' ? '¡Éxito!' : 'Error'}</h2>
            <p className="text-gray-700 dark:text-white">{alertModal.message}</p>
            <button
              onClick={() => setAlertModal({ visible: false, message: '', type: '' })}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default SolicitarVacaciones;

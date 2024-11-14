import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SolicitarHorasExtras = () => {
  const [errorModal, setErrorModal] = useState({ visible: false, message: '' });
  const [horasExtras, setHorasExtras] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [alertModal, setAlertModal] = useState({ visible: false, message: '', type: '' });
  const [modalCrear, setModalCrear] = useState(false);
  const [nuevaHoraExtra, setNuevaHoraExtra] = useState({
    fecha_hora_extra: '',
    empleados_idEmpleado: '',
    cantidad_horas: 0,
    hora_inicio: '',
    hora_final: ''
  });

  // Obtener horas extras para el usuario
  const obtenerHorasExtras = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const idusuario = user ? user.idusuarios : null;

      if (idusuario) {
        const response = await axios.get(`http://localhost:3000/api/horas-extras/usuario/${idusuario}`);
        const sortedHorasExtras = response.data[0].sort((a, b) => new Date(b.fecha_hora_extra) - new Date(a.fecha_hora_extra));
        setHorasExtras(sortedHorasExtras);
      } else {
        console.error('Usuario no encontrado en el local storage');
      }
    } catch (error) {
      console.error('Error al obtener las horas extras:', error);
    }
  };

  // Obtener empleados para el usuario
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

  const crearHoraExtra = async () => {
    const { fecha_hora_extra, empleados_idEmpleado, hora_inicio, hora_final } = nuevaHoraExtra;

    // Validation checks
    if (!fecha_hora_extra) {
      setAlertModal({ visible: true, message: 'Debe seleccionar la Fecha', type: 'error' });
      return;
    }
    if (!empleados_idEmpleado) {
      setAlertModal({ visible: true, message: 'Debe seleccionar un Empleado', type: 'error' });
      return;
    }
    if (!hora_inicio) {
      setAlertModal({ visible: true, message: 'Debe ingresar la Hora de Inicio', type: 'error' });
      return;
    }
    if (!hora_final) {
      setAlertModal({ visible: true, message: 'Debe ingresar la Hora Final', type: 'error' });
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/horas-extras/', nuevaHoraExtra);

      // Show success alert
      setAlertModal({ visible: true, message: 'Hora Extra Solicitada', type: 'success' });

      setModalCrear(false);
      obtenerHorasExtras();
    } catch (error) {
      const errorMessage = error.response && error.response.status === 400
        ? error.response.data.error
        : 'Error al crear la solicitud de horas extras';
      setAlertModal({ visible: true, message: errorMessage, type: 'error' });
      console.error('Error al crear la solicitud de horas extras:', error);
    }
  };


  // Calcular la cantidad de horas basadas en hora_inicio y hora_final
  useEffect(() => {
    if (nuevaHoraExtra.hora_inicio && nuevaHoraExtra.hora_final) {
      const inicio = new Date(`1970-01-01T${nuevaHoraExtra.hora_inicio}:00`);
      const final = new Date(`1970-01-01T${nuevaHoraExtra.hora_final}:00`);
      const diferenciaHoras = (final - inicio) / (1000 * 60 * 60); // Diferencia en horas
      setNuevaHoraExtra((prev) => ({
        ...prev,
        cantidad_horas: diferenciaHoras > 0 ? diferenciaHoras : 0
      }));
    }
  }, [nuevaHoraExtra.hora_inicio, nuevaHoraExtra.hora_final]);

  useEffect(() => {
    obtenerHorasExtras();
    obtenerEmpleados();
  }, []);

  return (
    <div className="p-6 bg-[#EEEEEE] dark:bg-[#222831] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-[#393E46] dark:text-[#EEEEEE] text-center animate-fade-in">
        Gestión de Horas Extras
      </h1>

      <button
        onClick={() => setModalCrear(true)}
        className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg mb-4 shadow-md transition duration-300 ease-in-out transform hover:scale-105 mx-auto block"
      >
        + Nueva Hora Extra
      </button>

      <div className="overflow-hidden rounded-lg shadow-lg animate-scale-up">
        <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
          <thead className="bg-[#00ADB5]">
            <tr>
              <th className="px-4 py-2 text-white text-center">ID Empleado</th>
              <th className="px-4 py-2 text-white text-center">Persona</th>
              <th className="px-4 py-2 text-white text-center">Fecha</th>
              <th className="px-4 py-2 text-white text-center">Cantidad de Horas</th>
              <th className="px-4 py-2 text-white text-center">Hora Inicio</th>
              <th className="px-4 py-2 text-white text-center">Hora Final</th>
              <th className="px-4 py-2 text-white text-center">Monto</th>
              <th className="px-4 py-2 text-white text-center">Tipo de Hora Extra</th>
              <th className="px-4 py-2 text-white text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {horasExtras.map((horaExtra) => (
              <tr
                key={`${horaExtra.fecha_hora_extra}-${horaExtra.empleados_idEmpleado}`}
                className="border-b hover:bg-[#EEEEEE] dark:hover:bg-[#393E46] transition-all duration-200"
              >
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{horaExtra.idEmpleado}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{horaExtra.Persona}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">
                  {new Date(horaExtra.fecha_hora_extra).toISOString().split('T')[0]}
                </td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{horaExtra.Cantidad_Horas_Extras}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{horaExtra.Hora_Inicio}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{horaExtra.Hora_Final}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">₡{horaExtra.Monto_Hora_Extra}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{horaExtra.tipo_hora_extra}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">
                  {horaExtra.estado_solicitud === 'Aprobado'
                    ? 'Aceptado'
                    : horaExtra.estado_solicitud === 'Rechazado'
                      ? 'Rechazado'
                      : 'En Espera'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>



      {/* Modal Crear */}
      {modalCrear && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg max-w-md w-full animate-scale-up">
            <h2 className="text-xl font-bold mb-4 text-[#393E46] dark:text-[#EEEEEE]">Crear Nueva Hora Extra</h2>
            <form>
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Fecha:</label>
                <input
                  type="date"
                  value={nuevaHoraExtra.fecha_hora_extra}
                  onChange={(e) => setNuevaHoraExtra({ ...nuevaHoraExtra, fecha_hora_extra: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
                />
              </div>

              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Empleado:</label>
                <select
                  value={nuevaHoraExtra.empleados_idEmpleado}
                  onChange={(e) => setNuevaHoraExtra({ ...nuevaHoraExtra, empleados_idEmpleado: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
                >
                  <option value="">Seleccione un Empleado</option>
                  {empleados.length > 0 ? (
                    empleados.map((empleado) => (
                      <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                        {empleado.NombreCompleto}
                      </option>
                    ))
                  ) : (
                    <option value="">Cargando empleados...</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Hora de Inicio:</label>
                <input
                  type="time"
                  value={nuevaHoraExtra.hora_inicio}
                  onChange={(e) => setNuevaHoraExtra({ ...nuevaHoraExtra, hora_inicio: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
                />
              </div>

              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Hora Final:</label>
                <input
                  type="time"
                  value={nuevaHoraExtra.hora_final}
                  onChange={(e) => setNuevaHoraExtra({ ...nuevaHoraExtra, hora_final: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
                />
              </div>

              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Cantidad de Horas:</label>
                <input
                  type="number"
                  value={nuevaHoraExtra.cantidad_horas}
                  readOnly
                  className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
                />
              </div>

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={() => setModalCrear(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={crearHoraExtra}
                  className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {errorModal.visible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg max-w-md mx-auto text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 dark:text-white">{errorModal.message}</p>
            <button
              onClick={() => setErrorModal({ visible: false, message: '' })}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
            >
              Cerrar
            </button>
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

export default SolicitarHorasExtras;

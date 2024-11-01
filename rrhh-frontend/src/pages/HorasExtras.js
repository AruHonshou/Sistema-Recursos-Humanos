import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaTrashAlt } from 'react-icons/fa';

const HoraExtra = () => {
  const [errorModal, setErrorModal] = useState({ visible: false, message: '' });
  const [horasExtras, setHorasExtras] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [modalCrear, setModalCrear] = useState(false);
  const [nuevaHoraExtra, setNuevaHoraExtra] = useState({
    fecha_hora_extra: '',
    empleados_idEmpleado: '',
    cantidad_horas: 0,
    hora_inicio: '',
    hora_final: ''
  });

  // Obtener todas las horas extras
  const obtenerHorasExtras = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/horas-extras/');
      setHorasExtras(response.data[0]);
    } catch (error) {
      console.error('Error al obtener las horas extras:', error);
    }
  };

  // Obtener empleados
  const obtenerEmpleados = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/empleados/nombre-completo');
      setEmpleados(response.data[0]);
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }
  };

  // Crear nueva solicitud de horas extras
  const crearHoraExtra = async () => {
    try {
      await axios.post('http://localhost:3000/api/horas-extras/', nuevaHoraExtra);
      setModalCrear(false);
      obtenerHorasExtras();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorModal({ visible: true, message: error.response.data.error });
      } else {
        console.error('Error al crear la solicitud de horas extras:', error);
        setErrorModal({ visible: true, message: 'Error al crear la solicitud de horas extras' });
      }
    }
  };


  // Formatear la fecha a YYYY-MM-DD
  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Función para aceptar horas extras
  const aceptarHoraExtra = async (fecha, idEmpleado) => {
    try {
      await axios.put('http://localhost:3000/api/horas-extras', {
        fecha_hora_extra: formatDate(fecha),
        empleados_idEmpleado: idEmpleado,
        estado_solicitud_idestado_solicitud: 1, // Estado "Aprobado"
      });
      await obtenerHorasExtras(); // Refrescar datos después de aceptar
    } catch (error) {
      console.error('Error al aceptar la solicitud de horas extras:', error);
    }
  };

  // Función para rechazar horas extras
  const rechazarHoraExtra = async (fecha, idEmpleado) => {
    try {
      await axios.put('http://localhost:3000/api/horas-extras', {
        fecha_hora_extra: formatDate(fecha),
        empleados_idEmpleado: idEmpleado,
        estado_solicitud_idestado_solicitud: 2, // Estado "Rechazado"
      });
      await obtenerHorasExtras(); // Refrescar datos después de rechazar
    } catch (error) {
      console.error('Error al rechazar la solicitud de horas extras:', error);
    }
  };

  // Función para eliminar horas extras
  const eliminarHoraExtra = async (fecha, idEmpleado) => {
    try {
      await axios.delete(`http://localhost:3000/api/horas-extras/${formatDate(fecha)}/${idEmpleado}`);
      obtenerHorasExtras();
    } catch (error) {
      console.error('Error al eliminar la solicitud de horas extras:', error);
    }
  };

  // Calcular la cantidad de horas basadas en hora_inicio y hora_final cuando ambos están presentes
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
    <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Gestión de Horas Extras</h1>

      <button
        onClick={() => setModalCrear(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 shadow-md transition duration-300 ease-in-out transform hover:scale-105 mx-auto block"
      >
        + Nueva Hora Extra
      </button>

      <div className="overflow-hidden rounded-lg shadow-lg">
        <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
          <thead className="bg-gray-100 dark:bg-[#3A3A4D] border-b">
            <tr>
              <th className="px-4 py-2 text-black dark:text-white text-center">ID Empleado</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Persona</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Fecha</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Cantidad de Horas</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Hora Inicio</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Hora Final</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Monto</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Tipo de Hora Extra</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Estado</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {horasExtras
              // Ordenar para mostrar primero los elementos en estado "En Espera"
              .sort((a, b) => {
                if (a.estado_solicitud === 'En Espera') return -1;
                if (b.estado_solicitud === 'En Espera') return 1;
                return 0;
              })
              .map((horaExtra) => (
                <tr key={`${horaExtra.fecha_hora_extra}-${horaExtra.empleados_idEmpleado}`} className="border-b dark:border-[#4D4D61]">
                  <td className="px-4 py-2 text-black dark:text-white text-center">{horaExtra.idEmpleado}</td>
                  <td className="px-4 py-2 text-black dark:text-white text-center">{horaExtra.Persona}</td>
                  <td className="px-4 py-2 text-black dark:text-white text-center">{formatDate(horaExtra.fecha_hora_extra)}</td>
                  <td className="px-4 py-2 text-black dark:text-white text-center">{horaExtra.Cantidad_Horas_Extras}</td>
                  <td className="px-4 py-2 text-black dark:text-white text-center">{horaExtra.Hora_Inicio}</td>
                  <td className="px-4 py-2 text-black dark:text-white text-center">{horaExtra.Hora_Final}</td>
                  <td className="px-4 py-2 text-black dark:text-white text-center">{horaExtra.Monto_Hora_Extra}</td>
                  <td className="px-4 py-2 text-black dark:text-white text-center">{horaExtra.tipo_hora_extra}</td>
                  <td className="px-4 py-2 text-black dark:text-white text-center">
                    {horaExtra.estado_solicitud === 'Aprobado' ? 'Aceptado' : horaExtra.estado_solicitud === 'Rechazado' ? 'Rechazado' : 'En Espera'}
                  </td>
                  <td className="px-4 py-2 flex justify-center space-x-2">
                    <button
                      onClick={() => aceptarHoraExtra(horaExtra.fecha_hora_extra, horaExtra.idEmpleado)}
                      className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-lg shadow-md"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => rechazarHoraExtra(horaExtra.fecha_hora_extra, horaExtra.idEmpleado)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg shadow-md"
                    >
                      <FaTimes />
                    </button>
                    <button
                      onClick={() => eliminarHoraExtra(horaExtra.fecha_hora_extra, horaExtra.idEmpleado)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg shadow-md"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>

        </table>
      </div>

      {/* Modal Crear */}
      {modalCrear && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Crear Nueva Hora Extra</h2>
            <form>
              <div>
                <label className="block mb-2">Fecha:</label>
                <input
                  type="date"
                  value={nuevaHoraExtra.fecha_hora_extra}
                  onChange={(e) => setNuevaHoraExtra({ ...nuevaHoraExtra, fecha_hora_extra: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-2">Empleado:</label>
                <select
                  value={nuevaHoraExtra.empleados_idEmpleado}
                  onChange={(e) => setNuevaHoraExtra({ ...nuevaHoraExtra, empleados_idEmpleado: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                >
                  <option value="">Seleccione un Empleado</option>
                  {empleados.map((empleado) => (
                    <option key={empleado.idEmpleado} value={empleado.idEmpleado}>{empleado.NombreCompleto}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Hora de Inicio:</label>
                <input
                  type="time"
                  value={nuevaHoraExtra.hora_inicio}
                  onChange={(e) => setNuevaHoraExtra({ ...nuevaHoraExtra, hora_inicio: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-2">Hora Final:</label>
                <input
                  type="time"
                  value={nuevaHoraExtra.hora_final}
                  onChange={(e) => setNuevaHoraExtra({ ...nuevaHoraExtra, hora_final: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-2">Cantidad de Horas:</label>
                <input
                  type="number"
                  value={nuevaHoraExtra.cantidad_horas}
                  readOnly
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={crearHoraExtra}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setModalCrear(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-lg"
                >
                  Cancelar
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

    </div>
  );
};

export default HoraExtra;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaTrashAlt } from 'react-icons/fa';
import 'jspdf-autotable';

const Vacaciones = () => {
  const [vacaciones, setVacaciones] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalActualizar, setModalActualizar] = useState(false);
  const [nuevaVacacion, setNuevaVacacion] = useState({
    Fecha_Inicio: '',
    Fecha_Fin: '',
    Cantidad_Dias_Solicitados: 0,
    Fecha_Solicitud: '',
    Motivo_Vacacion: '',
    empleados_idEmpleado: ''
  });
  const [vacacionActualizar, setVacacionActualizar] = useState({
    Fecha_Inicio: '',
    empleados_idEmpleado: '',
    estado_solicitud_idestado_solicitud: ''
  });

  // Obtener todas las vacaciones
  const obtenerVacaciones = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/vacaciones/');
      setVacaciones(response.data[0]);
    } catch (error) {
      console.error('Error al obtener las vacaciones:', error);
    }
  };

  // Obtener empleados
  const obtenerEmpleados = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/empleados/nombre-completo');
      setEmpleados(response.data[0]); // Asignar directamente la lista de empleados con idEmpleado y NombreCompleto
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }
  };

  // Crear nueva vacación
  const crearVacacion = async () => {
    try {
      await axios.post('http://localhost:3000/api/vacaciones/', nuevaVacacion);
      setModalCrear(false);
      obtenerVacaciones();
    } catch (error) {
      console.error('Error al crear la vacación:', error);
    }
  };

  // Actualizar vacación
  const actualizarVacacion = async () => {
    try {
      await axios.put('http://localhost:3000/api/vacaciones/', vacacionActualizar);
      setModalActualizar(false);
      obtenerVacaciones();
    } catch (error) {
      console.error('Error al actualizar la vacación:', error);
    }
  };

  // Eliminar vacación
  const eliminarVacacion = async (Fecha_Inicio, empleados_idEmpleado) => {
    try {
      await axios.delete(`http://localhost:3000/api/vacaciones/${Fecha_Inicio}/${empleados_idEmpleado}`);
      obtenerVacaciones();
    } catch (error) {
      console.error('Error al eliminar la vacación:', error);
    }
  };

  // Aceptar vacación
  const aceptarVacacion = async (Fecha_Inicio, empleados_idEmpleado) => {
    try {
      await axios.put('http://localhost:3000/api/vacaciones/', {
        Fecha_Inicio,
        empleados_idEmpleado,
        estado_solicitud_idestado_solicitud: 1,
      });
      obtenerVacaciones();
    } catch (error) {
      console.error('Error al aceptar la vacación:', error);
    }
  };

  // Rechazar vacación
  const rechazarVacacion = async (Fecha_Inicio, empleados_idEmpleado) => {
    try {
      await axios.put('http://localhost:3000/api/vacaciones/', {
        Fecha_Inicio,
        empleados_idEmpleado,
        estado_solicitud_idestado_solicitud: 2,
      });
      obtenerVacaciones();
    } catch (error) {
      console.error('Error al rechazar la vacación:', error);
    }
  };

  useEffect(() => {
    obtenerVacaciones();
    obtenerEmpleados();
  }, []);

  return (
    <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Gestión de Vacaciones</h1>

      <button
        onClick={() => setModalCrear(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 shadow-md transition duration-300 ease-in-out transform hover:scale-105 mx-auto block"
      >
        + Nueva Vacación
      </button>

      <div className="overflow-hidden rounded-lg shadow-lg">
        <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
          <thead className="bg-gray-100 dark:bg-[#3A3A4D] border-b">
            <tr>
              <th className="px-4 py-2 text-black dark:text-white text-center">ID Empleado</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Nombre</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Inicio</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Fin</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Días Solicitados</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Solicitud</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Días Disponibles</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Días Consumidos</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Motivo</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Estado Solicitud</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vacaciones.map((vacacion) => (
              <tr key={`${new Date(vacacion.Fecha_Inicio).toISOString()}-${vacacion.idEmpleado}`} className="border-b dark:border-[#4D4D61]">
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.idEmpleado}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.Empleador || 'Cargando...'}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(vacacion.Fecha_Inicio).toISOString().split('T')[0]}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(vacacion.Fecha_Fin).toISOString().split('T')[0]}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.Cantidad_Dias_Solicitados}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(vacacion.Fecha_Solicitud).toISOString().split('T')[0]}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.DiasDisponibles}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.DiasConsumidos}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.Motivo_Vacacion}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.estado_solicitud_idestado_solicitud === 1 ? 'Aceptado' : vacacion.estado_solicitud_idestado_solicitud === 2 ? 'Rechazado' : 'En Espera'}</td>
                <td className="px-4 py-2 flex justify-center space-x-2">
                  {/* Botón para aceptar */}
                  <button
                    onClick={() => aceptarVacacion(new Date(vacacion.Fecha_Inicio).toISOString().split('T')[0], vacacion.idEmpleado)}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FaCheck />
                  </button>

                  {/* Botón para rechazar */}
                  <button
                    onClick={() => rechazarVacacion(new Date(vacacion.Fecha_Inicio).toISOString().split('T')[0], vacacion.idEmpleado)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FaTimes />
                  </button>
                  {/* Botón para eliminar */}
                  <button
                    onClick={() => eliminarVacacion(new Date(vacacion.Fecha_Inicio).toISOString().split('T')[0], vacacion.idEmpleado)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
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
            <h2 className="text-xl font-bold mb-4">Crear Nueva Vacación</h2>
            <form>
              {/* Fecha de Inicio */}
              <div>
                <label className="block mb-2">Fecha de Inicio:</label>
                <input
                  type="date"
                  value={nuevaVacacion.Fecha_Inicio}
                  onChange={(e) => {
                    const fechaInicio = e.target.value;
                    const fechaFin = nuevaVacacion.Fecha_Fin;
                    const diasSolicitados = fechaInicio && fechaFin ? Math.ceil((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)) : 0;
                    setNuevaVacacion({ ...nuevaVacacion, Fecha_Inicio: fechaInicio, Cantidad_Dias_Solicitados: diasSolicitados });
                  }}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              {/* Fecha de Fin */}
              <div>
                <label className="block mb-2">Fecha de Fin:</label>
                <input
                  type="date"
                  value={nuevaVacacion.Fecha_Fin}
                  onChange={(e) => {
                    const fechaFin = e.target.value;
                    const fechaInicio = nuevaVacacion.Fecha_Inicio;
                    const diasSolicitados = fechaInicio && fechaFin ? Math.ceil((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)) : 0;
                    setNuevaVacacion({ ...nuevaVacacion, Fecha_Fin: fechaFin, Cantidad_Dias_Solicitados: diasSolicitados });
                  }}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              {/* Cantidad de Días Solicitados */}
              <div>
                <label className="block mb-2">Cantidad de Días Solicitados:</label>
                <input
                  type="number"
                  value={nuevaVacacion.Cantidad_Dias_Solicitados}
                  readOnly
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              {/* Fecha de Solicitud */}
              <div>
                <label className="block mb-2">Fecha de Solicitud:</label>
                <input
                  type="date"
                  value={nuevaVacacion.Fecha_Solicitud}
                  onChange={(e) => setNuevaVacacion({ ...nuevaVacacion, Fecha_Solicitud: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              {/* Motivo de Vacación */}
              <div>
                <label className="block mb-2">Motivo de Vacación:</label>
                <input
                  type="text"
                  value={nuevaVacacion.Motivo_Vacacion}
                  onChange={(e) => setNuevaVacacion({ ...nuevaVacacion, Motivo_Vacacion: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              {/* Empleado */}
              <div>
                <label className="block mb-2">Empleado:</label>
                <select
                  value={nuevaVacacion.empleados_idEmpleado}
                  onChange={(e) => setNuevaVacacion({ ...nuevaVacacion, empleados_idEmpleado: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                >
                  <option value="">Seleccione un Empleado</option>
                  {empleados.map((empleado) => (
                    <option key={empleado.idEmpleado} value={empleado.idEmpleado}>{empleado.NombreCompleto}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={crearVacacion}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md"
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setModalCrear(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md ml-2"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Actualizar */}
      {modalActualizar && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Actualizar Vacación</h2>
            <form>
              {/* Fecha de Inicio */}
              <div>
                <label className="block mb-2">Fecha de Inicio:</label>
                <input type="date" value={vacacionActualizar.Fecha_Inicio} readOnly
                  onChange={(e) => setVacacionActualizar({ ...vacacionActualizar, Fecha_Inicio: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              {/* Empleado */}
              <div>
                <label className="block mb-2">Empleado:</label>
                <select
                  value={vacacionActualizar.empleados_idEmpleado}
                  onChange={(e) => setVacacionActualizar({ ...vacacionActualizar, empleados_idEmpleado: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                >
                  <option value="">Seleccione un Empleado</option>
                  {empleados.map((empleado) => (
                    <option key={empleado.idEmpleado} value={empleado.idEmpleado}>{empleado.NombreCompleto}</option>
                  ))}
                </select>
              </div>

              {/* Estado de Solicitud */}
              <div>
                <label className="block mb-2">Estado de Solicitud:</label>
                <select
                  value={vacacionActualizar.estado_solicitud_idestado_solicitud}
                  onChange={(e) => setVacacionActualizar({ ...vacacionActualizar, estado_solicitud_idestado_solicitud: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                >
                  <option value="">Seleccione Estado de Solicitud</option>
                  <option value="1">Aceptar</option>
                  <option value="2">Rechazar</option>
                </select>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={actualizarVacacion}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md"
                >
                  Actualizar
                </button>
                <button
                  type="button"
                  onClick={() => setModalActualizar(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md ml-2"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vacaciones;

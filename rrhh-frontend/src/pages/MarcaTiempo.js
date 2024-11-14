import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const MarcaTiempo = () => {
  const [marcas, setMarcas] = useState([]);
  const [errorModal, setErrorModal] = useState({ visible: false, message: '' });
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    idEmpleado: '',
    Fecha: '',
    Hora: ''
  });
  const [showJustificarEntrada, setShowJustificarEntrada] = useState(false);
  const [showJustificarSalida, setShowJustificarSalida] = useState(false);
  const [justificacionData, setJustificacionData] = useState({
    idEmpleado: '',
    Fecha: '',
    Motivo: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Fetch all attendance records
  const obtenerMarcas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/marcas/todas-marcas-persona');
      const sortedMarcas = response.data[0].sort((a, b) => new Date(b.Fecha_Marca) - new Date(a.Fecha_Marca));
      setMarcas(sortedMarcas);
    } catch (error) {
      console.error('Error al obtener las marcas de tiempo:', error);
    }
  };

  // Fetch all employees
  const obtenerEmpleados = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/empleados/nombre-completo');
      setEmpleados(response.data[0]);
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }
  };

  useEffect(() => {
    obtenerMarcas();
    obtenerEmpleados();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleJustificacionChange = (e) => {
    setJustificacionData({
      ...justificacionData,
      [e.target.name]: e.target.value
    });
  };

  const registrarMarcaInicio = async () => {
    try {
      await axios.post('http://localhost:3000/api/marcas/inicio', formData);
      alert('Marca de inicio registrada exitosamente');
      obtenerMarcas();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorModal({ visible: true, message: error.response.data.error });
      } else {
        console.error('Error al registrar la marca de inicio:', error);
        setErrorModal({ visible: true, message: 'Error al registrar la marca de inicio' });
      }
    }
  };

  const registrarMarcaSalida = async () => {
    try {
      await axios.post('http://localhost:3000/api/marcas/salida', formData);
      alert('Marca de salida registrada exitosamente');
      obtenerMarcas();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorModal({ visible: true, message: error.response.data.error });
      } else {
        console.error('Error al registrar la marca de salida:', error);
        setErrorModal({ visible: true, message: 'Error al registrar la marca de salida' });
      }
    }
  };

  const justificarEntrada = async () => {
    try {
      await axios.post('http://localhost:3000/api/marcas/justificar-entrada', justificacionData);
      alert('Justificación de entrada registrada exitosamente');
      setShowJustificarEntrada(false);
      obtenerMarcas();
    } catch (error) {
      console.error('Error al justificar la entrada:', error);
    }
  };

  const justificarSalida = async () => {
    try {
      await axios.post('http://localhost:3000/api/marcas/justificar-salida', justificacionData);
      alert('Justificación de salida registrada exitosamente');
      setShowJustificarSalida(false);
      obtenerMarcas();
    } catch (error) {
      console.error('Error al justificar la salida:', error);
    }
  };

  const eliminarMarcaTiempo = async (idEmpleado, Fecha_Marca, Movimiento) => {
    const confirmacion = await Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/marcas/eliminar/${idEmpleado}/${Fecha_Marca}/${Movimiento}`);
        Swal.fire('Eliminado', 'La marca de tiempo ha sido eliminada.', 'success');
        obtenerMarcas();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la marca de tiempo.', 'error');
      }
    }
  };

  const cancelarJustificacion = () => {
    setShowJustificarEntrada(false);
    setShowJustificarSalida(false);
    setJustificacionData({ idEmpleado: '', Fecha: '', Motivo: '' });
  };

  // Pagination handling
  const lastRecordIndex = currentPage * recordsPerPage;
  const firstRecordIndex = lastRecordIndex - recordsPerPage;
  const currentRecords = marcas.slice(firstRecordIndex, lastRecordIndex);
  const totalPages = Math.ceil(marcas.length / recordsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-6 bg-[#EEEEEE] dark:bg-[#222831] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-[#393E46] dark:text-[#EEEEEE] text-center animate-fade-in">
        Control de Asistencia
      </h1>

      <div className="flex justify-center space-x-4 mb-6">
        {/* Hora Entrada Form */}
        <div className="bg-white dark:bg-[#2D2D3B] p-4 rounded-lg shadow-lg animate-scale-up">
          <h2 className="text-lg font-semibold mb-2 text-[#393E46] dark:text-[#EEEEEE]">Registrar Hora de Entrada</h2>
          <select
            name="idEmpleado"
            value={formData.idEmpleado}
            onChange={handleInputChange}
            className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
          >
            <option value="">Seleccionar Empleador</option>
            {empleados.map((empleado) => (
              <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                {empleado.NombreCompleto}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="Fecha"
            value={formData.Fecha}
            onChange={handleInputChange}
            className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
          />
          <input
            type="time"
            name="Hora"
            value={formData.Hora}
            onChange={handleInputChange}
            className="border rounded-lg w-full px-3 py-2 mb-4 dark:bg-[#393E46] dark:text-[#EEEEEE]"
          />
          <button
            onClick={registrarMarcaInicio}
            className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg shadow-md w-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Hora Entrada
          </button>
        </div>

        {/* Hora Salida Form */}
        <div className="bg-white dark:bg-[#2D2D3B] p-4 rounded-lg shadow-lg animate-scale-up">
          <h2 className="text-lg font-semibold mb-2 text-[#393E46] dark:text-[#EEEEEE]">Registrar Hora de Salida</h2>
          <select
            name="idEmpleado"
            value={formData.idEmpleado}
            onChange={handleInputChange}
            className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
          >
            <option value="">Seleccionar Empleador</option>
            {empleados.map((empleado) => (
              <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                {empleado.NombreCompleto}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="Fecha"
            value={formData.Fecha}
            onChange={handleInputChange}
            className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
          />
          <input
            type="time"
            name="Hora"
            value={formData.Hora}
            onChange={handleInputChange}
            className="border rounded-lg w-full px-3 py-2 mb-4 dark:bg-[#393E46] dark:text-[#EEEEEE]"
          />
          <button
            onClick={registrarMarcaSalida}
            className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg shadow-md w-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Hora Salida
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg shadow-lg mb-6 animate-scale-up">
        <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
          <thead className="bg-[#00ADB5]">
            <tr>
              <th className="px-4 py-2 text-white text-center">ID Empleado</th>
              <th className="px-4 py-2 text-white text-center">Persona</th>
              <th className="px-4 py-2 text-white text-center">Movimiento</th>
              <th className="px-4 py-2 text-white text-center">Fecha Marca</th>
              <th className="px-4 py-2 text-white text-center">Marca Hora</th>
              <th className="px-4 py-2 text-white text-center">Tardía/Salida Anticipada</th>
              <th className="px-4 py-2 text-white text-center">Justificada</th>
              <th className="px-4 py-2 text-white text-center">Motivo Justificación</th>
              <th className="px-4 py-2 text-white text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((marca, index) => (
              <tr key={index} className="border-b hover:bg-[#EEEEEE] dark:hover:bg-[#393E46] transition-all duration-200">
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{marca.idEmpleado}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{marca.Persona}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{marca.Movimiento}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">
                  {new Date(marca.Fecha_Marca).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{marca.Marca_Hora}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">
                  {marca.Tardia?.data?.[0] === 1 ? 'Sí' : 'No'}
                </td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">
                  {marca.Justificada?.data?.[0] === 1 ? 'Sí' : 'No'}
                </td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">
                  {marca.Motivo_Justificacion || 'No necesario'}
                </td>
                <td className="px-4 py-2 flex justify-center space-x-2">
                  <button
                    onClick={() => {
                      setJustificacionData({
                        idEmpleado: marca.idEmpleado,
                        Fecha: new Date(marca.Fecha_Marca).toISOString().split('T')[0],
                        Motivo: ''
                      });
                      setShowJustificarEntrada(true);
                    }}
                    disabled={marca.Tardia?.data?.[0] === 0}
                    className={`bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg shadow-md ${marca.Tardia?.data?.[0] === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Justificar Entrada
                  </button>
                  <button
                    onClick={() => {
                      setJustificacionData({
                        idEmpleado: marca.idEmpleado,
                        Fecha: new Date(marca.Fecha_Marca).toISOString().split('T')[0],
                        Motivo: ''
                      });
                      setShowJustificarSalida(true);
                    }}
                    disabled={marca.Tardia?.data?.[0] === 0}
                    className={`bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-lg shadow-md ${marca.Tardia?.data?.[0] === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Justificar Salida
                  </button>
                  <button
                    onClick={() => eliminarMarcaTiempo(
                      marca.idEmpleado,
                      new Date(marca.Fecha_Marca).toISOString().split('T')[0],
                      marca.Movimiento === 'Entrada' ? 1 : 2
                    )}
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

      {/* Modal Justificar Entrada */}
      {showJustificarEntrada && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg max-w-md mx-auto animate-scale-up">
            <h2 className="text-xl font-bold mb-4 text-[#393E46] dark:text-[#EEEEEE]">Justificar Entrada</h2>
            <select
              name="idEmpleado"
              value={justificacionData.idEmpleado}
              onChange={handleJustificacionChange}
              className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
            >
              <option value="">Seleccionar Empleador</option>
              {empleados.map((empleado) => (
                <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                  {empleado.NombreCompleto}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="Fecha"
              value={justificacionData.Fecha}
              onChange={handleJustificacionChange}
              className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
            />
            <textarea
              name="Motivo"
              value={justificacionData.Motivo}
              onChange={handleJustificacionChange}
              className="border rounded-lg w-full px-3 py-2 mb-4 dark:bg-[#393E46] dark:text-[#EEEEEE]"
              placeholder="Escriba la justificación"
            />
            <button
              onClick={justificarEntrada}
              className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg shadow-md w-full mb-2 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Justificar Entrada
            </button>
            <button
              onClick={cancelarJustificacion}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md w-full"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal Justificar Salida */}
      {showJustificarSalida && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg max-w-md mx-auto animate-scale-up">
            <h2 className="text-xl font-bold mb-4 text-[#393E46] dark:text-[#EEEEEE]">Justificar Salida</h2>
            <select
              name="idEmpleado"
              value={justificacionData.idEmpleado}
              onChange={handleJustificacionChange}
              className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
            >
              <option value="">Seleccionar Empleador</option>
              {empleados.map((empleado) => (
                <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                  {empleado.NombreCompleto}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="Fecha"
              value={justificacionData.Fecha}
              onChange={handleJustificacionChange}
              className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
            />
            <textarea
              name="Motivo"
              value={justificacionData.Motivo}
              onChange={handleJustificacionChange}
              className="border rounded-lg w-full px-3 py-2 mb-4 dark:bg-[#393E46] dark:text-[#EEEEEE]"
              placeholder="Escriba la justificación"
            />
            <button
              onClick={justificarSalida}
              className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg shadow-md w-full mb-2 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Justificar Salida
            </button>
            <button
              onClick={cancelarJustificacion}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md w-full"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded-lg shadow-md disabled:opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Anterior
        </button>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded-lg shadow-md disabled:opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Siguiente
        </button>
      </div>

    </div>
  );
};

export default MarcaTiempo;

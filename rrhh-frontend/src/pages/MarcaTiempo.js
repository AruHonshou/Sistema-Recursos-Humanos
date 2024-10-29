import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';

const MarcaTiempo = () => {
  const [marcas, setMarcas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    idEmpleado: '',
    Fecha: '',
    Hora: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Fetch all attendance records
  const obtenerMarcas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/marcas/todas-marcas-persona');
      setMarcas(response.data[0]);
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

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Register start time
  const registrarMarcaInicio = async () => {
    try {
      await axios.post('http://localhost:3000/api/marcas/inicio', formData);
      alert('Marca de inicio registrada exitosamente');
      obtenerMarcas();
    } catch (error) {
      console.error('Error al registrar la marca de inicio:', error);
    }
  };

  // Register end time
  const registrarMarcaSalida = async () => {
    try {
      await axios.post('http://localhost:3000/api/marcas/salida', formData);
      alert('Marca de salida registrada exitosamente');
      obtenerMarcas();
    } catch (error) {
      console.error('Error al registrar la marca de salida:', error);
    }
  };

  // Delete attendance mark
  const eliminarMarcaTiempo = async (idEmpleado, Fecha_Marca, Movimiento) => {
    try {
      await axios.delete(`http://localhost:3000/api/marcas/eliminar/${idEmpleado}/${Fecha_Marca}/${Movimiento}`);
      alert('Marca de tiempo eliminada exitosamente');
      obtenerMarcas();
    } catch (error) {
      console.error('Error al eliminar la marca de tiempo:', error);
    }
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
    <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Control de Asistencia</h1>

      <div className="flex justify-center space-x-4 mb-6">
        {/* Hora Entrada Form */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Registrar Hora de Entrada</h2>
          <select
            name="idEmpleado"
            value={formData.idEmpleado}
            onChange={handleInputChange}
            className="border rounded-lg w-full px-3 py-2 mb-2"
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
            className="border rounded-lg w-full px-3 py-2 mb-2"
          />
          <input
            type="time"
            name="Hora"
            value={formData.Hora}
            onChange={handleInputChange}
            className="border rounded-lg w-full px-3 py-2 mb-4"
          />
          <button
            onClick={registrarMarcaInicio}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md w-full"
          >
            Hora Entrada
          </button>
        </div>

        {/* Hora Salida Form */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Registrar Hora de Salida</h2>
          <select
            name="idEmpleado"
            value={formData.idEmpleado}
            onChange={handleInputChange}
            className="border rounded-lg w-full px-3 py-2 mb-2"
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
            className="border rounded-lg w-full px-3 py-2 mb-2"
          />
          <input
            type="time"
            name="Hora"
            value={formData.Hora}
            onChange={handleInputChange}
            className="border rounded-lg w-full px-3 py-2 mb-4"
          />
          <button
            onClick={registrarMarcaSalida}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md w-full"
          >
            Hora Salida
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg shadow-lg mb-6">
        <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
          <thead className="bg-gray-100 dark:bg-[#3A3A4D] border-b">
            <tr>
              <th className="px-4 py-2 text-black dark:text-white text-center">ID Empleado</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Persona</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Movimiento</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Marca</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Marca Hora</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Tardía</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Justificada</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((marca, index) => (
              <tr key={index} className="border-b dark:border-[#4D4D61]">
                <td className="px-4 py-2 text-black dark:text-white text-center">{marca.idEmpleado}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{marca.Persona}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{marca.Movimiento}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(marca.Fecha_Marca).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{marca.Marca_Hora}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">
                  {marca.Tardia?.data?.[0] === 1 ? 'Sí' : 'No'}
                </td>
                <td className="px-4 py-2 text-black dark:text-white text-center">
                  {marca.Justificada?.data?.[0] === 1 ? 'Sí' : 'No'}
                </td>
                <td className="px-4 py-2 flex justify-center space-x-2">
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

      {/* Pagination controls */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded-lg shadow-md disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded-lg shadow-md disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default MarcaTiempo;

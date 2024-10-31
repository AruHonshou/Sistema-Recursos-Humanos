import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MarcaTiempoReportes = () => {
  const [marcas, setMarcas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPersona, setSelectedPersona] = useState('');
  const [selectedMes, setSelectedMes] = useState('');
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

  // Filtered records based on selected person and month
  const filteredMarcas = marcas.filter((marca) => {
    const matchesPersona = selectedPersona ? marca.Persona === selectedPersona : true;
    const matchesMes = selectedMes
      ? new Date(marca.Fecha_Marca).getMonth() + 1 === parseInt(selectedMes, 10)
      : true;
    return matchesPersona && matchesMes;
  });

  // Pagination handling
  const lastRecordIndex = currentPage * recordsPerPage;
  const firstRecordIndex = lastRecordIndex - recordsPerPage;
  const currentRecords = filteredMarcas.slice(firstRecordIndex, lastRecordIndex);
  const totalPages = Math.ceil(filteredMarcas.length / recordsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Reportes de Asistencia</h1>

      <div className="flex justify-center space-x-4 mb-6">
        {/* Persona Selector */}
        <select
          value={selectedPersona}
          onChange={(e) => setSelectedPersona(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md transition duration-200 ease-in-out transform hover:scale-105 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
        >
          <option value="">Seleccionar Persona</option>
          {empleados.map((empleado) => (
            <option key={empleado.idEmpleado} value={empleado.NombreCompleto}>
              {empleado.NombreCompleto}
            </option>
          ))}
        </select>

        {/* Mes Selector */}
        <select
          value={selectedMes}
          onChange={(e) => setSelectedMes(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md transition duration-200 ease-in-out transform hover:scale-105 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
        >
          <option value="">Seleccionar Mes</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('es-ES', { month: 'long' })}
            </option>
          ))}
        </select>
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
          className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default MarcaTiempoReportes;

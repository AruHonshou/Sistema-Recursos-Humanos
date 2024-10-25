import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Vacaciones = () => {
  const [vacaciones, setVacaciones] = useState([]);

  // Obtener todas las vacaciones
  const obtenerVacaciones = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/vacaciones');
      setVacaciones(response.data);
    } catch (error) {
      console.error('Error al obtener las vacaciones:', error);
    }
  };

  // Exportar a PDF
  const generarPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID Empleado', 'Nombre', 'Fecha Inicio', 'Fecha Fin', 'Días Solicitados', 'Fecha Solicitud', 'Días Disponibles', 'Días Consumidos', 'Estado Solicitud']],
      body: vacaciones.map((vacacion) => [
        vacacion.idEmpleado,
        vacacion.nombreEmpleado,
        vacacion.fechaInicio,
        vacacion.fechaFin,
        vacacion.diasSolicitados,
        vacacion.fechaSolicitud,
        vacacion.diasDisponibles,
        vacacion.diasConsumidos,
        vacacion.estadoSolicitud
      ]),
    });
    doc.save('vacaciones.pdf');
  };

  // Exportar a Excel
  const generarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(vacaciones);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vacaciones');
    XLSX.writeFile(wb, 'vacaciones.xlsx');
  };

  useEffect(() => {
    obtenerVacaciones();
  }, []);

  return (
    <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Gestión de Vacaciones</h1>

      <div className="flex justify-between mb-4">
        <button
          onClick={generarPDF}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Exportar a PDF
        </button>
        <button
          onClick={generarExcel}
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Exportar a Excel
        </button>
      </div>

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
              <th className="px-4 py-2 text-black dark:text-white text-center">Estado Solicitud</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vacaciones.map((vacacion) => (
              <tr key={vacacion.idEmpleado} className="border-b dark:border-[#4D4D61]">
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.idEmpleado}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.nombreEmpleado}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.fechaInicio}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.fechaFin}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.diasSolicitados}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.fechaSolicitud}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.diasDisponibles}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.diasConsumidos}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.estadoSolicitud}</td>
                <td className="px-4 py-2 flex justify-center space-x-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FaCheck />
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vacaciones;

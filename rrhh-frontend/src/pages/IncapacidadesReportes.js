import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Incapacidades = () => {
  const [incapacidades, setIncapacidades] = useState([]);
  const [nombres, setNombres] = useState({});
  const [fechaInicio, setFechaInicio] = useState(''); // Para el filtro de fecha de inicio
  const [fechaFin, setFechaFin] = useState(''); // Para el filtro de fecha de fin

  // Obtener todas las incapacidades
  const obtenerIncapacidades = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/incapacidad');
      if (response && response.data) {
        setIncapacidades(response.data);
      } else {
        console.error('La respuesta no tiene datos:', response);
      }
    } catch (error) {
      console.error('Error al obtener las incapacidades:', error);
    }
  };

  // Generar PDF con las incapacidades filtradas
  const generarPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Fecha Inicio', 'Fecha Fin', 'Descripción', 'Días', 'Monto Deducción']],
      body: incapacidadesFiltradas.map((incapacidad) => [
        incapacidad.Fecha_Inicio,
        incapacidad.Fecha_Fin,
        incapacidad.Descripcion_Incapacidades,
        incapacidad.Cantidad_Dias,
        incapacidad.Monto_Deduccion
      ]),
    });
    doc.save('incapacidades.pdf');
  };

  // Generar Excel con las incapacidades filtradas
  const generarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(incapacidadesFiltradas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Incapacidades');
    XLSX.writeFile(wb, 'incapacidades.xlsx');
  };

  useEffect(() => {
    obtenerIncapacidades();
  }, []);

  const fetchNombreEmpleado = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/datosPersona/${id}`);
      return response.data[0][0].Nombre;
    } catch (error) {
      console.error(`Error fetching nombre for ID ${id}:`, error);
      return '';
    }
  };

  useEffect(() => {
    const fetchNombres = async () => {
      const nombresObj = {};
      for (const incapacidad of incapacidades) {
        const nombre = await fetchNombreEmpleado(incapacidad.empleados_idEmpleado);
        nombresObj[incapacidad.empleados_idEmpleado] = nombre;
      }
      setNombres(nombresObj);
    };

    if (incapacidades.length > 0) {
      fetchNombres();
    }
  }, [incapacidades]);

  // Filtrar incapacidades por rango de fechas
  const incapacidadesFiltradas = incapacidades.filter((incapacidad) => {
    const fechaIncapacidad = new Date(incapacidad.Fecha_Inicio).getTime();
    const inicio = fechaInicio ? new Date(fechaInicio).getTime() : null;
    const fin = fechaFin ? new Date(fechaFin).getTime() : null;

    if (inicio && fin) {
      return fechaIncapacidad >= inicio && fechaIncapacidad <= fin;
    } else if (inicio) {
      return fechaIncapacidad >= inicio;
    } else if (fin) {
      return fechaIncapacidad <= fin;
    } else {
      return true; // Sin filtros, devuelve todos
    }
  });

  return (
    <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Gestión de Incapacidades</h1>

      {/* Filtros por fecha */}
      <div className="flex justify-center mb-4">
        <div className="mr-4">
          <label className="text-black dark:text-white block mb-2">Fecha Inicio:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="text-black dark:text-white block mb-2">Fecha Fin:</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

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
              <th className="px-4 py-2 text-black dark:text-white text-center">Descripción</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Días</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Monto Deducción</th>
            </tr>
          </thead>
          <tbody>
            {incapacidadesFiltradas.map((incapacidad) => (
              <tr key={`${incapacidad.Fecha_Inicio}-${incapacidad.empleados_idEmpleado}`} className="border-b dark:border-[#4D4D61]">
                <td className="px-4 py-2 text-black dark:text-white text-center">{incapacidad.empleados_idEmpleado}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{nombres[incapacidad.empleados_idEmpleado] || 'Cargando...'}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">
                  {new Date(incapacidad.Fecha_Inicio).toISOString().split('T')[0]}
                </td>
                <td className="px-4 py-2 text-black dark:text-white text-center">
                  {new Date(incapacidad.Fecha_Fin).toISOString().split('T')[0]}
                </td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{incapacidad.Descripcion_Incapacidades}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{incapacidad.Cantidad_Dias}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{incapacidad.Monto_Deduccion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Incapacidades;

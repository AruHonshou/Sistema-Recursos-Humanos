import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const LiquidacionReportes = () => {
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [idEmpleado, setIdEmpleado] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Obtener todas las liquidaciones
  const obtenerLiquidaciones = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/liquidaciones/completas');
      setLiquidaciones(response.data[0]);
    } catch (error) {
      console.error('Error al obtener las liquidaciones:', error);
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

  useEffect(() => {
    obtenerLiquidaciones();
    obtenerEmpleados();
  }, []);

  // Filtrar liquidaciones
  const liquidacionesFiltradas = liquidaciones.filter((liquidacion) => {
    const fechaLiquidacion = new Date(liquidacion.Fecha_Liquidacion);
    const inicioFiltro = fechaInicio ? new Date(fechaInicio) : null;
    const finFiltro = fechaFin ? new Date(fechaFin) : null;

    const empleadoMatch = idEmpleado === '' || liquidacion.empleados_idEmpleado === parseInt(idEmpleado);
    const fechaMatch =
      (!inicioFiltro || fechaLiquidacion >= inicioFiltro) &&
      (!finFiltro || fechaLiquidacion <= finFiltro);

    return empleadoMatch && fechaMatch;
  });

  // Exportar a PDF
  const generarPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID Empleado', 'Persona', 'Fecha Liquidación', 'Preaviso', 'Días Preaviso', 'Monto Total Preaviso', 'Monto Total Liquidación', 'Monto Cesantía', 'Monto Vacaciones', 'Monto Aguinaldo', 'Tipo Liquidación']],
      body: liquidacionesFiltradas.map((liquidacion) => [
        liquidacion.empleados_idEmpleado,
        liquidacion.Persona,
        new Date(liquidacion.Fecha_Liquidacion).toLocaleDateString('es-ES'),
        liquidacion.Preaviso ? 'Sí' : 'No',
        liquidacion.Dias_Preaviso,
        `₡${liquidacion.Monto_Total_Preaviso.toLocaleString('es-CR')}`,
        `₡${liquidacion.Monto_Total_Liquidacion.toLocaleString('es-CR')}`,
        `₡${liquidacion.Monto_Total_Cesantia.toLocaleString('es-CR')}`,
        `₡${liquidacion.Monto_Total_Vacaciones.toLocaleString('es-CR')}`,
        `₡${liquidacion.Monto_Total_Aguinaldo.toLocaleString('es-CR')}`,
        liquidacion.tipo_liquidacion
      ]),
    });
    doc.save('liquidaciones.pdf');
  };

  // Exportar a Excel
  const generarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(liquidacionesFiltradas.map((liquidacion) => ({
      'ID Empleado': liquidacion.empleados_idEmpleado,
      'Persona': liquidacion.Persona,
      'Fecha Liquidación': new Date(liquidacion.Fecha_Liquidacion).toLocaleDateString('es-ES'),
      'Preaviso': liquidacion.Preaviso ? 'Sí' : 'No',
      'Días Preaviso': liquidacion.Dias_Preaviso,
      'Monto Total Preaviso': `₡${liquidacion.Monto_Total_Preaviso.toLocaleString('es-CR')}`,
      'Monto Total Liquidación': `₡${liquidacion.Monto_Total_Liquidacion.toLocaleString('es-CR')}`,
      'Monto Cesantía': `₡${liquidacion.Monto_Total_Cesantia.toLocaleString('es-CR')}`,
      'Monto Vacaciones': `₡${liquidacion.Monto_Total_Vacaciones.toLocaleString('es-CR')}`,
      'Monto Aguinaldo': `₡${liquidacion.Monto_Total_Aguinaldo.toLocaleString('es-CR')}`,
      'Tipo Liquidación': liquidacion.tipo_liquidacion
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Liquidaciones');
    XLSX.writeFile(wb, 'liquidaciones.xlsx');
  };

  return (
    <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Reportes de Liquidaciones</h1>

      <div className="flex justify-between mb-4 gap-4">
        <button
          onClick={generarPDF}
          className="bg-[#222831] text-[#00ADB5] py-2 px-6 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 hover:bg-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
        >
          Exportar a PDF
        </button>
        <button
          onClick={generarExcel}
          className="bg-[#222831] text-[#00ADB5] py-2 px-6 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 hover:bg-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
        >
          Exportar a Excel
        </button>
      </div>

      <div className="flex justify-center mb-4 gap-4">
        <select
          value={idEmpleado}
          onChange={(e) => setIdEmpleado(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md transition duration-200 ease-in-out transform hover:scale-105 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
        >
          <option value="">Seleccione un Empleado</option>
          {empleados.map((empleado) => (
            <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
              {empleado.NombreCompleto}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md transition duration-200 ease-in-out transform hover:scale-105 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
        />
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md transition duration-200 ease-in-out transform hover:scale-105 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
        />
      </div>

      <div className="overflow-hidden rounded-lg shadow-lg">
        <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
          <thead className="bg-gray-100 dark:bg-[#3A3A4D] border-b">
            <tr>
              <th className="px-4 py-2 text-black dark:text-white text-center">ID Empleado</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Persona</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Liquidación</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Preaviso</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Días Preaviso</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Monto Total Preaviso</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Monto Total Liquidación</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Monto Cesantía</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Monto Vacaciones</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Monto Aguinaldo</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Tipo Liquidación</th>
            </tr>
          </thead>
          <tbody>
            {liquidacionesFiltradas.map((liquidacion) => (
              <tr key={`${liquidacion.Fecha_Liquidacion}-${liquidacion.empleados_idEmpleado}`} className="border-b dark:border-[#4D4D61]">
                <td className="px-4 py-2 text-black dark:text-white text-center">{liquidacion.empleados_idEmpleado}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{liquidacion.Persona}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(liquidacion.Fecha_Liquidacion).toLocaleDateString('es-ES')}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{liquidacion.Preaviso ? 'Sí' : 'No'}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{liquidacion.Dias_Preaviso}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">₡{liquidacion.Monto_Total_Preaviso.toLocaleString('es-CR')}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">₡{liquidacion.Monto_Total_Liquidacion.toLocaleString('es-CR')}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">₡{liquidacion.Monto_Total_Cesantia.toLocaleString('es-CR')}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">₡{liquidacion.Monto_Total_Vacaciones.toLocaleString('es-CR')}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">₡{liquidacion.Monto_Total_Aguinaldo.toLocaleString('es-CR')}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{liquidacion.tipo_liquidacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiquidacionReportes;

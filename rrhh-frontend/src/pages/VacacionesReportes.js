import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const VacacionesReportes = () => {
  const [vacaciones, setVacaciones] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [idEmpleado, setIdEmpleado] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');

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
      setEmpleados(response.data[0]);
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }
  };

  useEffect(() => {
    obtenerVacaciones();
    obtenerEmpleados();
  }, []);

  // Filtrar vacaciones
  const vacacionesFiltradas = vacaciones.filter((vacacion) => {
    const fechaInicioVacacion = new Date(vacacion.Fecha_Inicio);
    const fechaFinVacacion = new Date(vacacion.Fecha_Fin);
    const inicioFiltro = fechaInicio ? new Date(fechaInicio) : null;
    const finFiltro = fechaFin ? new Date(fechaFin) : null;

    const empleadoMatch = idEmpleado === '' || vacacion.idEmpleado === parseInt(idEmpleado);
    const estadoMatch =
      (estadoFiltro === 'Aceptado' && vacacion.estado_solicitud_idestado_solicitud === 1) ||
      (estadoFiltro === 'Rechazado' && vacacion.estado_solicitud_idestado_solicitud === 2) ||
      (estadoFiltro === 'En Espera' && vacacion.estado_solicitud_idestado_solicitud === 3) ||
      estadoFiltro === '';

    const fechaMatch =
      (!inicioFiltro || fechaInicioVacacion >= inicioFiltro) &&
      (!finFiltro || fechaFinVacacion <= finFiltro);

    return empleadoMatch && estadoMatch && fechaMatch;
  });

  // Exportar a PDF
  const generarPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID Empleado', 'Nombre', 'Fecha Inicio', 'Fecha Fin', 'Días Solicitados', 'Fecha Solicitud', 'Días Disponibles', 'Días Consumidos', 'Motivo', 'Estado Solicitud']],
      body: vacacionesFiltradas.map((vacacion) => [
        vacacion.idEmpleado,
        vacacion.Empleador || 'Cargando...',
        new Date(vacacion.Fecha_Inicio).toLocaleDateString('es-ES'),
        new Date(vacacion.Fecha_Fin).toLocaleDateString('es-ES'),
        vacacion.Cantidad_Dias_Solicitados,
        new Date(vacacion.Fecha_Solicitud).toLocaleDateString('es-ES'),
        vacacion.DiasDisponibles,
        vacacion.DiasConsumidos,
        vacacion.Motivo_Vacacion,
        vacacion.estado_solicitud_idestado_solicitud === 1
          ? 'Aceptado'
          : vacacion.estado_solicitud_idestado_solicitud === 2
          ? 'Rechazado'
          : 'En Espera'
      ]),
    });
    doc.save('vacaciones.pdf');
  };

  // Exportar a Excel
  const generarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(vacacionesFiltradas.map((vacacion) => ({
      'ID Empleado': vacacion.idEmpleado,
      'Nombre': vacacion.Empleador || 'Cargando...',
      'Fecha Inicio': new Date(vacacion.Fecha_Inicio).toLocaleDateString('es-ES'),
      'Fecha Fin': new Date(vacacion.Fecha_Fin).toLocaleDateString('es-ES'),
      'Días Solicitados': vacacion.Cantidad_Dias_Solicitados,
      'Fecha Solicitud': new Date(vacacion.Fecha_Solicitud).toLocaleDateString('es-ES'),
      'Días Disponibles': vacacion.DiasDisponibles,
      'Días Consumidos': vacacion.DiasConsumidos,
      'Motivo': vacacion.Motivo_Vacacion,
      'Estado Solicitud': vacacion.estado_solicitud_idestado_solicitud === 1
        ? 'Aceptado'
        : vacacion.estado_solicitud_idestado_solicitud === 2
        ? 'Rechazado'
        : 'En Espera'
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vacaciones');
    XLSX.writeFile(wb, 'vacaciones.xlsx');
  };

  return (
    <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Reportes de Vacaciones</h1>

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
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md transition duration-200 ease-in-out transform hover:scale-105 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
        >
          <option value="">Todos</option>
          <option value="Aceptado">Aceptado</option>
          <option value="Rechazado">Rechazado</option>
          <option value="En Espera">En Espera</option>
        </select>
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
              <th className="px-4 py-2 text-black dark:text-white text-center">Motivo</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Estado Solicitud</th>
            </tr>
          </thead>
          <tbody>
            {vacacionesFiltradas.map((vacacion) => (
              <tr key={`${new Date(vacacion.Fecha_Inicio).toISOString()}-${vacacion.idEmpleado}`} className="border-b dark:border-[#4D4D61]">
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.idEmpleado}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.Empleador || 'Cargando...'}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(vacacion.Fecha_Inicio).toLocaleDateString('es-ES')}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(vacacion.Fecha_Fin).toLocaleDateString('es-ES')}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.Cantidad_Dias_Solicitados}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(vacacion.Fecha_Solicitud).toLocaleDateString('es-ES')}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.DiasDisponibles}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.DiasConsumidos}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{vacacion.Motivo_Vacacion}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">
                  {vacacion.estado_solicitud_idestado_solicitud === 1
                    ? 'Aceptado'
                    : vacacion.estado_solicitud_idestado_solicitud === 2
                    ? 'Rechazado'
                    : 'En Espera'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VacacionesReportes;

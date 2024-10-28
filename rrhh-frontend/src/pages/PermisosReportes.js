import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ReportePermisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('');

  // Obtener todos los permisos
  const obtenerPermisos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/permisos/');
      setPermisos(response.data[0]);
    } catch (error) {
      console.error('Error al obtener los permisos:', error);
    }
  };

  // Filtrar permisos por estado de solicitud
  const permisosFiltrados = permisos.filter((permiso) => {
    if (estadoFiltro === 'Aceptado') return permiso.estado_solicitud_idestado_solicitud === 1;
    if (estadoFiltro === 'Rechazado') return permiso.estado_solicitud_idestado_solicitud === 2;
    if (estadoFiltro === 'En Espera') return permiso.estado_solicitud_idestado_solicitud === 3;
    return true;
  });

  // Exportar a PDF
  const generarPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID Empleado', 'Nombre', 'Fecha Permiso', 'Detalle', 'Fecha Solicitud', 'Con Goce', 'Horas Permiso', 'Monto Permiso', 'Descripción Permiso', 'Estado Solicitud']],
      body: permisosFiltrados.map((permiso) => [
        permiso.idEmpleado,
        permiso.Persona || 'Cargando...',
        new Date(permiso.fecha_permiso).toLocaleDateString('es-ES'),
        permiso.detalle_permiso,
        new Date(permiso.fecha_solicitud).toLocaleDateString('es-ES'),
        permiso.Con_Gose === 1 ? 'Sí' : 'No',
        permiso.horas_permiso,
        permiso.monto_permiso,
        permiso.descripcion_permiso,
        permiso.estado_solicitud_idestado_solicitud === 1 ? 'Aceptado' : permiso.estado_solicitud_idestado_solicitud === 2 ? 'Rechazado' : 'En Espera'
      ]),
    });
    doc.save('permisos.pdf');
  };

  // Exportar a Excel
  const generarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(permisosFiltrados.map((permiso) => ({
      'ID Empleado': permiso.idEmpleado,
      'Nombre': permiso.Persona || 'Cargando...',
      'Fecha Permiso': new Date(permiso.fecha_permiso).toLocaleDateString('es-ES'),
      'Detalle': permiso.detalle_permiso,
      'Fecha Solicitud': new Date(permiso.fecha_solicitud).toLocaleDateString('es-ES'),
      'Con Goce': permiso.Con_Gose === 1 ? 'Sí' : 'No',
      'Horas Permiso': permiso.horas_permiso,
      'Monto Permiso': permiso.monto_permiso,
      'Descripción Permiso': permiso.descripcion_permiso,
      'Estado Solicitud': permiso.estado_solicitud_idestado_solicitud === 1 ? 'Aceptado' : permiso.estado_solicitud_idestado_solicitud === 2 ? 'Rechazado' : 'En Espera'
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Permisos');
    XLSX.writeFile(wb, 'permisos.xlsx');
  };

  useEffect(() => {
    obtenerPermisos();
  }, []);

  return (
    <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Reportes de Permisos Solicitados</h1>

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

      <div className="flex justify-center mb-4">
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md"
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
              <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Permiso</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Detalle</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Solicitud</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Con Goce</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Horas Permiso</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Monto Permiso</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Descripción Permiso</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Estado Solicitud</th>
            </tr>
          </thead>
          <tbody>
            {permisosFiltrados.map((permiso) => (
              <tr key={`${new Date(permiso.fecha_permiso).toISOString()}-${permiso.idEmpleado}`} className="border-b dark:border-[#4D4D61]">
                <td className="px-4 py-2 text-black dark:text-white text-center">{permiso.idEmpleado}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{permiso.Persona || 'Cargando...'}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(permiso.fecha_permiso).toISOString().split('T')[0]}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{permiso.detalle_permiso}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(permiso.fecha_solicitud).toISOString().split('T')[0]}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{permiso.Con_Gose}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{permiso.horas_permiso}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{permiso.monto_permiso}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{permiso.descripcion_permiso}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">
                  {permiso.estado_solicitud_idestado_solicitud === 1
                    ? 'Aceptado'
                    : permiso.estado_solicitud_idestado_solicitud === 2
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

export default ReportePermisos;

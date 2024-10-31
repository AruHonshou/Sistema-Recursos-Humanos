import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ReportePermisos = () => {
    const [permisos, setPermisos] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [idEmpleado, setIdEmpleado] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
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

    // Obtener empleados
    const obtenerEmpleados = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const idusuario = user ? user.idusuarios : null;

            if (idusuario) {
                const response = await axios.get(`http://localhost:3000/api/empleados/usuario/${idusuario}`);
                setEmpleados([response.data]); // Wrap the object in an array to map over it in the display
                setIdEmpleado(response.data.idEmpleado); // Set default selected employee
            } else {
                console.error('Usuario no encontrado en el local storage');
            }
        } catch (error) {
            console.error('Error al obtener los empleados:', error);
        }
    };


    useEffect(() => {
        obtenerPermisos();
        obtenerEmpleados();
    }, []);

    // Filtrar permisos por estado, empleado, y rango de fechas
    const permisosFiltrados = permisos.filter((permiso) => {
        const fechaPermiso = new Date(permiso.fecha_permiso).getTime();
        const inicio = fechaInicio ? new Date(fechaInicio).getTime() : null;
        const fin = fechaFin ? new Date(fechaFin).getTime() : null;

        const estadoMatch =
            (estadoFiltro === 'Aceptado' && permiso.estado_solicitud_idestado_solicitud === 1) ||
            (estadoFiltro === 'Rechazado' && permiso.estado_solicitud_idestado_solicitud === 2) ||
            (estadoFiltro === 'En Espera' && permiso.estado_solicitud_idestado_solicitud === 3) ||
            estadoFiltro === '';

        const empleadoMatch = idEmpleado === '' || permiso.idEmpleado === parseInt(idEmpleado);
        const fechaMatch = (!inicio || fechaPermiso >= inicio) && (!fin || fechaPermiso <= fin);

        return estadoMatch && empleadoMatch && fechaMatch;
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
                `₡${permiso.monto_permiso}`, // Añadir símbolo de moneda
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
            'Monto Permiso': `₡${permiso.monto_permiso}`, // Añadir símbolo de moneda
            'Descripción Permiso': permiso.descripcion_permiso,
            'Estado Solicitud': permiso.estado_solicitud_idestado_solicitud === 1 ? 'Aceptado' : permiso.estado_solicitud_idestado_solicitud === 2 ? 'Rechazado' : 'En Espera'
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Permisos');
        XLSX.writeFile(wb, 'permisos.xlsx');
    };

    return (
        <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Reportes de Permisos Solicitados</h1>

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
                <div className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md">
                    <label className="block mb-1 text-center">Empleado</label>
                    <input
                        type="text"
                        value={empleados.length > 0 ? empleados[0].NombreCompleto : 'Cargando...'}
                        readOnly
                        className="text-center bg-white dark:bg-[#2D2D3B] border-none cursor-default"
                    />
                </div>

                <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md"
                />
                <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md"
                />

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
                                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(permiso.fecha_permiso).toLocaleDateString('es-ES')}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{permiso.detalle_permiso}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(permiso.fecha_solicitud).toLocaleDateString('es-ES')}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{permiso.Con_Gose}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{permiso.horas_permiso}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">₡{permiso.monto_permiso}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{permiso.descripcion_permiso}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">
                                    {permiso.estado_solicitud_idestado_solicitud === 1 ? 'Aceptado' : permiso.estado_solicitud_idestado_solicitud === 2 ? 'Rechazado' : 'En Espera'}
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const HistorialPlanillaReportes = () => {
    const [historialPlanillas, setHistorialPlanillas] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [idEmpleado, setIdEmpleado] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    // Obtener historial de planillas
    const obtenerHistorialPlanillas = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/historial-planillas');
            setHistorialPlanillas(response.data[0]);
        } catch (error) {
            console.error('Error al obtener el historial de planillas:', error);
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
        obtenerHistorialPlanillas();
        obtenerEmpleados();
    }, []);

    // Filtrar historial de planillas por empleado y rango de fechas
    const historialFiltrado = historialPlanillas.filter((planilla) => {
        const fechaPlanilla = new Date(planilla.Fecha_Planilla);
        const inicioFiltro = fechaInicio ? new Date(fechaInicio) : null;
        const finFiltro = fechaFin ? new Date(fechaFin) : null;

        const empleadoMatch = idEmpleado === '' || planilla.idEmpleado === parseInt(idEmpleado);
        const fechaMatch = (!inicioFiltro || fechaPlanilla >= inicioFiltro) && (!finFiltro || fechaPlanilla <= finFiltro);

        return empleadoMatch && fechaMatch;
    });

    // Exportar a PDF
    const generarPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['ID Empleado', 'Persona', 'ID Historial', 'Fecha Planilla', 'Monto Pagado', 'Año', 'Mes']],
            body: historialFiltrado.map((planilla) => [
                planilla.idEmpleado,
                planilla.Persona,
                planilla.idHistorial,
                new Date(planilla.Fecha_Planilla).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
                `₡${planilla.Monto_Pagado}`, // Add currency symbol
                planilla.Anio,
                planilla.Mes,
            ]),
        });
        doc.save('historial_planillas.pdf');
    };

    // Exportar a Excel
    const generarExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            historialFiltrado.map((planilla) => ({
                'ID Empleado': planilla.idEmpleado,
                'Persona': planilla.Persona,
                'ID Historial': planilla.idHistorial,
                'Fecha Planilla': new Date(planilla.Fecha_Planilla).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
                'Monto Pagado': `₡${planilla.Monto_Pagado}`, // Add currency symbol
                'Año': planilla.Anio,
                'Mes': planilla.Mes,
            }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'HistorialPlanillas');
        XLSX.writeFile(wb, 'historial_planillas.xlsx');
    };

    return (
        <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Historial de Planillas</h1>

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

            <div className="flex justify-center mb-4 gap-2">
                <select
                    value={idEmpleado}
                    onChange={(e) => setIdEmpleado(e.target.value)}
                    className="border rounded-lg px-2 py-1 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md"
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
                    className="border p-1 rounded-lg"
                />
                <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="border p-1 rounded-lg"
                />
            </div>

            <div className="overflow-hidden rounded-lg shadow-lg">
                <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
                    <thead className="bg-gray-100 dark:bg-[#3A3A4D] border-b">
                        <tr>
                            <th className="px-2 py-1 text-black dark:text-white text-center">ID Empleado</th>
                            <th className="px-2 py-1 text-black dark:text-white text-center">Persona</th>
                            <th className="px-2 py-1 text-black dark:text-white text-center">ID Historial</th>
                            <th className="px-2 py-1 text-black dark:text-white text-center">Fecha Planilla</th>
                            <th className="px-2 py-1 text-black dark:text-white text-center">Monto Pagado</th>
                            <th className="px-2 py-1 text-black dark:text-white text-center">Año</th>
                            <th className="px-2 py-1 text-black dark:text-white text-center">Mes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historialFiltrado.map((planilla) => (
                            <tr key={planilla.idHistorial} className="border-b dark:border-[#4D4D61]">
                                <td className="px-2 py-1 text-black dark:text-white text-center">{planilla.idEmpleado}</td>
                                <td className="px-2 py-1 text-black dark:text-white text-center">{planilla.Persona}</td>
                                <td className="px-2 py-1 text-black dark:text-white text-center">{planilla.idHistorial}</td>
                                <td className="px-2 py-1 text-black dark:text-white text-center">
                                    {new Date(planilla.Fecha_Planilla).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                </td>
                                <td className="px-2 py-1 text-black dark:text-white text-center">₡{planilla.Monto_Pagado}</td>
                                <td className="px-2 py-1 text-black dark:text-white text-center">{planilla.Anio}</td>
                                <td className="px-2 py-1 text-black dark:text-white text-center">{planilla.Mes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistorialPlanillaReportes;

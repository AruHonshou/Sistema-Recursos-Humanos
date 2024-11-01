import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const PlanillaReportes = () => {
    const [planillas, setPlanillas] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [idEmpleado, setIdEmpleado] = useState('');
    const [fechaPlanilla, setFechaPlanilla] = useState('');

        // Obtener todas las planillas
        const obtenerPlanillas = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/planillas');
                setPlanillas(response.data[0]);
            } catch (error) {
                console.error('Error al obtener las planillas:', error);
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
        obtenerPlanillas();
        obtenerEmpleados();
    }, []);

    // Filtrar planillas por empleado y fecha de planilla
    const planillasFiltradas = planillas.filter((planilla) => {
        const empleadoMatch = idEmpleado === '' || planilla.idEmpleado === parseInt(idEmpleado);
        const fechaMatch = fechaPlanilla === '' || new Date(planilla.Fecha_Planilla).toISOString().split('T')[0] === fechaPlanilla;

        return empleadoMatch && fechaMatch;
    });

    // Exportar a PDF
    const generarPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['ID Empleado', 'Persona', 'Fecha Planilla', 'Descripción', 'Total Horas Extras', 'Deducciones', 'Incapacidades', 'Recortes', 'Monto Total', 'Cálculos Fiscales']],
            body: planillasFiltradas.map((planilla) => [
                planilla.idEmpleado,
                planilla.Persona,
                new Date(planilla.Fecha_Planilla).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
                `₡${planilla.Monto_Total_Horas_Extras}`,
                `₡${planilla.Monto_Total_Deducciones}`,
                `₡${planilla.Monto_Total_Incapacidades}`,
                `₡${planilla.Monto_Descontado_Recortar}`,
                `₡${planilla.Monto_Total_Planilla}`,
                `₡${planilla.Monto_Calculos_Fiscales}`,
            ]),
        });
        doc.save('planilla.pdf');
    };

    // Exportar a Excel
    const generarExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            planillasFiltradas.map((planilla) => ({
                'ID Empleado': planilla.idEmpleado,
                'Persona': planilla.Persona,
                'Fecha Planilla': new Date(planilla.Fecha_Planilla).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
                'Total Horas Extras': `₡${planilla.Monto_Total_Horas_Extras}`,
                'Deducciones': `₡${planilla.Monto_Total_Deducciones}`,
                'Incapacidades': `₡${planilla.Monto_Total_Incapacidades}`,
                'Recortes': `₡${planilla.Monto_Descontado_Recortar}`,
                'Monto Total': `₡${planilla.Monto_Total_Planilla}`,
                'Cálculos Fiscales': `₡${planilla.Monto_Calculos_Fiscales}`,
            }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Planilla');
        XLSX.writeFile(wb, 'planilla.xlsx');
    };

    // Extraer fechas únicas para el selector de fecha de planilla
    const uniqueDates = [...new Set(planillas.map(planilla => new Date(planilla.Fecha_Planilla).toISOString().split('T')[0]))];

    return (
        <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Reporte de Planilla</h1>

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

                <select
                    value={fechaPlanilla}
                    onChange={(e) => setFechaPlanilla(e.target.value)}
                    className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md transition duration-200 ease-in-out transform hover:scale-105 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                >
                    <option value="">Seleccione Fecha Planilla</option>
                    {uniqueDates.map((date) => (
                        <option key={date} value={date}>{date}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-hidden rounded-lg shadow-lg">
                <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
                    <thead className="bg-gray-100 dark:bg-[#3A3A4D] border-b">
                        <tr>
                            <th className="px-4 py-2 text-black dark:text-white text-center">ID Empleado</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Persona</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Planilla</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Total Horas Extras</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Deducciones</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Incapacidades</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Recortes</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Monto Total</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Cálculos Fiscales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {planillasFiltradas.map((planilla) => (
                            <tr key={planilla.Fecha_Planilla} className="border-b dark:border-[#4D4D61]">
                                <td className="px-4 py-2 text-black dark:text-white text-center">{planilla.idEmpleado}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{planilla.Persona}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(planilla.Fecha_Planilla).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">₡{planilla.Monto_Total_Horas_Extras}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">₡{planilla.Monto_Total_Deducciones}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">₡{planilla.Monto_Total_Incapacidades}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">₡{planilla.Monto_Descontado_Recortar}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">₡{planilla.Monto_Total_Planilla}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">₡{planilla.Monto_Calculos_Fiscales}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlanillaReportes;

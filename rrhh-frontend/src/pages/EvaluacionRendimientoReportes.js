import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const EvaluacionesRendimiento = () => {
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [idEmpleadoEvaluado, setIdEmpleadoEvaluado] = useState('');
    const [mes, setMes] = useState('');
    const [año, setAño] = useState('');
    const [error, setError] = useState('');

    // Obtener todas las evaluaciones de rendimiento
    const obtenerEvaluaciones = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/evaluaciones-rendimiento');
            setEvaluaciones(response.data);
        } catch (error) {
            console.error('Error al obtener las evaluaciones de rendimiento:', error);
            setError('Error al cargar las evaluaciones.');
        }
    };

    // Obtener lista de empleados
    const obtenerEmpleados = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/empleados/nombre-completo');
            setEmpleados(response.data[0]);
        } catch (error) {
            console.error('Error al obtener los empleados:', error);
        }
    };

    useEffect(() => {
        obtenerEvaluaciones();
        obtenerEmpleados();
    }, []);

    // Filtrar evaluaciones por empleado, mes y año
    const evaluacionesFiltradas = evaluaciones.filter((evaluacion) => {
        const empleadoMatch = idEmpleadoEvaluado === '' || evaluacion.idEmpleado_Evaluado === parseInt(idEmpleadoEvaluado);
        const fecha = new Date(evaluacion.Fecha_evaluacion);
        const mesMatch = mes === '' || fecha.getMonth() + 1 === parseInt(mes);
        const añoMatch = año === '' || fecha.getFullYear() === parseInt(año);
        return empleadoMatch && mesMatch && añoMatch;
    });

    // Exportar a PDF
    const generarPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Fecha de Evaluación', 'ID Evaluado', 'Evaluado', 'ID Evaluador', 'Evaluador', 'Puntuaje', 'Comentarios']],
            body: evaluacionesFiltradas.map((evaluacion) => [
                new Date(evaluacion.Fecha_evaluacion).toLocaleDateString('es-ES'),
                evaluacion.idEmpleado_Evaluado,
                evaluacion.Evaluado,
                evaluacion.idEmpleado_Evaluador,
                evaluacion.Evaluador,
                evaluacion.Puntuaje,
                evaluacion.Comentarios,
            ]),
        });
        doc.save('evaluaciones_rendimiento.pdf');
    };

    // Exportar a Excel
    const generarExcel = () => {
        const ws = XLSX.utils.json_to_sheet(evaluacionesFiltradas.map((evaluacion) => ({
            'Fecha de Evaluación': new Date(evaluacion.Fecha_evaluacion).toLocaleDateString('es-ES'),
            'ID Evaluado': evaluacion.idEmpleado_Evaluado,
            'Evaluado': evaluacion.Evaluado,
            'ID Evaluador': evaluacion.idEmpleado_Evaluador,
            'Evaluador': evaluacion.Evaluador,
            'Puntuaje': evaluacion.Puntuaje,
            'Comentarios': evaluacion.Comentarios,
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Evaluaciones');
        XLSX.writeFile(wb, 'evaluaciones_rendimiento.xlsx');
    };

    return (
        <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Reportes de Evaluaciones de Rendimiento</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}

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
                    value={idEmpleadoEvaluado}
                    onChange={(e) => setIdEmpleadoEvaluado(e.target.value)}
                    className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md transition duration-200 ease-in-out transform hover:scale-105 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                >
                    <option value="">Seleccione un Empleado Evaluado</option>
                    {empleados.map((empleado) => (
                        <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                            {empleado.NombreCompleto}
                        </option>
                    ))}
                </select>

                <select
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
                    className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md transition duration-200 ease-in-out transform hover:scale-105 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                >
                    <option value="">Seleccione Mes</option>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString('es-ES', { month: 'long' })}
                        </option>
                    ))}
                </select>

                <select
                    value={año}
                    onChange={(e) => setAño(e.target.value)}
                    className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md transition duration-200 ease-in-out transform hover:scale-105 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                >
                    <option value="">Seleccione Año</option>
                    {Array.from({ length: 5 }, (_, i) => {
                        const currentYear = new Date().getFullYear();
                        return (
                            <option key={currentYear - i} value={currentYear - i}>
                                {currentYear - i}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* Tablas de Evaluaciones */}
            {['Productividad', 'Puntualidad y Asistencia', 'Colaboración y Trabajo en Equipo', 'Adaptabilidad y Resolución de Problemas'].map((tipo) => (
                <div key={tipo} className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-black dark:text-white text-center">{tipo}</h2>
                    <div className="overflow-hidden rounded-lg shadow-lg">
                        <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
                            <thead className="bg-gray-100 dark:bg-[#3A3A4D] border-b">
                                <tr>
                                    <th className="px-4 py-2 text-black dark:text-white text-center">Fecha de Evaluación</th>
                                    <th className="px-4 py-2 text-black dark:text-white text-center">ID Evaluado</th>
                                    <th className="px-4 py-2 text-black dark:text-white text-center">Evaluado</th>
                                    <th className="px-4 py-2 text-black dark:text-white text-center">ID Evaluador</th>
                                    <th className="px-4 py-2 text-black dark:text-white text-center">Evaluador</th>
                                    <th className="px-4 py-2 text-black dark:text-white text-center">Puntuaje</th>
                                    <th className="px-4 py-2 text-black dark:text-white text-center">Comentarios</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evaluacionesFiltradas
                                    .filter((evaluacion) => evaluacion.descripcion_evaluacion === tipo)
                                    .map((evaluacion) => (
                                        <tr key={`${evaluacion.Fecha_evaluacion}-${evaluacion.idEmpleado_Evaluado}-${evaluacion.idEmpleado_Evaluador}`} className="border-b dark:border-[#4D4D61] hover:bg-gray-200 dark:hover:bg-[#373757] transition duration-200">
                                            <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(evaluacion.Fecha_evaluacion).toLocaleDateString('es-ES')}</td>
                                            <td className="px-4 py-2 text-black dark:text-white text-center">{evaluacion.idEmpleado_Evaluado}</td>
                                            <td className="px-4 py-2 text-black dark:text-white text-center">{evaluacion.Evaluado}</td>
                                            <td className="px-4 py-2 text-black dark:text-white text-center">{evaluacion.idEmpleado_Evaluador}</td>
                                            <td className="px-4 py-2 text-black dark:text-white text-center">{evaluacion.Evaluador}</td>
                                            <td className="px-4 py-2 text-black dark:text-white text-center">{evaluacion.Puntuaje}</td>
                                            <td className="px-4 py-2 text-black dark:text-white text-center">{evaluacion.Comentarios}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EvaluacionesRendimiento;

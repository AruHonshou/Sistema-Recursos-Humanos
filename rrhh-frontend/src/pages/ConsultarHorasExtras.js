import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ConsultarHorasExtras = () => {
    const [horasExtras, setHorasExtras] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [idEmpleado, setIdEmpleado] = useState('');
    const [estado, setEstado] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    // Obtener todas las horas extras
    const obtenerHorasExtras = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/horas-extras/');
            setHorasExtras(response.data[0]);
        } catch (error) {
            console.error('Error al obtener las horas extras:', error);
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
        obtenerHorasExtras();
        obtenerEmpleados();
    }, []);

    // Filtrar horas extras por empleado, estado, y rango de fechas
    const horasExtrasFiltradas = horasExtras.filter((horaExtra) => {
        const fechaHoraExtra = new Date(horaExtra.fecha_hora_extra);
        const inicioFiltro = fechaInicio ? new Date(fechaInicio) : null;
        const finFiltro = fechaFin ? new Date(fechaFin) : null;

        const empleadoMatch = idEmpleado === '' || horaExtra.idEmpleado === parseInt(idEmpleado);
        const estadoMatch =
            estado === '' ||
            (estado === 'Aprobado' && horaExtra.estado_solicitud === 'Aprobado') ||
            (estado === 'Rechazado' && horaExtra.estado_solicitud === 'Rechazado');
        const fechaMatch =
            (!inicioFiltro || fechaHoraExtra >= inicioFiltro) && (!finFiltro || fechaHoraExtra <= finFiltro);

        return empleadoMatch && estadoMatch && fechaMatch;
    });

    // Exportar a PDF
    const generarPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['ID Empleado', 'Persona', 'Fecha', 'Cantidad Horas', 'Hora Inicio', 'Hora Final', 'Monto', 'Tipo', 'Estado']],
            body: horasExtrasFiltradas.map((horaExtra) => [
                horaExtra.idEmpleado,
                horaExtra.Persona,
                new Date(horaExtra.fecha_hora_extra).toLocaleDateString('es-ES'),
                horaExtra.Cantidad_Horas_Extras,
                horaExtra.Hora_Inicio,
                horaExtra.Hora_Final,
                horaExtra.Monto_Hora_Extra,
                horaExtra.tipo_hora_extra,
                horaExtra.estado_solicitud === 'Aprobado' ? 'Aceptado' : 'Rechazado',
            ]),
        });
        doc.save('horas_extras.pdf');
    };

    // Exportar a Excel
    const generarExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            horasExtrasFiltradas.map((horaExtra) => ({
                'ID Empleado': horaExtra.idEmpleado,
                'Persona': horaExtra.Persona,
                'Fecha': new Date(horaExtra.fecha_hora_extra).toLocaleDateString('es-ES'),
                'Cantidad Horas': horaExtra.Cantidad_Horas_Extras,
                'Hora Inicio': horaExtra.Hora_Inicio,
                'Hora Final': horaExtra.Hora_Final,
                'Monto': horaExtra.Monto_Hora_Extra,
                'Tipo': horaExtra.tipo_hora_extra,
                'Estado': horaExtra.estado_solicitud === 'Aprobado' ? 'Aceptado' : 'Rechazado',
            }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'HorasExtras');
        XLSX.writeFile(wb, 'horas_extras.xlsx');
    };

    return (
        <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Reportes de Horas Extras</h1>

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

                <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md"
                >
                    <option value="">Seleccione Estado</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                </select>

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
            </div>


            <div className="overflow-hidden rounded-lg shadow-lg">
                <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
                    <thead className="bg-gray-100 dark:bg-[#3A3A4D] border-b">
                        <tr>
                            <th className="px-2 py-1 text-black dark:text-white text-center">ID Empleado</th>
                            <th className="px-2 py-1 text-black dark:text-white text-center">Persona</th>
                            <th className="px-2 py-1 text-black dark:text-white text-center">Fecha</th>
                            <th className="px-2 py-1 text-black dark:text-white text-center">Cantidad de Horas</th>
                            <th className="px-2 py-1 text-black dark:text-white text-center">Hora Inicio</th>
                            <th className="px-2 py-1 text-black dark:text-white text-center">Hora Final</th>
                            <th className="px-2 py-1 text-black dark:text-white text-center">Monto</th>
                            <th className="px-2 py-1 text-black dark:text-white text-center">Tipo de Hora Extra</th>
                            <th className="px-2 py-1 text-black dark:text-white text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {horasExtrasFiltradas.map((horaExtra) => (
                            <tr key={`${horaExtra.fecha_hora_extra}-${horaExtra.empleados_idEmpleado}`} className="border-b dark:border-[#4D4D61]">
                                <td className="px-2 py-1 text-black dark:text-white text-center">{horaExtra.idEmpleado}</td>
                                <td className="px-2 py-1 text-black dark:text-white text-center">{horaExtra.Persona}</td>
                                <td className="px-2 py-1 text-black dark:text-white text-center">{new Date(horaExtra.fecha_hora_extra).toLocaleDateString('es-ES')}</td>
                                <td className="px-2 py-1 text-black dark:text-white text-center">{horaExtra.Cantidad_Horas_Extras}</td>
                                <td className="px-2 py-1 text-black dark:text-white text-center">{horaExtra.Hora_Inicio}</td>
                                <td className="px-2 py-1 text-black dark:text-white text-center">{horaExtra.Hora_Final}</td>
                                <td className="px-2 py-1 text-black dark:text-white text-center">₡{horaExtra.Monto_Hora_Extra}</td>
                                <td className="px-2 py-1 text-black dark:text-white text-center">{horaExtra.tipo_hora_extra}</td>
                                <td className="px-2 py-1 text-black dark:text-white text-center">
                                    {horaExtra.estado_solicitud === 'Aprobado' ? 'Aceptado' : 'Rechazado'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConsultarHorasExtras;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ConsultarAguinaldo = () => {
    const [aguinaldos, setAguinaldos] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [idEmpleado, setIdEmpleado] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    // Obtener todos los aguinaldos
    const obtenerAguinaldos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/aguinaldo/reporte');
            setAguinaldos(response.data[0]);
        } catch (error) {
            console.error('Error al obtener los aguinaldos:', error);
        }
    };

    // Obtener empleado por idusuario en el localStorage
    const obtenerEmpleado = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const idusuario = user ? user.idusuarios : null;

            if (idusuario) {
                const response = await axios.get(`http://localhost:3000/api/empleados/usuario/${idusuario}`);
                setEmpleados([response.data]);
                setIdEmpleado(response.data.idEmpleado);
            } else {
                console.error('Usuario no encontrado en el local storage');
            }
        } catch (error) {
            console.error('Error al obtener el empleado:', error);
        }
    };

    useEffect(() => {
        obtenerAguinaldos();
        obtenerEmpleado();
    }, []);

    // Filtrar aguinaldos
    const aguinaldosFiltrados = aguinaldos.filter((aguinaldo) => {
        const fechaAguinaldo = new Date(aguinaldo.Fecha_Aguinaldo);
        const inicioFiltro = fechaInicio ? new Date(fechaInicio) : null;
        const finFiltro = fechaFin ? new Date(fechaFin) : null;

        const empleadoMatch = idEmpleado === '' || aguinaldo.idEmpleado === parseInt(idEmpleado);
        const fechaMatch =
            (!inicioFiltro || fechaAguinaldo >= inicioFiltro) &&
            (!finFiltro || fechaAguinaldo <= finFiltro);

        return empleadoMatch && fechaMatch;
    });

    // Exportar a PDF
    const generarPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['ID Empleado', 'Nombre Empleado', 'Fecha Aguinaldo', 'Fecha Inicial Cobro', 'Fecha Final Cobro', 'Monto Aguinaldo', 'Tipo Aguinaldo']],
            body: aguinaldosFiltrados.map((aguinaldo) => [
                aguinaldo.idEmpleado,
                aguinaldo.Nombre_Empleado,
                new Date(aguinaldo.Fecha_Aguinaldo).toLocaleDateString('es-ES'),
                new Date(aguinaldo.Fecha_Inicial_Cobro).toLocaleDateString('es-ES'),
                new Date(aguinaldo.Fecha_Final_Cobro).toLocaleDateString('es-ES'),
                `₡${aguinaldo.Monto_Aguinaldo.toLocaleString('es-CR')}`,
                aguinaldo.Tipo_Aguinaldo
            ]),
        });
        doc.save('aguinaldos.pdf');
    };

    // Exportar a Excel
    const generarExcel = () => {
        const ws = XLSX.utils.json_to_sheet(aguinaldosFiltrados.map((aguinaldo) => ({
            'ID Empleado': aguinaldo.idEmpleado,
            'Nombre Empleado': aguinaldo.Nombre_Empleado,
            'Fecha Aguinaldo': new Date(aguinaldo.Fecha_Aguinaldo).toLocaleDateString('es-ES'),
            'Fecha Inicial Cobro': new Date(aguinaldo.Fecha_Inicial_Cobro).toLocaleDateString('es-ES'),
            'Fecha Final Cobro': new Date(aguinaldo.Fecha_Final_Cobro).toLocaleDateString('es-ES'),
            'Monto Aguinaldo': `₡${aguinaldo.Monto_Aguinaldo.toLocaleString('es-CR')}`,
            'Tipo Aguinaldo': aguinaldo.Tipo_Aguinaldo
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Aguinaldos');
        XLSX.writeFile(wb, 'aguinaldos.xlsx');
    };

    return (
        <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Consultar Aguinaldo</h1>

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
            </div>

            <div className="overflow-hidden rounded-lg shadow-lg">
                <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
                    <thead className="bg-gray-100 dark:bg-[#3A3A4D] border-b">
                        <tr>
                            <th className="px-4 py-2 text-black dark:text-white text-center">ID Empleado</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Nombre Empleado</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Aguinaldo</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Inicial Cobro</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Final Cobro</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Monto Aguinaldo</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Tipo Aguinaldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {aguinaldosFiltrados.map((aguinaldo, index) => (
                            <tr key={index} className="border-b dark:border-[#4D4D61]">
                                <td className="px-4 py-2 text-black dark:text-white text-center">{aguinaldo.idEmpleado}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{aguinaldo.Nombre_Empleado}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(aguinaldo.Fecha_Aguinaldo).toLocaleDateString('es-ES')}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(aguinaldo.Fecha_Inicial_Cobro).toLocaleDateString('es-ES')}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(aguinaldo.Fecha_Final_Cobro).toLocaleDateString('es-ES')}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">₡{aguinaldo.Monto_Aguinaldo.toLocaleString('es-CR')}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{aguinaldo.Tipo_Aguinaldo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConsultarAguinaldo;

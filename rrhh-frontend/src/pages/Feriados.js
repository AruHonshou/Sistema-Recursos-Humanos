import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Feriados = () => {
    const [feriados, setFeriados] = useState([]);
    const [dias, setDias] = useState([]);
    const [modalCrear, setModalCrear] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);
    const [nuevoFeriado, setNuevoFeriado] = useState({ fechaFeriado: '', descripcionFeriado: '', dias_idDia: '' });
    const [feriadoActualizar, setFeriadoActualizar] = useState({ fechaFeriado: '', descripcionFeriado: '', dias_idDia: '' });
    const [error, setError] = useState('');

    const obtenerFeriados = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/feriados');
            setFeriados(response.data[0]);
        } catch (error) {
            console.error('Error al obtener los feriados:', error);
        }
    };

    const validarFeriado = (feriado) => {
        // Expresión regular para verificar que la descripción comience con mayúscula y contenga solo letras
        const descripcionValida = /^[A-ZÁÉÍÓÚ][A-Za-záéíóúÁÉÍÓÚñÑ\s]*$/.test(feriado.descripcionFeriado);
        
        // Validar que no haya campos vacíos y que la descripción sea válida
        if (!feriado.fechaFeriado || !feriado.descripcionFeriado || !feriado.dias_idDia || !descripcionValida) {
            return false;
        }
        
        return true;
    };
    

    const crearFeriado = async () => {
        if (!validarFeriado(nuevoFeriado)) {
            setError('Por favor, completa todos los campos correctamente y asegúrate de que la descripción solo contenga letras y la inicial en mayuscula.');
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/feriados', nuevoFeriado);
            alert('Feriado creado');  // Alerta de éxito
            setNuevoFeriado({ fechaFeriado: '', descripcionFeriado: '', dias_idDia: '' });
            setModalCrear(false);
            obtenerFeriados();
            setError('');
        } catch (error) {
            console.error('Error al crear el feriado:', error);
        }
    };

    const eliminarFeriado = async (fechaFeriado) => {
        const fechaFeriadoFormateada = new Date(fechaFeriado).toISOString().split('T')[0];
        try {
            await axios.delete(`http://localhost:3000/api/feriados/${fechaFeriadoFormateada}`);
            obtenerFeriados();
        } catch (error) {
            console.error('Error al eliminar el feriado:', error);
        }
    };

    const actualizarFeriado = async () => {
        if (!validarFeriado(feriadoActualizar)) {
            setError('Por favor, completa todos los campos correctamente y asegúrate de que la descripción solo contenga letras y la inicial en mayuscula.');
            return;
        }

        const fechaFeriadoFormateada = new Date(feriadoActualizar.fechaFeriado).toISOString().split('T')[0];

        try {
            await axios.put(`http://localhost:3000/api/feriados/${fechaFeriadoFormateada}`, {
                descripcionFeriado: feriadoActualizar.descripcionFeriado,
                dias_idDia: feriadoActualizar.dias_idDia
            });
            alert('Feriado actualizado');  // Alerta de éxito
            setFeriadoActualizar({ fechaFeriado: '', descripcionFeriado: '', dias_idDia: '' });
            setModalActualizar(false);
            obtenerFeriados();
            setError('');
        } catch (error) {
            console.error('Error al actualizar el feriado:', error);
        }
    };

    const obtenerDias = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/dias');
            setDias(response.data[0]);
        } catch (error) {
            console.error('Error al obtener los días:', error);
        }
    };

    const abrirModalActualizar = (feriado) => {
        setFeriadoActualizar({
            fechaFeriado: feriado.Fecha_Feriado,
            descripcionFeriado: feriado.Descripcion_Feriado,
            dias_idDia: feriado.dias_idDia
        });
        setModalActualizar(true);
    };

    const generarPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Fecha', 'Descripción', 'ID Día']],
            body: feriados.map((feriado) => [feriado.Fecha_Feriado, feriado.Descripcion_Feriado, feriado.dias_idDia]),
        });
        doc.save('feriados.pdf');
    };

    const generarExcel = () => {
        const ws = XLSX.utils.json_to_sheet(feriados);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Feriados');
        XLSX.writeFile(wb, 'feriados.xlsx');
    };

    useEffect(() => {
        obtenerFeriados();
        obtenerDias();
    }, []);

    return (
        <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Gestión de Feriados</h1>

            <button onClick={() => setModalCrear(true)} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 shadow-md">
                + Nuevo Feriado
            </button>
            <div className="flex justify-between mb-4">
                <button onClick={generarPDF} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md">
                    Exportar a PDF
                </button>
                <button onClick={generarExcel} className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg shadow-md">
                    Exportar a Excel
                </button>
            </div>

            <div className="overflow-hidden rounded-lg shadow-lg">
                <table className="min-w-full bg-white border rounded-md shadow-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-black text-center">Fecha</th>
                            <th className="px-4 py-2 text-black text-center">Descripción</th>
                            <th className="px-4 py-2 text-black text-center">ID Día</th>
                            <th className="px-4 py-2 text-black text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feriados.map((feriado) => {
                            const dia = dias.find(dia => dia.idDia === feriado.dias_idDia);
                            return (
                                <tr key={feriado.Fecha_Feriado} className="border-b">
                                    <td className="px-4 py-2 text-center">
                                        {new Date(feriado.Fecha_Feriado).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                    </td>
                                    <td className="px-4 py-2 text-center">{feriado.Descripcion_Feriado}</td>
                                    <td className="px-4 py-2 text-center">{dia ? dia.Nombre_Dia : 'Día no encontrado'}</td>
                                    <td className="px-4 py-2 flex justify-center space-x-2">
                                        <button onClick={() => abrirModalActualizar(feriado)} className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => eliminarFeriado(feriado.Fecha_Feriado)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg">
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {modalCrear && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h2 className="text-lg font-bold mb-4">Nuevo Feriado</h2>
                        <input
                            type="date"
                            value={nuevoFeriado.fechaFeriado}
                            onChange={(e) => setNuevoFeriado({ ...nuevoFeriado, fechaFeriado: e.target.value })}
                            className="border p-2 w-full mb-4"
                        />
                        <input
                            type="text"
                            value={nuevoFeriado.descripcionFeriado}
                            onChange={(e) => setNuevoFeriado({ ...nuevoFeriado, descripcionFeriado: e.target.value })}
                            className="border p-2 w-full mb-4"
                            placeholder="Descripción del feriado"
                        />
                        <select
                            value={nuevoFeriado.dias_idDia}
                            onChange={(e) => setNuevoFeriado({ ...nuevoFeriado, dias_idDia: e.target.value })}
                            className="border p-2 w-full mb-4"
                        >
                            <option value="">Selecciona un día</option>
                            {dias.map((dia) => (
                                <option key={dia.idDia} value={dia.idDia}>{dia.Nombre_Dia}</option>
                            ))}
                        </select>
                        <button onClick={crearFeriado} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
                            Crear Feriado
                        </button>
                        <button onClick={() => setModalCrear(false)} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg ml-2">
                            Cancelar
                        </button>
                        {error && <div className="text-red-500 mt-2">{error}</div>}
                    </div>
                </div>
            )}

            {modalActualizar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h2 className="text-lg font-bold mb-4">Actualizar Feriado</h2>
                        <input
                            type="text"
                            value={feriadoActualizar.descripcionFeriado}
                            onChange={(e) => setFeriadoActualizar({ ...feriadoActualizar, descripcionFeriado: e.target.value })}
                            className="border p-2 w-full mb-4"
                            placeholder="Descripción del feriado"
                        />
                        <select
                            value={feriadoActualizar.dias_idDia}
                            onChange={(e) => setFeriadoActualizar({ ...feriadoActualizar, dias_idDia: e.target.value })}
                            className="border p-2 mb-4 w-full rounded-lg"
                        >
                            <option value="">Selecciona un día</option>
                            {dias.map((dia) => (
                                <option key={dia.idDia} value={dia.idDia}>
                                    {dia.Nombre_Dia}
                                </option>
                            ))}
                        </select>
                        <button onClick={actualizarFeriado} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
                            Actualizar Feriado
                        </button>
                        <button onClick={() => setModalActualizar(false)} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg ml-2">
                            Cancelar
                        </button>
                        {error && <div className="text-red-500 mt-2">{error}</div>}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Feriados;

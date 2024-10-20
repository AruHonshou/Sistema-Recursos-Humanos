import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import usePuestoLaboral from '../hooks/usePuestoLaboral';

const PuestoLaboral = () => {
    const { puestos, crearPuesto, actualizarPuesto, eliminarPuesto } = usePuestoLaboral();
    const [modalCrear, setModalCrear] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);
    const [nuevoPuesto, setNuevoPuesto] = useState({ Nombre_Puesto: '', Salario_Puesto: '' });
    const [puestoActualizar, setPuestoActualizar] = useState({ id: '', Nombre_Puesto: '', Salario_Puesto: '' });

    // Estados de error para cada campo
    const [errorNombreCrear, setErrorNombreCrear] = useState('');
    const [errorSalarioCrear, setErrorSalarioCrear] = useState('');
    const [errorNombreActualizar, setErrorNombreActualizar] = useState('');
    const [errorSalarioActualizar, setErrorSalarioActualizar] = useState('');

    const [searchTerm, setSearchTerm] = useState('');

    // Modificar generarPDF para usar puestosFiltrados
    const generarPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['ID', 'Nombre del Puesto', 'Salario']],
            body: puestosFiltrados.map((puesto) => [puesto.idpuesto_laboral, puesto.Nombre_Puesto, puesto.Salario_Puesto]),
        });
        doc.save('puestos_laborales.pdf');
    };

    // Modificar generarExcel para usar puestosFiltrados
    const generarExcel = () => {
        const ws = XLSX.utils.json_to_sheet(puestosFiltrados);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Puestos');
        XLSX.writeFile(wb, 'puestos_laborales.xlsx');
    };

    const validatePuestoCrear = () => {
        const { Nombre_Puesto, Salario_Puesto } = nuevoPuesto;
        let isValid = true;

        // Limpiar errores anteriores
        setErrorNombreCrear('');
        setErrorSalarioCrear('');

        // Validaciones
        if (!/^[A-Z][a-zA-Z\s]*$/.test(Nombre_Puesto)) {
            setErrorNombreCrear("El nombre debe empezar con mayúscula y no contener números ni signos.");
            isValid = false;
        }
        if (!/^\d+$/.test(Salario_Puesto)) {
            setErrorSalarioCrear("El salario solo puede contener números.");
            isValid = false;
        }

        return isValid;
    };

    const handleCrearPuesto = async () => {
        if (!validatePuestoCrear()) {
            return; 
        }

        const success = await crearPuesto(nuevoPuesto);
        if (!success) {
            setErrorNombreCrear('Error al crear el puesto laboral.'); // Mensaje de error genérico
        } else {
            setNuevoPuesto({ Nombre_Puesto: '', Salario_Puesto: '' });
            setModalCrear(false);
        }
    };

    const validatePuestoActualizar = () => {
        const { Nombre_Puesto, Salario_Puesto } = puestoActualizar;
        let isValid = true;

        // Limpiar errores anteriores
        setErrorNombreActualizar('');
        setErrorSalarioActualizar('');

        // Validaciones
        if (!/^[A-Z][a-zA-Z\s]*$/.test(Nombre_Puesto)) {
            setErrorNombreActualizar("El nombre debe empezar con mayúscula y no contener números ni signos.");
            isValid = false;
        }
        if (!/^\d+$/.test(Salario_Puesto)) {
            setErrorSalarioActualizar("El salario solo puede contener números.");
            isValid = false;
        }

        return isValid;
    };

    const handleActualizarPuesto = async () => {
        if (!validatePuestoActualizar()) {
            return; 
        }

        const success = await actualizarPuesto(puestoActualizar.id, puestoActualizar);
        if (!success) {
            setErrorNombreActualizar('Error al actualizar el puesto laboral.'); // Mensaje de error genérico
        } else {
            setPuestoActualizar({ id: '', Nombre_Puesto: '', Salario_Puesto: '' });
            setModalActualizar(false);
        }
    };

    const puestosFiltrados = puestos.filter(puesto => 
        puesto.Nombre_Puesto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Gestión de Puestos Laborales - 2024</h1>

            <button
                onClick={() => setModalCrear(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 shadow-md transition duration-300 ease-in-out transform hover:scale-105 mx-auto block"
            >
                + Nuevo Puesto
            </button>

            {/* Campo de búsqueda */}
            <input
                type="text"
                placeholder="Buscar por nombre del puesto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded p-2 mb-4 w-full"
            />

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

            <div className="overflow-hidden rounded-lg shadow-lg">
                <table className="min-w-full bg-white dark:bg-[#2D2D3B] border-collapse border rounded-md shadow-md">
                    <thead className="bg-gray-100 dark:bg-[#3A3A4D] border-b">
                        <tr>
                            <th className="px-4 py-2 text-black dark:text-white text-center">ID</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Nombre del Puesto</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Salario</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {puestosFiltrados.length > 0 ? (
                            puestosFiltrados.map((puesto) => (
                                <tr
                                    key={puesto.idpuesto_laboral}
                                    className="border-b dark:border-[#4D4D61]"
                                >
                                    <td className="px-4 py-2 text-black dark:text-white text-center">
                                        {puesto.idpuesto_laboral || puesto.id}
                                    </td>
                                    <td className="px-4 py-2 text-black dark:text-white text-center">
                                        {puesto.Nombre_Puesto || puesto.nombre}
                                    </td>
                                    <td className="px-4 py-2 text-black dark:text-white text-center">
                                        {puesto.Salario_Puesto || puesto.salario}
                                    </td>
                                    <td className="px-4 py-2 text-black dark:text-white text-center">
                                        <button
                                            onClick={() => {
                                                setPuestoActualizar({
                                                    id: puesto.idpuesto_laboral,
                                                    Nombre_Puesto: puesto.Nombre_Puesto,
                                                    Salario_Puesto: puesto.Salario_Puesto,
                                                });
                                                setModalActualizar(true);
                                            }}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg mr-2"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => eliminarPuesto(puesto.idpuesto_laboral)}
                                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-black dark:text-white">
                                    No hay puestos laborales que coincidan con la búsqueda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal para crear nuevo puesto laboral */}
            {modalCrear && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Crear Nuevo Puesto Laboral</h2>
                        <input
                            type="text"
                            placeholder="Nombre del Puesto"
                            value={nuevoPuesto.Nombre_Puesto}
                            onChange={(e) => setNuevoPuesto({ ...nuevoPuesto, Nombre_Puesto: e.target.value })}
                            className="border rounded p-2 mb-2 w-full"
                        />
                        {errorNombreCrear && <p className="text-red-500 text-sm mb-2">{errorNombreCrear}</p>}
                        <input
                            type="text"
                            placeholder="Salario del Puesto"
                            value={nuevoPuesto.Salario_Puesto}
                            onChange={(e) => setNuevoPuesto({ ...nuevoPuesto, Salario_Puesto: e.target.value })}
                            className="border rounded p-2 mb-4 w-full"
                        />
                        {errorSalarioCrear && <p className="text-red-500 text-sm mb-2">{errorSalarioCrear}</p>}
                        <div className="flex justify-between">
                            <button
                                onClick={handleCrearPuesto}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md"
                            >
                                Crear
                            </button>
                            <button
                                onClick={() => setModalCrear(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para actualizar puesto laboral */}
            {modalActualizar && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Actualizar Puesto Laboral</h2>
                        <input
                            type="text"
                            placeholder="Nombre del Puesto"
                            value={puestoActualizar.Nombre_Puesto}
                            onChange={(e) => setPuestoActualizar({ ...puestoActualizar, Nombre_Puesto: e.target.value })}
                            className="border rounded p-2 mb-2 w-full"
                        />
                        {errorNombreActualizar && <p className="text-red-500 text-sm mb-2">{errorNombreActualizar}</p>}
                        <input
                            type="text"
                            placeholder="Salario del Puesto"
                            value={puestoActualizar.Salario_Puesto}
                            onChange={(e) => setPuestoActualizar({ ...puestoActualizar, Salario_Puesto: e.target.value })}
                            className="border rounded p-2 mb-4 w-full"
                        />
                        {errorSalarioActualizar && <p className="text-red-500 text-sm mb-2">{errorSalarioActualizar}</p>}
                        <div className="flex justify-between">
                            <button
                                onClick={handleActualizarPuesto}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md"
                            >
                                Actualizar
                            </button>
                            <button
                                onClick={() => setModalActualizar(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PuestoLaboral;

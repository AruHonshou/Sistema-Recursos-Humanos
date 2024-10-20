// ESTO ES PARA GESTIONAR ROLES, SE USA AQUI TEMPORAL

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Roles = () => {
    const [roles, setRoles] = useState([]); 
    const [modalCrear, setModalCrear] = useState(false); 
    const [modalActualizar, setModalActualizar] = useState(false); 
    const [nuevoRol, setNuevoRol] = useState(''); 
    const [rolActualizar, setRolActualizar] = useState({ id: '', descripcion: '' });
    const [error, setError] = useState(''); // Mensaje de error

    const obtenerRoles = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/roles');
            setRoles(response.data[0]);
        } catch (error) {
            console.error('Error al obtener los roles:', error);
        }
    };

    const validarRol = (rol) => {
        // Expresión regular para permitir solo letras y espacios, con la inicial en mayúscula
        const regex = /^[A-Z][a-zA-Z\s]*$/;
        return regex.test(rol);
    };

    const crearRol = async () => {
        if (!validarRol(nuevoRol)) {
            setError('El rol debe comenzar con una letra mayúscula y contener solo letras y espacios.');
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/roles', { Descripcion_Rol: nuevoRol });
            setNuevoRol('');
            setModalCrear(false);
            obtenerRoles();
            setError(''); // Limpiar el mensaje de error
        } catch (error) {
            console.error('Error al crear el rol:', error);
        }
    };

    const eliminarRol = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/roles/${id}`);
            obtenerRoles();
        } catch (error) {
            console.error('Error al eliminar el rol:', error);
        }
    };

    const actualizarRol = async () => {
        if (!validarRol(rolActualizar.descripcion)) {
            setError('El rol debe comenzar con una letra mayúscula y contener solo letras y espacios.');
            return;
        }

        try {
            await axios.put(`http://localhost:3000/api/roles/${rolActualizar.id}`, { Descripcion_Rol: rolActualizar.descripcion });
            setRolActualizar({ id: '', descripcion: '' });
            setModalActualizar(false);
            obtenerRoles();
            setError(''); // Limpiar el mensaje de error
        } catch (error) {
            console.error('Error al actualizar el rol:', error);
        }
    };

    const abrirModalActualizar = (rol) => {
        setRolActualizar({ id: rol.idroles, descripcion: rol.Descripcion_Rol });
        setModalActualizar(true);
    };

    const generarPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['ID', 'Nombre del Rol']],
            body: roles.map((rol) => [rol.idroles, rol.Descripcion_Rol]),
        });
        doc.save('roles.pdf');
    };

    const generarExcel = () => {
        const ws = XLSX.utils.json_to_sheet(roles);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Roles');
        XLSX.writeFile(wb, 'roles.xlsx');
    };

    useEffect(() => {
        obtenerRoles();
    }, []);

    return (
        <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Gestión de Roles - 2024</h1>

            <button
                onClick={() => setModalCrear(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 shadow-md transition duration-300 ease-in-out transform hover:scale-105 mx-auto block"
            >
                + Nuevo Rol
            </button>

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
                <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
                    <thead className="bg-gray-100 dark:bg-[#3A3A4D] border-b">
                        <tr>
                            <th className="px-4 py-2 text-black dark:text-white text-center">ID</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Nombre del Rol</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((rol) => (
                            <tr key={rol.idroles} className="border-b dark:border-[#4D4D61]">
                                <td className="px-4 py-2 text-black dark:text-white text-center">{rol.idroles}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{rol.Descripcion_Rol}</td>
                                <td className="px-4 py-2 flex justify-center space-x-2">
                                    <button
                                        onClick={() => abrirModalActualizar(rol)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg mr-2 shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                                    >
                                        <FaEdit className="mr-1" />
                                    </button>

                                    <button
                                        onClick={() => eliminarRol(rol.idroles)}
                                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                                    >
                                        <FaTrashAlt className="mr-1" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalCrear && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-xl transition duration-300 ease-in-out">
                        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Nuevo Rol</h2>
                        <input
                            type="text"
                            value={nuevoRol}
                            onChange={(e) => setNuevoRol(e.target.value)}
                            placeholder="Nombre del Rol"
                            className="border p-2 mb-4 w-full text-black dark:text-white dark:bg-[#3A3A4D] rounded-lg"
                        />
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <div className="flex justify-end">
                            <button
                                onClick={() => setModalCrear(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg mr-2 shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={crearRol}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalActualizar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-xl transition duration-300 ease-in-out">
                        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Actualizar Rol</h2>
                        <input
                            type="text"
                            value={rolActualizar.descripcion}
                            onChange={(e) => setRolActualizar({ ...rolActualizar, descripcion: e.target.value })}
                            placeholder="Nuevo nombre del rol"
                            className="border p-2 mb-4 w-full text-black dark:text-white dark:bg-[#3A3A4D] rounded-lg"
                        />
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <div className="flex justify-end">
                            <button
                                onClick={() => setModalActualizar(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg mr-2 shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={actualizarRol}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Actualizar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Roles;

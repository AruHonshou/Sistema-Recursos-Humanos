import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const GestionUsuarios = () => {
    const [personas, setPersonas] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState("");

    // Función para obtener y filtrar datos
    const obtenerPersonas = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/detalles-empleados');
            const personasFiltradas = response.data[0].filter(persona => persona.idDia === 1);
            setPersonas(personasFiltradas);
        } catch (error) {
            console.error('Error al obtener las personas:', error);
        }
    };

    // Función para exportar a PDF
    const generarPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Descripción', 'Persona', 'ID', 'Fecha Nacimiento', 'Fecha Ingreso', 'Teléfono', 'Correo', 'Puesto', 'Salario', 'Horario', 'Usuario', 'Estado', 'Rol']],
            body: personas
                .filter(persona => (filtroEstado === "Activo" && persona.Usuario_Activo.data[0] === 1) || (filtroEstado === "Inactivo" && persona.Usuario_Activo.data[0] === 0) || filtroEstado === "")
                .map(persona => [
                    persona.Descripcion_Catalogo_Persona,
                    persona.Persona,
                    persona.idPersona,
                    new Date(persona.Fecha_Nacimiento).toLocaleDateString('es-ES'),
                    new Date(persona.Fecha_Ingreso).toLocaleDateString('es-ES'),
                    persona.numero_telefono,
                    persona.descripcion_correo,
                    persona.Nombre_Puesto,
                    persona.Salario_Puesto,
                    persona.Tipo_horario,
                    persona.Nombre_Usuario,
                    persona.Usuario_Activo.data[0] === 1 ? "Activo" : "Inactivo",
                    persona.Descripcion_Rol
                ]),
        });
        doc.save('personas.pdf');
    };

    // Función para exportar a Excel
    const generarExcel = () => {
        const ws = XLSX.utils.json_to_sheet(personas
            .filter(persona => (filtroEstado === "Activo" && persona.Usuario_Activo.data[0] === 1) || (filtroEstado === "Inactivo" && persona.Usuario_Activo.data[0] === 0) || filtroEstado === "")
            .map(persona => ({
                Descripcion_Catalogo_Persona: persona.Descripcion_Catalogo_Persona,
                Persona: persona.Persona,
                idPersona: persona.idPersona,
                Fecha_Nacimiento: new Date(persona.Fecha_Nacimiento).toLocaleDateString('es-ES'),
                Fecha_Ingreso: new Date(persona.Fecha_Ingreso).toLocaleDateString('es-ES'),
                numero_telefono: persona.numero_telefono,
                descripcion_correo: persona.descripcion_correo,
                Nombre_Puesto: persona.Nombre_Puesto,
                Salario_Puesto: persona.Salario_Puesto,
                Tipo_horario: persona.Tipo_horario,
                Nombre_Usuario: persona.Nombre_Usuario,
                Usuario_Activo: persona.Usuario_Activo.data[0] === 1 ? "Activo" : "Inactivo",
                Descripcion_Rol: persona.Descripcion_Rol
            })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Personas');
        XLSX.writeFile(wb, 'personas.xlsx');
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        obtenerPersonas();
    }, []);

    return (
        <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Reporte de Personas</h1>

            {/* Buscador por estado */}
            <input
                type="text"
                placeholder="Buscar por estado (Activo/Inactivo)"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="border rounded-md p-2 mb-4 w-full"
            />

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

            {/* Tabla */}
            <div className="overflow-hidden rounded-lg shadow-lg">
                <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
                    <thead className="bg-gray-100 dark:bg-[#3A3A4D] border-b">
                        <tr>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Descripción</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Persona</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">ID</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Nacimiento</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Ingreso</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Teléfono</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Correo</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Puesto</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Salario</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Horario</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Usuario</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Estado</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personas
                            .filter(persona => (filtroEstado === "Activo" && persona.Usuario_Activo.data[0] === 1) || (filtroEstado === "Inactivo" && persona.Usuario_Activo.data[0] === 0) || filtroEstado === "")
                            .map((persona) => (
                                <tr key={persona.idPersona} className="border-b hover:bg-gray-100 dark:hover:bg-[#3A3A4D]">
                                    <td className="px-4 py-2 text-black dark:text-white text-center">{persona.Descripcion_Catalogo_Persona}</td>
                                    <td className="px-4 py-2 text-black dark:text-white text-center">{persona.Persona}</td>
                                    <td className="px-4 py-2 text-black dark:text-white text-center">{persona.idPersona}</td>
                                    <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(persona.Fecha_Nacimiento).toLocaleDateString('es-ES')}</td>
                                    <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(persona.Fecha_Ingreso).toLocaleDateString('es-ES')}</td>
                                    <td className="px-4 py-2 text-black dark:text-white text-center">{persona.numero_telefono}</td>
                                    <td className="px-4 py-2 text-black dark:text-white text-center">{persona.descripcion_correo}</td>
                                    <td className="px-4 py-2 text-black dark:text-white text-center">{persona.Nombre_Puesto}</td>
                                    <td className="px-4 py-2 text-black dark:text-white text-center">{persona.Salario_Puesto}</td>
                                    <td className="px-4 py-2 text-black dark:text-white text-center">{persona.Tipo_horario}</td>
                                    <td className="px-4 py-2 text-black dark:text-white text-center">{persona.Nombre_Usuario}</td>
                                    <td className="px-4 py-2 text-black dark:text-white text-center">
                                        {persona.Usuario_Activo.data[0] === 1 ? "Activo" : "Inactivo"}
                                    </td>
                                    <td className="px-4 py-2 text-black dark:text-white text-center">{persona.Descripcion_Rol}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GestionUsuarios;

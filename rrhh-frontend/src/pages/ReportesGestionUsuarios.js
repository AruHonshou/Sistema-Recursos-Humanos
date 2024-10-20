import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ReportesGestionUsuarios = () => {
    const [personas, setPersonas] = useState([]);
    const [catalogoPersonas, setCatalogoPersonas] = useState([]);  // Para almacenar las descripciones del catálogo
    const [filtros, setFiltros] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);  // Para mostrar/ocultar el menú

    const camposFiltro = [
        'idPersona', 'Nombre', 'Primer_Apellido', 'Segundo_Apellido', 'Fecha_Nacimiento',
        'catalogo_persona_idCatalogo_Persona', 'Numero_Telefono', 'Detalle_Telefono',
        'catalogo_telefono_idCatalogo_Telefono', 'Direccion_Especifica', 'distrito_idDistrito',
        'distrito_canton_idCanton', 'distrito_canton_provincia_idprovincia', 'Descripcion_Correo',
        'catalogo_correo_idCatalogo_Correo', 'Fecha_Ingreso', 'puesto_laboral_idpuesto_laboral',
        'tipo_horario_idtipo_horario', 'Nombre_Usuario', 'Contrasena', 'roles_idroles'
    ];

    const handleFiltroChange = (campo) => {
        setFiltros(prevFiltros =>
            prevFiltros.includes(campo)
                ? prevFiltros.filter(f => f !== campo)
                : [...prevFiltros, campo]
        );
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);  // Cambia el estado para mostrar/ocultar el menú
    };

    const obtenerPersonas = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/personas');
            const personasFiltradas = response.data[0].filter(persona => persona.dias_idDia === 1);
            setPersonas(personasFiltradas);
        } catch (error) {
            console.error('Error al obtener las personas:', error);
        }
    };

    // Obtener descripciones del catálogo de personas
    const obtenerCatalogoPersonas = async () => {
        try {
            const response = await axios.get('http://localhost:3000/catalogoPersona');
            setCatalogoPersonas(response.data);
        } catch (error) {
            console.error('Error al obtener el catálogo de personas:', error);
        }
    };

    const obtenerDescripcionCatalogoPersona = (id) => {
        const catalogo = catalogoPersonas.find(item => item.idCatalogo_Persona === id);
        return catalogo ? catalogo.Descripcion_Catalogo_Persona : 'No disponible';
    };

    const generarPDF = () => {
        const doc = new jsPDF();
        const selectedHeaders = filtros.map(filtro => filtro.replace('_', ' '));
        const selectedData = personas.map(persona =>
            filtros.map(filtro => {
                if (filtro === 'Fecha_Nacimiento') {
                    return new Date(persona.Fecha_Nacimiento).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
                } else if (filtro === 'catalogo_persona_idCatalogo_Persona') {
                    return obtenerDescripcionCatalogoPersona(persona.catalogo_persona_idCatalogo_Persona);
                } else {
                    return persona[filtro];
                }
            })
        );

        doc.autoTable({
            head: [selectedHeaders],
            body: selectedData,
        });
        doc.save('personas_filtradas.pdf');
    };

    const generarExcel = () => {
        const selectedData = personas.map(persona => {
            const obj = {};
            filtros.forEach(filtro => {
                if (filtro === 'Fecha_Nacimiento') {
                    obj[filtro] = new Date(persona.Fecha_Nacimiento).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
                } else if (filtro === 'catalogo_persona_idCatalogo_Persona') {
                    obj[filtro] = obtenerDescripcionCatalogoPersona(persona.catalogo_persona_idCatalogo_Persona);
                } else {
                    obj[filtro] = persona[filtro];
                }
            });
            return obj;
        });

        const ws = XLSX.utils.json_to_sheet(selectedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Personas Filtradas');
        XLSX.writeFile(wb, 'personas_filtradas.xlsx');
    };

    useEffect(() => {
        obtenerPersonas();
        obtenerCatalogoPersonas();  // Obtener las descripciones del catálogo
    }, []);

    return (
        <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Gestión de Personas</h1>

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

                {/* Botón para mostrar/ocultar el menú de filtros */}
                <div className="relative">
                    <button
                        onClick={toggleMenu}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Filtrar por
                    </button>
                    {/* Menú desplegable que se muestra/oculta según el estado */}
                    {menuVisible && (
                        <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg p-4 w-64 z-10 max-h-64 overflow-y-auto">
                            {camposFiltro.map(campo => (
                                <label key={campo} className="block mb-2">
                                    <input
                                        type="checkbox"
                                        checked={filtros.includes(campo)}
                                        onChange={() => handleFiltroChange(campo)}
                                        className="mr-2"
                                    />
                                    {campo.replace('_', ' ')}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Tabla sin límite de tamaño */}
            <div className="rounded-lg shadow-lg">
                <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
                    <thead className="bg-gray-100 dark:bg-[#3A3A4D] border-b">
                        <tr>
                            {filtros.map(filtro => (
                                <th key={filtro} className="px-4 py-2 text-black dark:text-white text-center">
                                    {filtro.replace('_', ' ')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {personas.map(persona => (
                            <tr key={persona.idPersona} className="border-b hover:bg-gray-100 dark:hover:bg-[#3A3A4D]">
                                {filtros.map(filtro => (
                                    <td key={filtro} className="px-4 py-2 text-black dark:text-white text-center">
                                        {filtro === 'Fecha_Nacimiento'
                                            ? new Date(persona.Fecha_Nacimiento).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
                                            : filtro === 'catalogo_persona_idCatalogo_Persona'
                                                ? obtenerDescripcionCatalogoPersona(persona.catalogo_persona_idCatalogo_Persona)
                                                : persona[filtro]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportesGestionUsuarios;

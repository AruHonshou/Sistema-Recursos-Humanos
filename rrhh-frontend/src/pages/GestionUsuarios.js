import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const GestionUsuarios = () => {
    
    const [personas, setPersonas] = useState([]);
    const [modalActualizar, setModalActualizar] = useState(false);
    const [nuevaPersona, setNuevaPersona] = useState({
        idPersona: '',
        Nombre: '', // Cambiado a 'Nombre'
        Primer_Apellido: '', // Cambiado a 'Primer_Apellido'
        Segundo_Apellido: '', // Cambiado a 'Segundo_Apellido'
        Fecha_Nacimiento: '', // Cambiado a 'Fecha_Nacimiento'
        catalogo_persona_idCatalogo_Persona: '', // Cambiado a 'catalogo_persona_idCatalogo_Persona'
        Numero_Telefono: '', // Cambiado a 'Numero_Telefono'
        Detalle_Telefono: '', // Cambiado a 'Detalle_Telefono'
        catalogo_telefono_idCatalogo_Telefono: '', // Cambiado a 'catalogo_telefono_idCatalogo_Telefono'
        Direccion_Especifica: '', // Cambiado a 'Direccion_Especifica'
        distrito_idDistrito: '', // Cambiado a 'distrito_idDistrito'
        distrito_canton_idCanton: '', // Cambiado a 'distrito_canton_idCanton'
        distrito_canton_provincia_idprovincia: '', // Cambiado a 'distrito_canton_provincia_idprovincia'
        Descripcion_Correo: '', // Cambiado a 'Descripcion_Correo'
        catalogo_correo_idCatalogo_Correo: '', // Cambiado a 'catalogo_correo_idCatalogo_Correo'
        Fecha_Ingreso: '', // Cambiado a 'Fecha_Ingreso'
        puesto_laboral_idpuesto_laboral: '', // Cambiado a 'puesto_laboral_idpuesto_laboral'
        tipo_horario_idtipo_horario: '', // Cambiado a 'tipo_horario_idtipo_horario'
        Nombre_Usuario: '', // Cambiado a 'Nombre_Usuario'
        Contrasena: '', // Cambiado a 'Contrasena'
        roles_idroles: '', // Cambiado a 'roles_idroles'
    });

    const [error, setError] = useState(null);
    const [modalCrear, setModalCrear] = useState(false);


    const [personaActualizar, setPersonaActualizar] = useState({
        id: '',
        nombre: '',
        apellido1: '',
        apellido2: '',
        fechaNacimiento: '',
        numeroTelefono: '',
        correo: '',
        username: '',
    });
    // const [error, setError] = useState('');

    const obtenerPersonas = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/personas');
            // Filtrar personas donde dias_idDia es 1
            const personasFiltradas = response.data[0].filter(persona => persona.dias_idDia === 1);
            setPersonas(personasFiltradas); // Establece solo las personas filtradas
        } catch (error) {
            console.error('Error al obtener las personas:', error);
        }
    };

    const crearPersona = async () => {
        // Validar que idPersona no esté vacío
        if (!nuevaPersona.idPersona) {
            setError('El ID de Persona es obligatorio.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/personas', nuevaPersona);

            if (!response.status === 201) {
                throw new Error('Error al crear la persona.');
            }

            // Mostrar alerta de éxito
            alert('Usuario creado exitosamente!');

            // Si se crea con éxito, cerramos el modal y limpiamos el estado
            setModalCrear(false);
            setNuevaPersona({
                idPersona: '',
                nombre: '',
                apellido1: '',
                apellido2: '',
                fechaNacimiento: '',
                catalogoPersonaId: '',
                numeroTelefono: '',
                detalleTelefono: '',
                catalogoTelefonoId: '',
                direccionEspecifica: '',
                distritoId: '',
                distritoCantonId: '',
                distritoCantonProvinciaId: '',
                correo: '',
                catalogoCorreoId: '',
                fechaIngreso: '',
                puestoLaboralId: '',
                tipoHorarioId: '',
                username: '',
                contrasena: '',
                rolesId: '',
            });

            // Llama a la función que obtiene las personas para actualizar la tabla
            obtenerPersonas(); // Llama a esta función para actualizar la lista de personas

        } catch (error) {
            setError(`Error al crear el registro: ${error.message}`);
        }
    };






    const eliminarPersona = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/personas/${id}`);
            obtenerPersonas();
        } catch (error) {
            console.error('Error al eliminar la persona:', error);
        }
    };

    const actualizarPersona = async () => {
        if (!personaActualizar.nombre || !personaActualizar.apellido1 || !personaActualizar.fechaNacimiento || !personaActualizar.numeroTelefono || !personaActualizar.correo || !personaActualizar.username) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        try {
            await axios.put(`http://localhost:3000/api/personas/${personaActualizar.id}`, {
                Nombre: personaActualizar.nombre,
                Primer_Apellido: personaActualizar.apellido1,
                Segundo_Apellido: personaActualizar.apellido2,
                Fecha_Nacimiento: personaActualizar.fechaNacimiento,
                numero_telefono: personaActualizar.numeroTelefono,
                descripcion_correo: personaActualizar.correo,
                Nombre_Usuario: personaActualizar.username,
                dias_idDia: 1, // Asegurarse de mantener el idDia 1 al actualizar
            });
            setPersonaActualizar({ id: '', nombre: '', apellido1: '', apellido2: '', fechaNacimiento: '', numeroTelefono: '', correo: '', username: '' });
            setModalActualizar(false);
            obtenerPersonas();
            setError('');
        } catch (error) {
            console.error('Error al actualizar la persona:', error);
        }
    };

    const abrirModalActualizar = (persona) => {
        setPersonaActualizar({
            id: persona.idPersona,
            nombre: persona.Nombre,
            apellido1: persona.Primer_Apellido,
            apellido2: persona.Segundo_Apellido,
            fechaNacimiento: persona.Fecha_Nacimiento,
            numeroTelefono: persona.numero_telefono,
            correo: persona.descripcion_correo,
            username: persona.Nombre_Usuario,
        });
        setModalActualizar(true);
    };

    const generarPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['ID', 'Nombre', 'Primer Apellido', 'Segundo Apellido', 'Fecha de Nacimiento', 'Número de Teléfono', 'Correo Electrónico', 'Username']],
            body: personas.map((persona) => [
                persona.idPersona,
                persona.Nombre,
                persona.Primer_Apellido,
                persona.Segundo_Apellido,
                new Date(persona.Fecha_Nacimiento).toLocaleDateString('es-ES'), // Formato a solo año, mes y día
                persona.numero_telefono,
                persona.descripcion_correo,
                persona.Nombre_Usuario,
            ]),
        });
        doc.save('personas.pdf');
    };

    const generarExcel = () => {
        const ws = XLSX.utils.json_to_sheet(personas.map(persona => ({
            ...persona,
            Fecha_Nacimiento: new Date(persona.Fecha_Nacimiento).toLocaleDateString('es-ES') // Formato a solo año, mes y día
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Personas');
        XLSX.writeFile(wb, 'personas.xlsx');
    };

    useEffect(() => {
        obtenerPersonas();
    }, []);

    return (
        <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Gestión de Personas - 2024</h1>

            <button
                onClick={() => setModalCrear(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 shadow-md transition duration-300 ease-in-out transform hover:scale-105 mx-auto block"
            >
                + Nueva Persona
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
                            <th className="px-4 py-2 text-black dark:text-white text-center">Nombre</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Primer Apellido</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Segundo Apellido</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Fecha de Nacimiento</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Número de Teléfono</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Correo Electrónico</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Username</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personas.map((persona) => (
                            <tr key={persona.idPersona} className="border-b hover:bg-gray-100 dark:hover:bg-[#3A3A4D]">
                                <td className="px-4 py-2 text-black dark:text-white text-center">{persona.idPersona}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{persona.Nombre}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{persona.Primer_Apellido}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{persona.Segundo_Apellido}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">
                                    {new Date(persona.Fecha_Nacimiento).toLocaleDateString('es-ES')} {/* Solo año, mes y día */}
                                </td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{persona.numero_telefono}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{persona.descripcion_correo}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{persona.Nombre_Usuario}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">
                                    <button onClick={() => abrirModalActualizar(persona)} className="text-yellow-500 hover:text-yellow-700">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => eliminarPersona(persona.idPersona)} className="text-red-500 hover:text-red-700 ml-2">
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Crear Persona */}
            {modalCrear && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-xl transition duration-300 ease-in-out w-full max-w-5xl">
                        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Nueva Persona</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="ID Persona"
                                value={nuevaPersona.idPersona}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, idPersona: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={nuevaPersona.Nombre}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, Nombre: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="Primer Apellido"
                                value={nuevaPersona.Primer_Apellido}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, Primer_Apellido: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="Segundo Apellido"
                                value={nuevaPersona.Segundo_Apellido}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, Segundo_Apellido: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="date"
                                placeholder="Fecha de Nacimiento"
                                value={nuevaPersona.Fecha_Nacimiento}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, Fecha_Nacimiento: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="ID de Catálogo de Persona"
                                value={nuevaPersona.catalogo_persona_idCatalogo_Persona}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, catalogo_persona_idCatalogo_Persona: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="Número de Teléfono"
                                value={nuevaPersona.Numero_Telefono}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, Numero_Telefono: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="Detalle de Teléfono"
                                value={nuevaPersona.Detalle_Telefono}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, Detalle_Telefono: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="ID de Catálogo de Teléfono"
                                value={nuevaPersona.catalogo_telefono_idCatalogo_Telefono}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, catalogo_telefono_idCatalogo_Telefono: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="Dirección Específica"
                                value={nuevaPersona.Direccion_Especifica}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, Direccion_Especifica: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="ID de Distrito"
                                value={nuevaPersona.distrito_idDistrito}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, distrito_idDistrito: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="ID de Cantón"
                                value={nuevaPersona.distrito_canton_idCanton}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, distrito_canton_idCanton: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="ID de Provincia"
                                value={nuevaPersona.distrito_canton_provincia_idprovincia}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, distrito_canton_provincia_idprovincia: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="email"
                                placeholder="Descripción Correo"
                                value={nuevaPersona.Descripcion_Correo}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, Descripcion_Correo: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="ID de Catálogo de Correo"
                                value={nuevaPersona.catalogo_correo_idCatalogo_Correo}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, catalogo_correo_idCatalogo_Correo: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="date"
                                placeholder="Fecha de Ingreso"
                                value={nuevaPersona.Fecha_Ingreso}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, Fecha_Ingreso: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="ID de Puesto Laboral"
                                value={nuevaPersona.puesto_laboral_idpuesto_laboral}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, puesto_laboral_idpuesto_laboral: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="ID de Tipo de Horario"
                                value={nuevaPersona.tipo_horario_idtipo_horario}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, tipo_horario_idtipo_horario: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="Nombre de Usuario"
                                value={nuevaPersona.Nombre_Usuario}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, Nombre_Usuario: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={nuevaPersona.Contrasena}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, Contrasena: e.target.value })}
                                className="border rounded-md p-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="ID de Rol"
                                value={nuevaPersona.roles_idroles}
                                onChange={(e) => setNuevaPersona({ ...nuevaPersona, roles_idroles: e.target.value })}
                                className="border rounded-md p-2 mb-4 w-full"
                            />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setModalCrear(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={crearPersona}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                            >
                                Crear
                            </button>
                        </div>
                    </div>
                </div>
            )}






            {/* Modal Actualizar Persona */}
            {modalActualizar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-xl transition duration-300 ease-in-out">
                        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Actualizar Persona</h2>
                        {/* Formulario para actualización de personas */}
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={personaActualizar.nombre}
                            onChange={(e) => setPersonaActualizar({ ...personaActualizar, nombre: e.target.value })}
                            className="border rounded-md p-2 mb-2 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Primer Apellido"
                            value={personaActualizar.apellido1}
                            onChange={(e) => setPersonaActualizar({ ...personaActualizar, apellido1: e.target.value })}
                            className="border rounded-md p-2 mb-2 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Segundo Apellido"
                            value={personaActualizar.apellido2}
                            onChange={(e) => setPersonaActualizar({ ...personaActualizar, apellido2: e.target.value })}
                            className="border rounded-md p-2 mb-2 w-full"
                        />
                        <input
                            type="date"
                            value={personaActualizar.fechaNacimiento}
                            onChange={(e) => setPersonaActualizar({ ...personaActualizar, fechaNacimiento: e.target.value })}
                            className="border rounded-md p-2 mb-2 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Número de Teléfono"
                            value={personaActualizar.numeroTelefono}
                            onChange={(e) => setPersonaActualizar({ ...personaActualizar, numeroTelefono: e.target.value })}
                            className="border rounded-md p-2 mb-2 w-full"
                        />
                        <input
                            type="email"
                            placeholder="Correo Electrónico"
                            value={personaActualizar.correo}
                            onChange={(e) => setPersonaActualizar({ ...personaActualizar, correo: e.target.value })}
                            className="border rounded-md p-2 mb-2 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Nombre de Usuario"
                            value={personaActualizar.username}
                            onChange={(e) => setPersonaActualizar({ ...personaActualizar, username: e.target.value })}
                            className="border rounded-md p-2 mb-4 w-full"
                        />
                        {error && <p className="text-red-500">{error}</p>}
                        <button
                            onClick={actualizarPersona}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionUsuarios;

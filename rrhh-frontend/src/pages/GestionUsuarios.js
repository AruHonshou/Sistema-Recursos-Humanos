import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const GestionUsuarios = () => {
    const [catalogoPersonas, setCatalogoPersonas] = useState([]);
    const [catalogoTelefonos, setCatalogoTelefonos] = useState([]);
    const [catalogosCorreo, setCatalogosCorreo] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [cantones, setCantones] = useState([]);
    const [distritos, setDistritos] = useState([]);

    const [tiposHorario, setTiposHorario] = useState([]);
    const [puestosLaborales, setPuestosLaborales] = useState([]);
    const [roles, setRoles] = useState([]);

    const [personas, setPersonas] = useState([]);
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

    const [modalActualizar, setModalActualizar] = useState(false); // Modal de actualización


    const [error, setError] = useState(null);
    const [modalCrear, setModalCrear] = useState(false);

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
        // Validaciones de campos
        const cedulaRegex = /^[0-9]+$/; // Solo números
        const nameRegex = /^[A-Z][a-zA-Z\s]+$/; // Primera letra mayúscula, resto solo letras
        const phoneRegex = /^[0-9]+$/; // Solo números
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validación básica de email

        // Validar cédula
        if (!nuevaPersona.idPersona || !cedulaRegex.test(nuevaPersona.idPersona)) {
            setError('La cédula debe contener solo números.');
            return;
        }

        // Validar nombre
        if (!nuevaPersona.Nombre || !nameRegex.test(nuevaPersona.Nombre)) {
            setError('El nombre debe iniciar con mayúscula y contener solo letras.');
            return;
        }

        // Validar primer apellido
        if (!nuevaPersona.Primer_Apellido || !nameRegex.test(nuevaPersona.Primer_Apellido)) {
            setError('El primer apellido debe iniciar con mayúscula y contener solo letras.');
            return;
        }

        // Validar segundo apellido
        if (!nuevaPersona.Segundo_Apellido || !nameRegex.test(nuevaPersona.Segundo_Apellido)) {
            setError('El segundo apellido debe iniciar con mayúscula y contener solo letras.');
            return;
        }

        // Validar fecha de nacimiento
        if (!nuevaPersona.Fecha_Nacimiento) {
            setError('Debe seleccionar una fecha de nacimiento.');
            return;
        }

        // Validar número de teléfono
        if (!nuevaPersona.Numero_Telefono || !phoneRegex.test(nuevaPersona.Numero_Telefono)) {
            setError('El número de teléfono debe contener solo números.');
            return;
        }

        // Validar detalle del teléfono
        if (!nuevaPersona.Detalle_Telefono || !nameRegex.test(nuevaPersona.Detalle_Telefono)) {
            setError('El detalle del teléfono debe iniciar con mayúscula y contener solo letras.');
            return;
        }

        // Validar provincia
        if (!nuevaPersona.distrito_canton_provincia_idprovincia) {
            setError('Debe seleccionar una provincia.');
            return;
        }

        // Validar cantón
        if (!nuevaPersona.distrito_canton_idCanton) {
            setError('Debe seleccionar un cantón.');
            return;
        }

        // Validar distrito
        if (!nuevaPersona.distrito_idDistrito) {
            setError('Debe seleccionar un distrito.');
            return;
        }

        // Validar correo electrónico
        if (!nuevaPersona.Descripcion_Correo || !emailRegex.test(nuevaPersona.Descripcion_Correo)) {
            setError('Debe proporcionar un correo electrónico válido.');
            return;
        }

        // Validar tipo de correo
        if (!nuevaPersona.catalogo_correo_idCatalogo_Correo) {
            setError('Debe seleccionar un tipo de correo.');
            return;
        }

        // Validar fecha de ingreso
        if (!nuevaPersona.Fecha_Ingreso) {
            setError('Debe seleccionar una fecha de ingreso.');
            return;
        }

        // Validar puesto laboral
        if (!nuevaPersona.puesto_laboral_idpuesto_laboral) {
            setError('Debe seleccionar un puesto laboral.');
            return;
        }

        // Validar tipo de horario
        if (!nuevaPersona.tipo_horario_idtipo_horario) {
            setError('Debe seleccionar un tipo de horario.');
            return;
        }

        // Validar nombre de usuario
        if (!nuevaPersona.Nombre_Usuario || /\d|[^\w\s]/.test(nuevaPersona.Nombre_Usuario)) {
            setError('El nombre de usuario no puede contener números ni símbolos.');
            return;
        }

        // Validar rol
        if (!nuevaPersona.roles_idroles) {
            setError('Debe seleccionar un rol.');
            return;
        }

        // Si todas las validaciones pasan, proceder con la creación
        try {
            const response = await axios.post('http://localhost:3000/api/personas', nuevaPersona);

            if (response.status !== 201) {
                throw new Error('Error al crear la persona.');
            }

            // Mostrar alerta de éxito
            alert('Usuario creado exitosamente!');

            // Si se crea con éxito, cerramos el modal y limpiamos el estado
            setModalCrear(false);
            setNuevaPersona({
                idPersona: '',
                Nombre: '',
                Primer_Apellido: '',
                Segundo_Apellido: '',
                Fecha_Nacimiento: '',
                catalogo_persona_idCatalogo_Persona: '',
                Numero_Telefono: '',
                Detalle_Telefono: '',
                catalogo_telefono_idCatalogo_Telefono: '',
                Direccion_Especifica: '',
                distrito_idDistrito: '',
                distrito_canton_idCanton: '',
                distrito_canton_provincia_idprovincia: '',
                Descripcion_Correo: '',
                catalogo_correo_idCatalogo_Correo: '',
                Fecha_Ingreso: '',
                puesto_laboral_idpuesto_laboral: '',
                tipo_horario_idtipo_horario: '',
                Nombre_Usuario: '',
                Contrasena: '',
                roles_idroles: '',
            });

            // Llama a la función que obtiene las personas para actualizar la tabla
            obtenerPersonas();

        } catch (error) {
            setError(`Error al crear el registro: ${error.message}`);
        }
    };


    const abrirModalActualizar = (persona) => {
        setNuevaPersona(persona); // Carga los datos de la persona seleccionada
        setModalActualizar(true); // Abre el modal de actualización
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
        // Validaciones de campos
        // const cedulaRegex = /^[0-9]+$/; // Solo números
        const nameRegex = /^[A-Z][a-zA-Z\s]+$/; // Primera letra mayúscula, resto solo letras
        const phoneRegex = /^[0-9]+$/; // Solo números
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validación básica de email

        // Validar cédula (no se permite modificar, por lo que no la validamos aquí)

        // Validar nombre
        if (!nuevaPersona.Nombre || !nameRegex.test(nuevaPersona.Nombre)) {
            setError('El nombre debe iniciar con mayúscula y contener solo letras.');
            return;
        }

        // Validar primer apellido
        if (!nuevaPersona.Primer_Apellido || !nameRegex.test(nuevaPersona.Primer_Apellido)) {
            setError('El primer apellido debe iniciar con mayúscula y contener solo letras.');
            return;
        }

        // Validar segundo apellido
        if (!nuevaPersona.Segundo_Apellido || !nameRegex.test(nuevaPersona.Segundo_Apellido)) {
            setError('El segundo apellido debe iniciar con mayúscula y contener solo letras.');
            return;
        }

        // Validar fecha de nacimiento
        if (!nuevaPersona.Fecha_Nacimiento) {
            setError('Debe seleccionar una fecha de nacimiento.');
            return;
        }

        // Validar número de teléfono
        if (!nuevaPersona.Numero_Telefono || !phoneRegex.test(nuevaPersona.Numero_Telefono)) {
            setError('El número de teléfono debe contener solo números.');
            return;
        }

        // Validar detalle del teléfono
        if (!nuevaPersona.Detalle_Telefono || !nameRegex.test(nuevaPersona.Detalle_Telefono)) {
            setError('El detalle del teléfono debe iniciar con mayúscula y contener solo letras.');
            return;
        }

        // Validar provincia
        if (!nuevaPersona.distrito_canton_provincia_idprovincia) {
            setError('Debe seleccionar una provincia.');
            return;
        }

        // Validar cantón
        if (!nuevaPersona.distrito_canton_idCanton) {
            setError('Debe seleccionar un cantón.');
            return;
        }

        // Validar distrito
        if (!nuevaPersona.distrito_idDistrito) {
            setError('Debe seleccionar un distrito.');
            return;
        }

        // Validar correo electrónico
        if (!nuevaPersona.Descripcion_Correo || !emailRegex.test(nuevaPersona.Descripcion_Correo)) {
            setError('Debe proporcionar un correo electrónico válido.');
            return;
        }

        // Validar tipo de correo
        if (!nuevaPersona.catalogo_correo_idCatalogo_Correo) {
            setError('Debe seleccionar un tipo de correo.');
            return;
        }

        // Validar fecha de ingreso
        if (!nuevaPersona.Fecha_Ingreso) {
            setError('Debe seleccionar una fecha de ingreso.');
            return;
        }

        // Validar puesto laboral
        if (!nuevaPersona.puesto_laboral_idpuesto_laboral) {
            setError('Debe seleccionar un puesto laboral.');
            return;
        }

        // Validar tipo de horario
        if (!nuevaPersona.tipo_horario_idtipo_horario) {
            setError('Debe seleccionar un tipo de horario.');
            return;
        }

        // Validar nombre de usuario
        if (!nuevaPersona.Nombre_Usuario || /\d|[^\w\s]/.test(nuevaPersona.Nombre_Usuario)) {
            setError('El nombre de usuario no puede contener números ni símbolos.');
            return;
        }

        // Validar rol
        if (!nuevaPersona.roles_idroles) {
            setError('Debe seleccionar un rol.');
            return;
        }

        // Si todas las validaciones pasan, proceder con la actualización
        try {
            // Clonar el objeto persona sin modificar el idPersona
            const personaActualizada = { ...nuevaPersona };
            delete personaActualizada.idPersona; // No incluir el ID en la actualización

            const response = await axios.put(`http://localhost:3000/api/personas/${nuevaPersona.idPersona}`, personaActualizada);

            if (response.status !== 200) {
                throw new Error('Error al actualizar la persona.');
            }

            // Mostrar alerta de éxito
            alert('Usuario actualizado exitosamente!');
            setModalActualizar(false); // Cierra el modal de actualización
            obtenerPersonas(); // Actualiza la lista de personas

        } catch (error) {
            setError(`Error al actualizar el registro: ${error.message}`);
        }
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
        const fetchCatalogoPersonas = async () => {
            try {
                const response = await axios.get('http://localhost:3000/catalogoPersona');
                console.log(response.data); // Log the response
                if (response.data.length > 0 && Array.isArray(response.data[0])) {
                    setCatalogoPersonas(response.data[0]); // Access the first element
                } else {
                    console.warn('No catalogo persona data available');
                }
            } catch (error) {
                console.error('Error fetching catalogo personas:', error);
            }
        };

        fetchCatalogoPersonas();
    }, []);


    useEffect(() => {
        const fetchCatalogoTelefonos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/catalogoTelefono');
                console.log(response.data); // Log the response
                if (response.data.length > 0 && Array.isArray(response.data[0])) {
                    setCatalogoTelefonos(response.data[0]); // Access the first element
                } else {
                    console.warn('No catalogo telefono data available');
                }
            } catch (error) {
                console.error('Error fetching catalogo telefonos:', error);
            }
        };

        fetchCatalogoTelefonos();
    }, []);

    useEffect(() => {
        const fetchCatalogosCorreo = async () => {
            try {
                const response = await axios.get('http://localhost:3000/catalogoCorreo');
                console.log(response.data); // Check response structure
                if (response.data.length > 0 && Array.isArray(response.data[0])) {
                    setCatalogosCorreo(response.data[0]); // Access the actual data
                } else {
                    console.warn('No catalogo correo data available');
                }
            } catch (error) {
                console.error('Error fetching catalogo correo:', error);
            }
        };

        fetchCatalogosCorreo();
    }, []);

    useEffect(() => {
        const fetchProvincias = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/provincias');
                setProvincias(response.data[0]);
            } catch (error) {
                console.error('Error al obtener provincias:', error);
            }
        };
        fetchProvincias();
    }, []);

    useEffect(() => {
        if (nuevaPersona.distrito_canton_provincia_idprovincia) {
            const fetchCantones = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/api/cantones?provinciaId=${nuevaPersona.distrito_canton_provincia_idprovincia}`);
                    setCantones(response.data[0]);
                } catch (error) {
                    console.error('Error al obtener cantones:', error);
                }
            };
            fetchCantones();
        }
    }, [nuevaPersona.distrito_canton_provincia_idprovincia]);

    useEffect(() => {
        if (nuevaPersona.distrito_canton_idCanton) {
            const fetchDistritos = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/api/distritos?cantonId=${nuevaPersona.distrito_canton_idCanton}`);
                    setDistritos(response.data[0]);
                } catch (error) {
                    console.error('Error al obtener distritos:', error);
                }
            };
            fetchDistritos();
        }
    }, [nuevaPersona.distrito_canton_idCanton]);

    useEffect(() => {
        const fetchPuestosLaborales = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/puesto-laboral');
                console.log(response.data); // Check response structure
                if (response.data.length > 0 && Array.isArray(response.data[0])) {
                    setPuestosLaborales(response.data[0]); // Access the actual data
                } else {
                    console.warn('No puestos laborales data available');
                }
            } catch (error) {
                console.error('Error fetching puestos laborales:', error);
            }
        };

        fetchPuestosLaborales();
    }, []);

    useEffect(() => {
        const fetchTiposHorario = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/tipos-horario');
                console.log(response.data); // Check response structure
                if (response.data.length > 0 && Array.isArray(response.data[0])) {
                    setTiposHorario(response.data[0]); // Access the actual data
                } else {
                    console.warn('No tipos de horario data available');
                }
            } catch (error) {
                console.error('Error fetching tipos de horario:', error);
            }
        };

        fetchTiposHorario();
    }, []);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/roles');
                console.log(response.data); // Check response structure
                if (response.data.length > 0 && Array.isArray(response.data[0])) {
                    setRoles(response.data[0]); // Access the actual data
                } else {
                    console.warn('No roles data available');
                }
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
    }, []);

    useEffect(() => {
        obtenerPersonas();
    }, []);

    return (
        <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Gestión de Personas - 2024</h1>

            <button
                onClick={() => {
                    // Reiniciar el estado de nuevaPersona antes de abrir el modal
                    setNuevaPersona({
                        idPersona: '',
                        Nombre: '',
                        Primer_Apellido: '',
                        Segundo_Apellido: '',
                        Fecha_Nacimiento: '',
                        catalogo_persona_idCatalogo_Persona: '',
                        Numero_Telefono: '',
                        Detalle_Telefono: '',
                        catalogo_telefono_idCatalogo_Telefono: '',
                        Direccion_Especifica: '',
                        distrito_idDistrito: '',
                        distrito_canton_idCanton: '',
                        distrito_canton_provincia_idprovincia: '',
                        Descripcion_Correo: '',
                        catalogo_correo_idCatalogo_Correo: '',
                        Fecha_Ingreso: '',
                        puesto_laboral_idpuesto_laboral: '',
                        tipo_horario_idtipo_horario: '',
                        Nombre_Usuario: '',
                        Contrasena: '',
                        roles_idroles: '',
                    });
                    setModalCrear(true); // Abrir el modal de crear nueva persona
                }}
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
                    <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-xl transition duration-300 ease-in-out w-full max-w-7xl h-screen overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Nueva Persona</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Cédula</label>
                                <input
                                    type="text"
                                    placeholder="Cédula"
                                    value={nuevaPersona.idPersona}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, idPersona: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Nombre</label>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={nuevaPersona.Nombre}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Nombre: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Primer Apellido</label>
                                <input
                                    type="text"
                                    placeholder="Primer Apellido"
                                    value={nuevaPersona.Primer_Apellido}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Primer_Apellido: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Segundo Apellido</label>
                                <input
                                    type="text"
                                    placeholder="Segundo Apellido"
                                    value={nuevaPersona.Segundo_Apellido}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Segundo_Apellido: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    value={nuevaPersona.Fecha_Nacimiento}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Fecha_Nacimiento: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Catálogo de Persona</label>
                                <select
                                    value={nuevaPersona.catalogo_persona_idCatalogo_Persona}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, catalogo_persona_idCatalogo_Persona: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                >
                                    <option value="">Seleccione un catálogo</option>
                                    {catalogoPersonas.map(persona => (
                                        <option key={persona.idCatalogo_Persona} value={persona.idCatalogo_Persona}>
                                            {persona.Descripcion_Catalogo_Persona || 'Descripción no disponible'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Número de Teléfono</label>
                                <input
                                    type="text"
                                    placeholder="Número de Teléfono"
                                    value={nuevaPersona.Numero_Telefono}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Numero_Telefono: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Detalle de Teléfono</label>
                                <input
                                    type="text"
                                    placeholder="Detalle de Teléfono"
                                    value={nuevaPersona.Detalle_Telefono}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Detalle_Telefono: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Catálogo de Teléfono</label>
                                <select
                                    value={nuevaPersona.catalogo_telefono_idCatalogo_Telefono}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, catalogo_telefono_idCatalogo_Telefono: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                >
                                    <option value="">Seleccione un catálogo</option>
                                    {catalogoTelefonos.map(telefono => (
                                        <option key={telefono.idCatalogo_Telefono} value={telefono.idCatalogo_Telefono}>
                                            {telefono.Descripcion_Catalogo_Telefono || 'Descripción no disponible'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Dirección Específica</label>
                                <input
                                    type="text"
                                    placeholder="Dirección Específica"
                                    value={nuevaPersona.Direccion_Especifica}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Direccion_Especifica: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Provincia</label>
                                <select
                                    value={nuevaPersona.distrito_canton_provincia_idprovincia}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, distrito_canton_provincia_idprovincia: e.target.value, distrito_canton_idCanton: '', distrito_idDistrito: '' })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                >
                                    <option value="">Seleccione una provincia</option>
                                    {provincias.map(provincia => (
                                        <option key={provincia.idprovincia} value={provincia.idprovincia}>
                                            {provincia.Nombre_Provincia}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Cantón</label>
                                <select
                                    value={nuevaPersona.distrito_canton_idCanton}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, distrito_canton_idCanton: e.target.value, distrito_idDistrito: '' })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                    disabled={!nuevaPersona.distrito_canton_provincia_idprovincia}
                                >
                                    <option value="">Seleccione un cantón</option>
                                    {cantones.map(canton => (
                                        <option key={canton.idCanton} value={canton.idCanton}>
                                            {canton.Nombre_Canton}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Distrito</label>
                                <select
                                    value={nuevaPersona.distrito_idDistrito}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, distrito_idDistrito: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                    disabled={!nuevaPersona.distrito_canton_idCanton}
                                >
                                    <option value="">Seleccione un distrito</option>
                                    {distritos.map(distrito => (
                                        <option key={distrito.idDistrito} value={distrito.idDistrito}>
                                            {distrito.Nombre_Distrito}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Correo Electrónico</label>
                                <input
                                    type="email"
                                    placeholder="Correo Electrónico"
                                    value={nuevaPersona.Descripcion_Correo}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Descripcion_Correo: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Tipo de Correo</label>
                                <select
                                    value={nuevaPersona.catalogo_correo_idCatalogo_Correo}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, catalogo_correo_idCatalogo_Correo: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                >
                                    <option value="">Seleccione un tipo de correo</option>
                                    {catalogosCorreo.map(correo => (
                                        <option key={correo.idCatalogo_Correo} value={correo.idCatalogo_Correo}>
                                            {correo.Tipo_Correo || 'Tipo no disponible'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Fecha de Ingreso</label>
                                <input
                                    type="date"
                                    value={nuevaPersona.Fecha_Ingreso}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Fecha_Ingreso: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Puesto Laboral</label>
                                <select
                                    value={nuevaPersona.puesto_laboral_idpuesto_laboral}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, puesto_laboral_idpuesto_laboral: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                >
                                    <option value="">Seleccione un puesto laboral</option>
                                    {puestosLaborales.map(puesto => (
                                        <option key={puesto.idpuesto_laboral} value={puesto.idpuesto_laboral}>
                                            {puesto.Nombre_Puesto || 'Nombre no disponible'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Tipo de Horario</label>
                                <select
                                    value={nuevaPersona.tipo_horario_idtipo_horario}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, tipo_horario_idtipo_horario: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                >
                                    <option value="">Seleccione un tipo de horario</option>
                                    {tiposHorario.map(horario => (
                                        <option key={horario.idtipo_horario} value={horario.idtipo_horario}>
                                            {horario.Tipo_horario || 'Tipo no disponible'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Nombre de Usuario</label>
                                <input
                                    type="text"
                                    placeholder="Nombre de Usuario"
                                    value={nuevaPersona.Nombre_Usuario}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Nombre_Usuario: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={nuevaPersona.Contrasena}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Contrasena: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Rol</label>
                                <select
                                    value={nuevaPersona.roles_idroles}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, roles_idroles: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                >
                                    <option value="">Seleccione un rol</option>
                                    {roles.map(rol => (
                                        <option key={rol.idroles} value={rol.idroles}>
                                            {rol.Descripcion_Rol || 'Descripción no disponible'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="flex justify-end space-x-4 mt-4">
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
                    <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-xl transition duration-300 ease-in-out w-full max-w-7xl h-screen overflow-y-auto"> {/* Cambiado el max-w a 7xl y añadido h-screen y overflow-y-auto */}
                        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Actualizar Persona</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Cédula</label>
                                <input
                                    type="text"
                                    value={nuevaPersona.idPersona}
                                    disabled
                                    className="border rounded-md p-2 mb-2 w-full bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Nombre</label>
                                <input
                                    type="text"
                                    value={nuevaPersona.Nombre}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Nombre: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Primer Apellido</label>
                                <input
                                    type="text"
                                    value={nuevaPersona.Primer_Apellido}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Primer_Apellido: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Segundo Apellido</label>
                                <input
                                    type="text"
                                    value={nuevaPersona.Segundo_Apellido}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Segundo_Apellido: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    value={nuevaPersona.Fecha_Nacimiento}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Fecha_Nacimiento: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Catálogo de Persona</label>
                                <select
                                    value={nuevaPersona.catalogo_persona_idCatalogo_Persona}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, catalogo_persona_idCatalogo_Persona: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                >
                                    <option value="">Seleccione un catálogo</option>
                                    {catalogoPersonas.length > 0 ? (
                                        catalogoPersonas.map(persona => (
                                            <option key={persona.idCatalogo_Persona} value={persona.idCatalogo_Persona}>
                                                {persona.Descripcion_Catalogo_Persona || 'Descripción no disponible'}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No hay opciones disponibles</option>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Número de Teléfono</label>
                                <input
                                    type="text"
                                    value={nuevaPersona.Numero_Telefono}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Numero_Telefono: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Detalle de Teléfono</label>
                                <input
                                    type="text"
                                    value={nuevaPersona.Detalle_Telefono}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Detalle_Telefono: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Catálogo de Teléfono</label>
                                <select
                                    value={nuevaPersona.catalogo_telefono_idCatalogo_Telefono}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, catalogo_telefono_idCatalogo_Telefono: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                >
                                    <option value="">Seleccione un catálogo</option>
                                    {catalogoTelefonos.length > 0 ? (
                                        catalogoTelefonos.map(telefono => (
                                            <option key={telefono.idCatalogo_Telefono} value={telefono.idCatalogo_Telefono}>
                                                {telefono.Descripcion_Catalogo_Telefono || 'Descripción no disponible'}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No hay opciones disponibles</option>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Dirección Específica</label>
                                <input
                                    type="text"
                                    value={nuevaPersona.Direccion_Especifica}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Direccion_Especifica: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Provincia</label>
                                <select
                                    value={nuevaPersona.distrito_canton_provincia_idprovincia}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, distrito_canton_provincia_idprovincia: e.target.value, distrito_canton_idCanton: '', distrito_idDistrito: '' })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                >
                                    <option value="">Seleccione una provincia</option>
                                    {provincias.map((provincia) => (
                                        <option key={provincia.idprovincia} value={provincia.idprovincia}>
                                            {provincia.Nombre_Provincia}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Cantón</label>
                                <select
                                    value={nuevaPersona.distrito_canton_idCanton}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, distrito_canton_idCanton: e.target.value, distrito_idDistrito: '' })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                    disabled={!nuevaPersona.distrito_canton_provincia_idprovincia}
                                >
                                    <option value="">Seleccione un cantón</option>
                                    {cantones.map((canton) => (
                                        <option key={canton.idCanton} value={canton.idCanton}>
                                            {canton.Nombre_Canton}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Distrito</label>
                                <select
                                    value={nuevaPersona.distrito_idDistrito}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, distrito_idDistrito: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                    disabled={!nuevaPersona.distrito_canton_idCanton}
                                >
                                    <option value="">Seleccione un distrito</option>
                                    {distritos.map((distrito) => (
                                        <option key={distrito.idDistrito} value={distrito.idDistrito}>
                                            {distrito.Nombre_Distrito}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Correo Electrónico</label>
                                <input
                                    type="email"
                                    value={nuevaPersona.Descripcion_Correo}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Descripcion_Correo: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Tipo de Correo</label>
                                <select
                                    value={nuevaPersona.catalogo_correo_idCatalogo_Correo}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, catalogo_correo_idCatalogo_Correo: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                >
                                    <option value="">Seleccione un tipo de correo</option>
                                    {catalogosCorreo.length > 0 ? (
                                        catalogosCorreo.map(correo => (
                                            <option key={correo.idCatalogo_Correo} value={correo.idCatalogo_Correo}>
                                                {correo.Tipo_Correo || 'Tipo no disponible'}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No hay tipos de correo disponibles</option>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Fecha de Ingreso</label>
                                <input
                                    type="date"
                                    value={nuevaPersona.Fecha_Ingreso}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Fecha_Ingreso: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Puesto Laboral</label>
                                <select
                                    value={nuevaPersona.puesto_laboral_idpuesto_laboral}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, puesto_laboral_idpuesto_laboral: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                >
                                    <option value="">Seleccione un puesto laboral</option>
                                    {puestosLaborales.length > 0 ? (
                                        puestosLaborales.map(puesto => (
                                            <option key={puesto.idpuesto_laboral} value={puesto.idpuesto_laboral}>
                                                {puesto.Nombre_Puesto || 'Nombre no disponible'}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No hay puestos disponibles</option>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Tipo de Horario</label>
                                <select
                                    value={nuevaPersona.tipo_horario_idtipo_horario}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, tipo_horario_idtipo_horario: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                >
                                    <option value="">Seleccione un tipo de horario</option>
                                    {tiposHorario.length > 0 ? (
                                        tiposHorario.map(horario => (
                                            <option key={horario.idtipo_horario} value={horario.idtipo_horario}>
                                                {horario.Tipo_horario || 'Tipo no disponible'}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No hay tipos de horario disponibles</option>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Nombre de Usuario</label>
                                <input
                                    type="text"
                                    value={nuevaPersona.Nombre_Usuario}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Nombre_Usuario: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Contraseña</label>
                                <input
                                    type="password"
                                    value={nuevaPersona.Contrasena}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, Contrasena: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-black dark:text-white mb-2 block">Rol</label>
                                <select
                                    value={nuevaPersona.roles_idroles}
                                    onChange={(e) => setNuevaPersona({ ...nuevaPersona, roles_idroles: e.target.value })}
                                    className="border rounded-md p-2 mb-2 w-full"
                                >
                                    <option value="">Seleccione un rol</option>
                                    {roles.length > 0 ? (
                                        roles.map(rol => (
                                            <option key={rol.idroles} value={rol.idroles}>
                                                {rol.Descripcion_Rol || 'Descripción no disponible'}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No hay roles disponibles</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => setModalActualizar(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={actualizarPersona}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
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

export default GestionUsuarios;

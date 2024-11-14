import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EvaluacionesRendimiento = () => {
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [fechasEvaluacion, setFechasEvaluacion] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        idEmpleado_Evaluador: '',
        idEmpleado_Evaluado: '',
        Fecha_evaluacion: '',
        Puntuaje_Productividad: '',
        Puntuaje_Puntualidad: '',
        Puntuaje_Colaboracion: '',
        Puntuaje_Adaptabilidad: '',
        Comentarios: ''
    });
    const [deleteData, setDeleteData] = useState({
        idEmpleado_Evaluador: '',
        idEmpleado_Evaluado: '',
        Fecha_evaluacion: ''
    });
    const [error, setError] = useState('');

    // Obtener todas las evaluaciones de rendimiento
    const obtenerEvaluaciones = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/evaluaciones-rendimiento');
            setEvaluaciones(response.data);

            // Obtener las fechas únicas de evaluación
            const fechasUnicas = [...new Set(response.data.map(evaluacion => evaluacion.Fecha_evaluacion))];
            setFechasEvaluacion(fechasUnicas);
        } catch (error) {
            console.error('Error al obtener las evaluaciones de rendimiento:', error);
            setError('Error al cargar las evaluaciones.');
        }
    };

    // Obtener lista de empleados (similar a Permisos.js)
    const obtenerEmpleados = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/empleados/nombre-completo');
            setEmpleados(response.data[0]);
        } catch (error) {
            console.error('Error al obtener empleados:', error);
            setError('Error al cargar empleados.');
        }
    };

    useEffect(() => {
        obtenerEvaluaciones();
        obtenerEmpleados();
    }, []);

    // Manejo del formulario para crear evaluación
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Manejo del formulario para eliminar evaluación
    const handleDeleteChange = (e) => {
        setDeleteData({ ...deleteData, [e.target.name]: e.target.value });
    };

    // Enviar datos para crear evaluación
    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:3000/api/evaluaciones-rendimiento', formData);
            setShowModal(false);
            obtenerEvaluaciones(); // Actualizar las evaluaciones
        } catch (error) {
            console.error('Error al registrar la evaluación:', error);
            setError('Error al registrar la evaluación.');
        }
    };

    // Enviar datos para eliminar evaluación
    const handleDelete = async () => {
        try {
            // Asegurarse de que la fecha esté en el formato correcto antes de enviarla
            const formattedDate = new Date(deleteData.Fecha_evaluacion).toISOString().split('T')[0];

            await axios.delete('http://localhost:3000/api/evaluaciones-rendimiento', {
                data: {
                    ...deleteData,
                    Fecha_evaluacion: formattedDate  // Usar solo la fecha sin la hora 
                }
            });

            setShowDeleteModal(false);
            obtenerEvaluaciones(); // Actualizar las evaluaciones
        } catch (error) {
            console.error('Error al eliminar la evaluación:', error);
            setError('Error al eliminar la evaluación.');
        }
    };


    // Filtrar las evaluaciones por cada tipo
    const evaluacionesPorTipo = (tipo) => {
        return evaluaciones.filter(evaluacion => evaluacion.descripcion_evaluacion === tipo);
    };

    return (
        <div className="p-6 bg-[#EEEEEE] dark:bg-[#222831] min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-[#393E46] dark:text-[#EEEEEE] text-center">Evaluaciones de Rendimiento</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Botones de Acción */}
            <div className="text-center mb-6 flex justify-center space-x-4">
                <button
                    className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={() => setShowModal(true)}
                >
                    Evaluar Rendimiento
                </button>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={() => setShowDeleteModal(true)}
                >
                    Eliminar Evaluación
                </button>
            </div>

            {/* Modal para Evaluar Rendimiento */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white dark:bg-[#2D2D3B] rounded-lg shadow-lg p-6 w-full max-w-lg animate-scale-up">
                        <h2 className="text-lg font-semibold mb-4 text-[#393E46] dark:text-[#EEEEEE]">Evaluar Rendimiento</h2>
                        <form>
                            {/* Selección de Evaluador */}
                            <div className="mb-4">
                                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Seleccionar Evaluador</label>
                                <select
                                    name="idEmpleado_Evaluador"
                                    className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#3A3A4D] text-[#393E46] dark:text-[#EEEEEE]"
                                    value={formData.idEmpleado_Evaluador}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione un evaluador</option>
                                    {empleados.map((empleado) => (
                                        <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                                            {empleado.NombreCompleto}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Selección de Evaluado */}
                            <div className="mb-4">
                                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Seleccionar Evaluado</label>
                                <select
                                    name="idEmpleado_Evaluado"
                                    className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#3A3A4D] text-[#393E46] dark:text-[#EEEEEE]"
                                    value={formData.idEmpleado_Evaluado}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione un evaluado</option>
                                    {empleados.map((empleado) => (
                                        <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                                            {empleado.NombreCompleto}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Fecha de Evaluación */}
                            <div className="mb-4">
                                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Fecha de Evaluación</label>
                                <input
                                    type="date"
                                    name="Fecha_evaluacion"
                                    className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#3A3A4D] text-[#393E46] dark:text-[#EEEEEE]"
                                    value={formData.Fecha_evaluacion}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Puntajes */}
                            {['Puntuaje_Productividad', 'Puntuaje_Puntualidad', 'Puntuaje_Colaboracion', 'Puntuaje_Adaptabilidad'].map((campo, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">
                                        {campo.replace('Puntuaje_', 'Puntaje ')}
                                    </label>
                                    <input
                                        type="number"
                                        name={campo}
                                        className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#3A3A4D] text-[#393E46] dark:text-[#EEEEEE]"
                                        value={formData[campo]}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                            ))}

                            {/* Comentarios */}
                            <div className="mb-4">
                                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Comentarios</label>
                                <textarea
                                    name="Comentarios"
                                    className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#3A3A4D] text-[#393E46] dark:text-[#EEEEEE]"
                                    value={formData.Comentarios}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex justify-end mt-4 space-x-4">
                                <button
                                    type="button"
                                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={handleSubmit}
                                >
                                    Guardar Evaluación
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Modal para Eliminar Evaluación */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white dark:bg-[#2D2D3B] rounded-lg shadow-lg p-6 w-full max-w-lg animate-scale-up">
                        <h2 className="text-lg font-semibold mb-4 text-[#393E46] dark:text-[#EEEEEE]">Eliminar Evaluación</h2>
                        <form>
                            {/* Selección de Fecha de Evaluación */}
                            <div className="mb-4">
                                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Fecha de Evaluación</label>
                                <select
                                    name="Fecha_evaluacion"
                                    className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#3A3A4D] text-[#393E46] dark:text-[#EEEEEE]"
                                    value={deleteData.Fecha_evaluacion}
                                    onChange={handleDeleteChange}
                                >
                                    <option value="">Seleccione una fecha</option>
                                    {fechasEvaluacion.map((fecha, index) => (
                                        <option key={index} value={fecha}>
                                            {new Date(fecha).toISOString().split('T')[0]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Selección de Evaluador */}
                            <div className="mb-4">
                                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Seleccionar Evaluador</label>
                                <select
                                    name="idEmpleado_Evaluador"
                                    className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#3A3A4D] text-[#393E46] dark:text-[#EEEEEE]"
                                    value={deleteData.idEmpleado_Evaluador}
                                    onChange={handleDeleteChange}
                                >
                                    <option value="">Seleccione un evaluador</option>
                                    {empleados.map((empleado) => (
                                        <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                                            {empleado.NombreCompleto}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Selección de Evaluado */}
                            <div className="mb-4">
                                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Seleccionar Evaluado</label>
                                <select
                                    name="idEmpleado_Evaluado"
                                    className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#3A3A4D] text-[#393E46] dark:text-[#EEEEEE]"
                                    value={deleteData.idEmpleado_Evaluado}
                                    onChange={handleDeleteChange}
                                >
                                    <option value="">Seleccione un evaluado</option>
                                    {empleados.map((empleado) => (
                                        <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                                            {empleado.NombreCompleto}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex justify-end mt-4 space-x-4">
                                <button
                                    type="button"
                                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={handleDelete}
                                >
                                    Eliminar Evaluación
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Tablas de Evaluaciones */}
            {['Productividad', 'Puntualidad y Asistencia', 'Colaboración y Trabajo en Equipo', 'Adaptabilidad y Resolución de Problemas'].map((tipo) => (
                <div key={tipo} className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-[#393E46] dark:text-[#EEEEEE] text-center">{tipo}</h2>
                    <div className="overflow-hidden rounded-lg shadow-lg mb-6 animate-scale-up">
                        <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
                            <thead className="bg-[#00ADB5]">
                                <tr>
                                    <th className="px-4 py-2 text-white text-center">Fecha de Evaluación</th>
                                    <th className="px-4 py-2 text-white text-center">ID Evaluado</th>
                                    <th className="px-4 py-2 text-white text-center">Evaluado</th>
                                    <th className="px-4 py-2 text-white text-center">ID Evaluador</th>
                                    <th className="px-4 py-2 text-white text-center">Evaluador</th>
                                    <th className="px-4 py-2 text-white text-center">Puntuaje</th>
                                    <th className="px-4 py-2 text-white text-center">Comentarios</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evaluacionesPorTipo(tipo).map((evaluacion) => (
                                    <tr
                                        key={`${evaluacion.Fecha_evaluacion}-${evaluacion.idEmpleado_Evaluado}-${evaluacion.idEmpleado_Evaluador}`}
                                        className="border-b hover:bg-[#EEEEEE] dark:hover:bg-[#393E46] transition-all duration-200"
                                    >
                                        <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">
                                            {new Date(evaluacion.Fecha_evaluacion).toISOString().split('T')[0]}
                                        </td>
                                        <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{evaluacion.idEmpleado_Evaluado}</td>
                                        <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{evaluacion.Evaluado}</td>
                                        <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{evaluacion.idEmpleado_Evaluador}</td>
                                        <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{evaluacion.Evaluador}</td>
                                        <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{evaluacion.Puntuaje}</td>
                                        <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{evaluacion.Comentarios}</td>
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MarcaTiempoEmpleados = () => {
    const [marcas, setMarcas] = useState([]);
    const [errorModal, setErrorModal] = useState({ visible: false, message: '' });
    const [empleados, setEmpleados] = useState([]);
    const [formData, setFormData] = useState({
        idEmpleado: '',
        Fecha: '',
        Hora: ''
    });
    const [showJustificarEntrada, setShowJustificarEntrada] = useState(false);
    const [showJustificarSalida, setShowJustificarSalida] = useState(false);
    const [justificacionData, setJustificacionData] = useState({
        idEmpleado: '',
        Fecha: '',
        Motivo: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // Fetch attendance records for the specific user
    const obtenerMarcasPorUsuario = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const idUsuario = user ? user.idusuarios : null;

            if (idUsuario) {
                const response = await axios.get(`http://localhost:3000/api/marcas/marcas-persona/${idUsuario}`);
                const sortedMarcas = response.data[0].sort((a, b) => new Date(b.Fecha_Marca) - new Date(a.Fecha_Marca));
                setMarcas(sortedMarcas);
            } else {
                console.error('Usuario no encontrado en el local storage');
            }
        } catch (error) {
            console.error('Error al obtener las marcas de tiempo:', error);
        }
    };

    const obtenerEmpleadoPorUsuario = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const idusuario = user ? user.idusuarios : null;

            if (idusuario) {
                const response = await axios.get(`http://localhost:3000/api/empleados/usuario/${idusuario}`);
                setEmpleados([response.data]);
                setFormData((prevData) => ({
                    ...prevData,
                    idEmpleado: response.data.idEmpleado,
                }));
            } else {
                console.error('Usuario no encontrado en el local storage');
            }
        } catch (error) {
            console.error('Error al obtener el empleado:', error);
        }
    };

    const setAutomaticDateTime = () => {
        const currentDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Costa_Rica'
        }).format(new Date());
        
        const currentTime = new Date().toLocaleTimeString('en-GB', {
            timeZone: 'America/Costa_Rica',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        setFormData((prevData) => ({
            ...prevData,
            Fecha: currentDate,
            Hora: currentTime
        }));
    };

    useEffect(() => {
        obtenerMarcasPorUsuario();
        obtenerEmpleadoPorUsuario();
        setAutomaticDateTime();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleJustificacionChange = (e) => {
        setJustificacionData({
            ...justificacionData,
            [e.target.name]: e.target.value
        });
    };

    const registrarMarcaInicio = async () => {
        try {
            await axios.post('http://localhost:3000/api/marcas/inicio', formData);
            alert('Marca de inicio registrada exitosamente');
            obtenerMarcasPorUsuario();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorModal({ visible: true, message: error.response.data.error });
            } else {
                console.error('Error al registrar la marca de inicio:', error);
                setErrorModal({ visible: true, message: 'Error al registrar la marca de inicio' });
            }
        }
    };

    const registrarMarcaSalida = async () => {
        try {
            await axios.post('http://localhost:3000/api/marcas/salida', formData);
            alert('Marca de salida registrada exitosamente');
            obtenerMarcasPorUsuario();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorModal({ visible: true, message: error.response.data.error });
            } else {
                console.error('Error al registrar la marca de salida:', error);
                setErrorModal({ visible: true, message: 'Error al registrar la marca de salida' });
            }
        }
    };

    const justificarEntrada = async () => {
        try {
            await axios.post('http://localhost:3000/api/marcas/justificar-entrada', justificacionData);
            alert('Justificación de entrada registrada exitosamente');
            setShowJustificarEntrada(false);
            obtenerMarcasPorUsuario();
        } catch (error) {
            console.error('Error al justificar la entrada:', error);
        }
    };

    const justificarSalida = async () => {
        try {
            await axios.post('http://localhost:3000/api/marcas/justificar-salida', justificacionData);
            alert('Justificación de salida registrada exitosamente');
            setShowJustificarSalida(false);
            obtenerMarcasPorUsuario();
        } catch (error) {
            console.error('Error al justificar la salida:', error);
        }
    };

    const cancelarJustificacion = () => {
        setShowJustificarEntrada(false);
        setShowJustificarSalida(false);
        setJustificacionData({ idEmpleado: '', Fecha: '', Motivo: '' });
    };

    const lastRecordIndex = currentPage * recordsPerPage;
    const firstRecordIndex = lastRecordIndex - recordsPerPage;
    const currentRecords = marcas.slice(firstRecordIndex, lastRecordIndex);
    const totalPages = Math.ceil(marcas.length / recordsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Control de Asistencia</h1>

            <div className="flex justify-center space-x-4 mb-6">
                {/* Hora Entrada Form */}
                <div>
                    <h2 className="text-lg font-semibold mb-2">Registrar Hora de Entrada</h2>
                    <select
                        name="idEmpleado"
                        value={formData.idEmpleado}
                        onChange={(e) => {
                            handleInputChange(e);
                            setAutomaticDateTime();
                        }}
                        className="border rounded-lg w-full px-3 py-2 mb-2"
                    >
                        <option value="">Seleccionar Empleador</option>
                        {empleados.map((empleado) => (
                            <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                                {empleado.NombreCompleto}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        name="Fecha"
                        value={formData.Fecha}
                        onChange={handleInputChange}
                        className="border rounded-lg w-full px-3 py-2 mb-2"
                        disabled
                    />
                    <input
                        type="time"
                        name="Hora"
                        value={formData.Hora}
                        onChange={handleInputChange}
                        className="border rounded-lg w-full px-3 py-2 mb-4"
                        disabled
                    />
                    <button
                        onClick={registrarMarcaInicio}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md w-full"
                    >
                        Hora Entrada
                    </button>
                </div>

                {/* Hora Salida Form */}
                <div>
                    <h2 className="text-lg font-semibold mb-2">Registrar Hora de Salida</h2>
                    <select
                        name="idEmpleado"
                        value={formData.idEmpleado}
                        onChange={(e) => {
                            handleInputChange(e);
                            setAutomaticDateTime();
                        }}
                        className="border rounded-lg w-full px-3 py-2 mb-2"
                    >
                        <option value="">Seleccionar Empleador</option>
                        {empleados.map((empleado) => (
                            <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                                {empleado.NombreCompleto}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        name="Fecha"
                        value={formData.Fecha}
                        onChange={handleInputChange}
                        className="border rounded-lg w-full px-3 py-2 mb-2"
                        disabled
                    />
                    <input
                        type="time"
                        name="Hora"
                        value={formData.Hora}
                        onChange={handleInputChange}
                        className="border rounded-lg w-full px-3 py-2 mb-4"
                        disabled
                    />
                    <button
                        onClick={registrarMarcaSalida}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md w-full"
                    >
                        Hora Salida
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg shadow-lg mb-6">
                <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
                    <thead className="bg-gray-100 dark:bg-[#3A3A4D] border-b">
                        <tr>
                            <th className="px-4 py-2 text-black dark:text-white text-center">ID Empleado</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Persona</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Movimiento</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Marca</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Marca Hora</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Tardía/Salida Anticipada</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Justificada</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Motivo Justificación</th>
                            <th className="px-4 py-2 text-black dark:text-white text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map((marca, index) => (
                            <tr key={index} className="border-b dark:border-[#4D4D61]">
                                <td className="px-4 py-2 text-black dark:text-white text-center">{marca.idEmpleado}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{marca.Persona}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{marca.Movimiento}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(marca.Fecha_Marca).toLocaleDateString()}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">{marca.Marca_Hora}</td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">
                                    {marca.Tardia?.data?.[0] === 1 ? 'Sí' : 'No'}
                                </td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">
                                    {marca.Justificada?.data?.[0] === 1 ? 'Sí' : 'No'}
                                </td>
                                <td className="px-4 py-2 text-black dark:text-white text-center">
                                    {marca.Motivo_Justificacion ? marca.Motivo_Justificacion : "No necesario"}
                                </td>
                                <td className="px-4 py-2 flex justify-center space-x-2">
                                    <button
                                        onClick={() => {
                                            setJustificacionData({
                                                idEmpleado: marca.idEmpleado,
                                                Fecha: new Date(marca.Fecha_Marca).toISOString().split('T')[0],
                                                Motivo: ''
                                            });
                                            setShowJustificarEntrada(true);
                                        }}
                                        disabled={marca.Tardia?.data?.[0] === 0}
                                        className={`bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg shadow-md ${marca.Tardia?.data?.[0] === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Justificar Entrada
                                    </button>
                                    <button
                                        onClick={() => {
                                            setJustificacionData({
                                                idEmpleado: marca.idEmpleado,
                                                Fecha: new Date(marca.Fecha_Marca).toISOString().split('T')[0],
                                                Motivo: ''
                                            });
                                            setShowJustificarSalida(true);
                                        }}
                                        disabled={marca.Tardia?.data?.[0] === 0}
                                        className={`bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-lg shadow-md ${marca.Tardia?.data?.[0] === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Justificar Salida
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {errorModal.visible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg max-w-md mx-auto text-center">
                        <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
                        <p className="text-gray-700 dark:text-white">{errorModal.message}</p>
                        <button
                            onClick={() => setErrorModal({ visible: false, message: '' })}
                            className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* Modals for Justifications */}
            {showJustificarEntrada && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg max-w-md mx-auto">
                        <h2 className="text-xl font-bold mb-4">Justificar Entrada</h2>
                        <textarea
                            name="Motivo"
                            value={justificacionData.Motivo}
                            onChange={handleJustificacionChange}
                            className="border rounded-lg w-full px-3 py-2 mb-4"
                            placeholder="Escriba la justificación"
                        />
                        <button
                            onClick={justificarEntrada}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md w-full mb-2"
                        >
                            Justificar Entrada
                        </button>
                        <button
                            onClick={cancelarJustificacion}
                            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md w-full"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {showJustificarSalida && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg max-w-md mx-auto">
                        <h2 className="text-xl font-bold mb-4">Justificar Salida</h2>
                        <textarea
                            name="Motivo"
                            value={justificacionData.Motivo}
                            onChange={handleJustificacionChange}
                            className="border rounded-lg w-full px-3 py-2 mb-4"
                            placeholder="Escriba la justificación"
                        />
                        <button
                            onClick={justificarSalida}
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md w-full mb-2"
                        >
                            Justificar Salida
                        </button>
                        <button
                            onClick={cancelarJustificacion}
                            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md w-full"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Pagination controls */}
            <div className="flex justify-center space-x-4 mt-4">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded-lg shadow-md disabled:opacity-50"
                >
                    Anterior
                </button>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded-lg shadow-md disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default MarcaTiempoEmpleados;
    
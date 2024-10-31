import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';

const Aguinaldo = () => {
  const [aguinaldos, setAguinaldos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [catalogoAguinaldo, setCatalogoAguinaldo] = useState([]);
  const [formData, setFormData] = useState({
    idEmpleado: '',
    fechaInicio: '',
    fechaFin: '',
    fechaAguinaldo: '',
    idCatalogoAguinaldo: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const recordsPerPage = 10;

  // Fetch all registered aguinaldos
  const obtenerAguinaldos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/aguinaldo/reporte');
      setAguinaldos(response.data[0]);
    } catch (error) {
      console.error('Error al obtener el reporte de aguinaldos:', error);
    }
  };

  // Fetch employees for dropdown
  const obtenerEmpleados = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/empleados'); // Cambiar a la ruta correcta de empleados
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al obtener la lista de empleados:', error);
    }
  };

  // Fetch aguinaldo catalog
  const obtenerCatalogoAguinaldo = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/aguinaldo/catalogo');
      setCatalogoAguinaldo(response.data[0]);
    } catch (error) {
      console.error('Error al obtener el catálogo de aguinaldo:', error);
    }
  };

  useEffect(() => {
    obtenerAguinaldos();
    obtenerEmpleados();
    obtenerCatalogoAguinaldo();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Register and calculate aguinaldo
  const calcularYRegistrarAguinaldo = async () => {
    try {
      await axios.post('http://localhost:3000/api/aguinaldo/calcular', formData);
      alert('Aguinaldo calculado y registrado exitosamente');
      obtenerAguinaldos();
      setIsModalOpen(false); // Cierra el modal después de registrar
    } catch (error) {
      console.error('Error al calcular y registrar el aguinaldo:', error);
    }
  };

  // Función para formatear la fecha a YYYY-MM-DD
  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  // Función para eliminar un aguinaldo
  const eliminarAguinaldo = async (idEmpleado, fechaAguinaldo) => {
    try {
      await axios.delete('http://localhost:3000/api/aguinaldo/eliminar', {
        data: {
          idEmpleado,
          fechaAguinaldo: formatDate(fechaAguinaldo)  // Formatear la fecha antes de enviarla
        }
      });
      alert('Aguinaldo eliminado exitosamente');
      obtenerAguinaldos();
    } catch (error) {
      console.error('Error al eliminar el aguinaldo:', error);
    }
  };


  // Pagination handling
  const lastRecordIndex = currentPage * recordsPerPage;
  const firstRecordIndex = lastRecordIndex - recordsPerPage;
  const currentRecords = aguinaldos.slice(firstRecordIndex, lastRecordIndex);
  const totalPages = Math.ceil(aguinaldos.length / recordsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Gestión de Aguinaldo</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md mb-6"
      >
        Crear Aguinaldo
      </button>

      {/* Modal para crear un nuevo aguinaldo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Calcular y Registrar Aguinaldo</h2>

            {/* Dropdown para seleccionar empleado */}
            <select
              name="idEmpleado"
              value={formData.idEmpleado}
              onChange={handleInputChange}
              className="border rounded-lg w-full px-3 py-2 mb-2"
            >
              <option value="">Seleccionar Empleado</option>
              {empleados.map((empleado) => (
                <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                  {`${empleado.Nombre} ${empleado.Primer_Apellido} ${empleado.Segundo_Apellido}`}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleInputChange}
              className="border rounded-lg w-full px-3 py-2 mb-2"
            />
            <input
              type="date"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={handleInputChange}
              className="border rounded-lg w-full px-3 py-2 mb-2"
            />
            <input
              type="date"
              name="fechaAguinaldo"
              value={formData.fechaAguinaldo}
              onChange={handleInputChange}
              className="border rounded-lg w-full px-3 py-2 mb-2"
            />

            {/* Dropdown para seleccionar tipo de aguinaldo */}
            <select
              name="idCatalogoAguinaldo"
              value={formData.idCatalogoAguinaldo}
              onChange={handleInputChange}
              className="border rounded-lg w-full px-3 py-2 mb-4"
            >
              <option value="">Seleccionar Tipo de Aguinaldo</option>
              {catalogoAguinaldo.map((item) => (
                <option key={item.idcatalogo_aguinaldo} value={item.idcatalogo_aguinaldo}>
                  {item.Descripcion_aguinaldo}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={calcularYRegistrarAguinaldo}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Calcular Aguinaldo
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg shadow-lg mb-6">
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
              <th className="px-4 py-2 text-black dark:text-white text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((aguinaldo, index) => (
              <tr key={index} className="border-b dark:border-[#4D4D61]">
                <td className="px-4 py-2 text-black dark:text-white text-center">{aguinaldo.idEmpleado}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{aguinaldo.Nombre_Empleado}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{formatDate(aguinaldo.Fecha_Aguinaldo)}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{formatDate(aguinaldo.Fecha_Inicial_Cobro)}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{formatDate(aguinaldo.Fecha_Final_Cobro)}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{aguinaldo.Monto_Aguinaldo}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{aguinaldo.Tipo_Aguinaldo}</td>
                <td className="px-4 py-2 flex justify-center space-x-2">
                  <button
                    onClick={() => eliminarAguinaldo(aguinaldo.idEmpleado, aguinaldo.Fecha_Aguinaldo)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

export default Aguinaldo;

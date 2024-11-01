import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';

const Aguinaldo = () => {
  const [aguinaldos, setAguinaldos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [catalogoAguinaldo, setCatalogoAguinaldo] = useState([]);
  const [formData, setFormData] = useState({
    idEmpleado: '',
    fechaAguinaldo: '',
    idCatalogoAguinaldo: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obtener aguinaldos
  const obtenerAguinaldos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/aguinaldo/reporte');
      setAguinaldos(response.data[0]);
    } catch (error) {
      console.error('Error al obtener el reporte de aguinaldos:', error);
    }
  };

  // Obtener empleados para el dropdown
  const obtenerEmpleados = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/empleados/nombre-completo');
      setEmpleados(response.data[0]);
    } catch (error) {
      console.error('Error al obtener la lista de empleados:', error);
    }
  };

  // Obtener catálogo de tipos de aguinaldo
  const obtenerCatalogoAguinaldo = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/aguinaldo/catalogo');
      setCatalogoAguinaldo(response.data[0]); // Cambiado a response.data[0]
    } catch (error) {
      console.error('Error al obtener el catálogo de aguinaldo:', error);
    }
  };

  useEffect(() => {
    obtenerAguinaldos();
    obtenerEmpleados();
    obtenerCatalogoAguinaldo();
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Registrar y calcular aguinaldo
  const calcularYRegistrarAguinaldo = async () => {
    console.log("Formulario de Aguinaldo:", formData);  // Verifica que idCatalogoAguinaldo no sea null aquí
    try {
      await axios.post('http://localhost:3000/api/aguinaldo/calcular', formData);
      alert('Aguinaldo calculado y registrado exitosamente');
      obtenerAguinaldos();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al calcular y registrar el aguinaldo:', error);
    }
  };

  // Función para eliminar un aguinaldo
const eliminarAguinaldo = async (idEmpleado, fechaAguinaldo) => {
  // Formatear fecha
  const fechaFormateada = new Date(fechaAguinaldo).toISOString().split('T')[0];
  try {
      await axios.delete(`http://localhost:3000/api/aguinaldo/eliminar`, {
          data: { idEmpleado, fechaAguinaldo: fechaFormateada } // Usar la fecha formateada
      });
      alert('Aguinaldo eliminado exitosamente');
      obtenerAguinaldos();
  } catch (error) {
      console.error('Error al eliminar el aguinaldo:', error);
  }
};



  return (
    <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Gestión de Aguinaldo</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 shadow-md transition duration-300 ease-in-out transform hover:scale-105 mx-auto block"
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
                  {empleado.NombreCompleto}
                </option>
              ))}
            </select>

            {/* Fecha de Aguinaldo */}
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
                Crear Aguinaldo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla para mostrar los aguinaldos */}
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
            {aguinaldos.map((aguinaldo, index) => (
              <tr key={index} className="border-b dark:border-[#4D4D61]">
              <td className="px-4 py-2 text-black dark:text-white text-center">{aguinaldo.idEmpleado}</td>
              <td className="px-4 py-2 text-black dark:text-white text-center">{aguinaldo.Nombre_Empleado}</td>
              <td className="px-4 py-2 text-black dark:text-white text-center">
                {new Date(aguinaldo.Fecha_Aguinaldo).toISOString().split('T')[0]} {/* Fecha formateada */}
              </td>
              <td className="px-4 py-2 text-black dark:text-white text-center">
                {new Date(aguinaldo.Fecha_Inicial_Cobro).toISOString().split('T')[0]}
              </td>
              <td className="px-4 py-2 text-black dark:text-white text-center">
                {new Date(aguinaldo.Fecha_Final_Cobro).toISOString().split('T')[0]}
              </td>
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
    </div>
  );
};

export default Aguinaldo;

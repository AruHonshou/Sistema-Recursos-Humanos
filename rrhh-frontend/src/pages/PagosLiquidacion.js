import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Liquidacion = () => {
  const [errorModal, setErrorModal] = useState({ visible: false, message: '' });
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [tipoLiquidaciones, setTipoLiquidaciones] = useState([]);
  const [modalCrear, setModalCrear] = useState(false);
  const [nuevaLiquidacion, setNuevaLiquidacion] = useState({
    idEmpleado: '',
    fechaLiquidacion: '',
    tipoLiquidacion: ''
  });

  // Obtener todas las liquidaciones completas
  const obtenerLiquidaciones = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/liquidaciones/completas');
      setLiquidaciones(response.data[0]);
    } catch (error) {
      console.error('Error al obtener las liquidaciones:', error);
    }
  };

  // Obtener empleados
  const obtenerEmpleados = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/empleados/nombre-completo');
      setEmpleados(response.data[0]);
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }
  };

  // Obtener tipos de liquidación
  const obtenerTipoLiquidaciones = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/tipo-liquidacion');
      setTipoLiquidaciones(response.data[0]);
    } catch (error) {
      console.error('Error al obtener los tipos de liquidación:', error);
    }
  };

  const crearLiquidacion = async () => {
    try {
      await axios.post('http://localhost:3000/api/liquidaciones/calcular', nuevaLiquidacion);
      setModalCrear(false);
      obtenerLiquidaciones();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorModal({ visible: true, message: error.response.data.error });
      } else {
        console.error('Error al crear la liquidación:', error);
        setErrorModal({ visible: true, message: 'Error al crear la liquidación' });
      }
    }
  };



  const eliminarLiquidacion = async (idEmpleado, fechaLiquidacion) => {
    const confirmacion = await Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/liquidaciones/eliminar/${idEmpleado}/${fechaLiquidacion}`);
        Swal.fire('Eliminado', 'La liquidación ha sido eliminada.', 'success');
        obtenerLiquidaciones();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la liquidación.', 'error');
      }
    }
  };

  useEffect(() => {
    obtenerLiquidaciones();
    obtenerEmpleados();
    obtenerTipoLiquidaciones();
  }, []);

  return (
    <div className="p-6 bg-[#EEEEEE] dark:bg-[#222831] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-[#393E46] dark:text-[#EEEEEE] text-center">Gestión de Liquidaciones</h1>

      {/* Botón para Crear Nueva Liquidación */}
      <button
        onClick={() => setModalCrear(true)}
        className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg mb-4 shadow-md transition duration-300 ease-in-out transform hover:scale-105 mx-auto block"
      >
        + Nueva Liquidación
      </button>

      {/* Tabla de Liquidaciones */}
      <div className="overflow-hidden rounded-lg shadow-lg mb-6 animate-scale-up">
        <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
          <thead className="bg-[#00ADB5]">
            <tr>
              <th className="px-4 py-2 text-white text-center">ID Empleado</th>
              <th className="px-4 py-2 text-white text-center">Persona</th>
              <th className="px-4 py-2 text-white text-center">Fecha Liquidación</th>
              <th className="px-4 py-2 text-white text-center">Preaviso</th>
              <th className="px-4 py-2 text-white text-center">Días Preaviso</th>
              <th className="px-4 py-2 text-white text-center">Monto Total Preaviso</th>
              <th className="px-4 py-2 text-white text-center">Monto Total Liquidación</th>
              <th className="px-4 py-2 text-white text-center">Monto Cesantía</th>
              <th className="px-4 py-2 text-white text-center">Monto Vacaciones</th>
              <th className="px-4 py-2 text-white text-center">Monto Aguinaldo</th>
              <th className="px-4 py-2 text-white text-center">Tipo Liquidación</th>
              <th className="px-4 py-2 text-white text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {liquidaciones.map((liquidacion) => (
              <tr key={`${liquidacion.Fecha_Liquidacion}-${liquidacion.empleados_idEmpleado}`} className="border-b hover:bg-[#EEEEEE] dark:hover:bg-[#393E46] transition-all duration-200">
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{liquidacion.empleados_idEmpleado}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{liquidacion.Persona}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{new Date(liquidacion.Fecha_Liquidacion).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{liquidacion.Preaviso ? 'Sí' : 'No'}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{liquidacion.Dias_Preaviso}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">₡{liquidacion.Monto_Total_Preaviso.toLocaleString()}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">₡{liquidacion.Monto_Total_Liquidacion.toLocaleString()}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">₡{liquidacion.Monto_Total_Cesantia.toLocaleString()}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">₡{liquidacion.Monto_Total_Vacaciones.toLocaleString()}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">₡{liquidacion.Monto_Total_Aguinaldo.toLocaleString()}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{liquidacion.tipo_liquidacion}</td>
                <td className="px-4 py-2 flex justify-center space-x-2">
                  <button
                    onClick={() => eliminarLiquidacion(liquidacion.empleados_idEmpleado, liquidacion.Fecha_Liquidacion)}
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



      {/* Modal Crear */}
      {modalCrear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg max-w-md w-full animate-scale-up">
            <h2 className="text-lg font-semibold mb-4 text-[#393E46] dark:text-[#EEEEEE]">Crear Nueva Liquidación</h2>
            <form>
              {/* Selección de Empleado */}
              <div className="mb-4">
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Empleado:</label>
                <select
                  value={nuevaLiquidacion.idEmpleado}
                  onChange={(e) => setNuevaLiquidacion({ ...nuevaLiquidacion, idEmpleado: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#3A3A4D] text-[#393E46] dark:text-[#EEEEEE]"
                >
                  <option value="">Seleccione un Empleado</option>
                  {empleados.map((empleado) => (
                    <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                      {empleado.NombreCompleto}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha de Liquidación */}
              <div className="mb-4">
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Fecha de Liquidación:</label>
                <input
                  type="date"
                  value={nuevaLiquidacion.fechaLiquidacion}
                  onChange={(e) => setNuevaLiquidacion({ ...nuevaLiquidacion, fechaLiquidacion: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#3A3A4D] text-[#393E46] dark:text-[#EEEEEE]"
                />
              </div>

              {/* Tipo de Liquidación */}
              <div className="mb-4">
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Tipo de Liquidación:</label>
                <select
                  value={nuevaLiquidacion.tipoLiquidacion}
                  onChange={(e) => setNuevaLiquidacion({ ...nuevaLiquidacion, tipoLiquidacion: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#3A3A4D] text-[#393E46] dark:text-[#EEEEEE]"
                >
                  <option value="">Seleccione Tipo de Liquidación</option>
                  {tipoLiquidaciones.map((tipo) => (
                    <option key={tipo.idcatalogo_tipo_liquidacion} value={tipo.idcatalogo_tipo_liquidacion}>
                      {tipo.tipo_liquidacion}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end mt-4 space-x-4">
                <button
                  type="button"
                  onClick={crearLiquidacion}
                  className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setModalCrear(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


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

    </div>
  );
};

export default Liquidacion;

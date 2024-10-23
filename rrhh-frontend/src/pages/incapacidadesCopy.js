import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Incapacidades = () => {
  const [incapacidades, setIncapacidades] = useState([]);
  const [nombres, setNombres] = useState({}); // Para almacenar los nombres de los empleados
  const [catalogos, setCatalogos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalActualizar, setModalActualizar] = useState(false);
  const [nuevaIncapacidad, setNuevaIncapacidad] = useState({
    Fecha_Inicio: '',
    Fecha_Fin: '',
    Descripcion_Incapacidades: '',
    Cantidad_Dias: 0,
    Monto_Deduccion: 0,
    catalogo_incapacidad_idCatalogo_Incapacidad: '',
    empleados_idEmpleado: ''
  });
  const [incapacidadActualizar, setIncapacidadActualizar] = useState({
    Fecha_Inicio: '',
    Fecha_Fin: '',
    Descripcion_Incapacidades: '',
    Cantidad_Dias: 0,
    Monto_Deduccion: 0,
    catalogo_incapacidad_idCatalogo_Incapacidad: '',
    empleados_idEmpleado: ''
  });
  const [error, setError] = useState('');

  // Obtener todas las incapacidades
  const obtenerIncapacidades = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/incapacidad');

      if (response && response.data) {
        setIncapacidades(response.data);
      } else {
        console.error('La respuesta no tiene datos:', response);
      }
    } catch (error) {
      console.error('Error al obtener las incapacidades:', error);
    }
  };


  // Obtener catálogo de incapacidades
  const obtenerCatalogos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/catalogoIncapacidades');
      setCatalogos(response.data);
    } catch (error) {
      console.error('Error al obtener el catálogo de incapacidades:', error);
    }
  };

  // Obtener empleados
  const obtenerEmpleados = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/empleados');
      setEmpleados(response.data[0]); // Asegúrate de que esto esté devolviendo la lista correcta
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }
  };

  // Crear nueva incapacidad
  const crearIncapacidad = async () => {
    if (new Date(nuevaIncapacidad.Fecha_Inicio) > new Date()) {
      setError('La fecha de inicio no puede estar en el futuro.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/incapacidad', nuevaIncapacidad);
      setModalCrear(false);
      obtenerIncapacidades();
      setError('');
    } catch (error) {
      console.error('Error al crear la incapacidad:', error);
    }
  };

  // Actualizar incapacidad
  const actualizarIncapacidad = async () => {
    if (new Date(incapacidadActualizar.Fecha_Inicio) > new Date()) {
      setError('La fecha de inicio no puede estar en el futuro.');
      return;
    }

    try {
      await axios.put('http://localhost:3000/api/incapacidad', incapacidadActualizar);
      setModalActualizar(false);
      obtenerIncapacidades();
      setError('');
    } catch (error) {
      console.error('Error al actualizar la incapacidad:', error);
    }
  };


  // Eliminar incapacidad
  const eliminarIncapacidad = async (Fecha_Inicio, empleados_idEmpleado) => {
    const fechaFormateada = new Date(Fecha_Inicio).toISOString().split('T')[0];

    try {
      await axios.delete(`http://localhost:3000/api/incapacidad/${fechaFormateada}/${empleados_idEmpleado}`);
      obtenerIncapacidades();
    } catch (error) {
      console.error('Error al eliminar la incapacidad:', error);
    }
  };

  // Función para calcular la cantidad de días
  const calcularCantidadDias = (fechaInicio, fechaFin) => {
    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      const diferenciaEnMilisegundos = fin - inicio;
      const diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);
      return diferenciaEnDias >= 0 ? Math.floor(diferenciaEnDias) + 1 : 0; // +1 para contar ambos días
    }
    return 0;
  };

  // Actualiza la nueva incapacidad con las fechas y el cálculo de días
  const handleChangeFecha = (campo, valor) => {
    const updatedIncapacidad = { ...nuevaIncapacidad, [campo]: valor };
    if (campo === 'Fecha_Inicio' || campo === 'Fecha_Fin') {
      updatedIncapacidad.Cantidad_Dias = calcularCantidadDias(updatedIncapacidad.Fecha_Inicio, updatedIncapacidad.Fecha_Fin);
    }
    setNuevaIncapacidad(updatedIncapacidad);
  };

  // Lo mismo para actualizar incapacidad
  const handleChangeFechaActualizar = (campo, valor) => {
    const updatedIncapacidad = { ...incapacidadActualizar, [campo]: valor };
    if (campo === 'Fecha_Inicio' || campo === 'Fecha_Fin') {
      updatedIncapacidad.Cantidad_Dias = calcularCantidadDias(updatedIncapacidad.Fecha_Inicio, updatedIncapacidad.Fecha_Fin);
    }
    setIncapacidadActualizar(updatedIncapacidad);
  };

  // Modal para actualizar una incapacidad
  const abrirModalActualizar = (incapacidad) => {
    setIncapacidadActualizar(incapacidad);
    setModalActualizar(true);
  };

  // Generar PDF
  const generarPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Fecha Inicio', 'Fecha Fin', 'Descripción', 'Días', 'Monto Deducción']],
      body: incapacidades.map((incapacidad) => [
        incapacidad.Fecha_Inicio,
        incapacidad.Fecha_Fin,
        incapacidad.Descripcion_Incapacidades,
        incapacidad.Cantidad_Dias,
        incapacidad.Monto_Deduccion
      ]),
    });
    doc.save('incapacidades.pdf');
  };

  // Generar Excel
  const generarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(incapacidades);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Incapacidades');
    XLSX.writeFile(wb, 'incapacidades.xlsx');
  };

  useEffect(() => {
    // Fetch incapacidades (Asegúrate de que esta parte ya está en tu código)
    const fetchIncapacidades = async () => {
      const response = await axios.get('http://localhost:3000/api/incapacidad'); // Cambia esta URL según tu API
      setIncapacidades(response.data);
    };

    fetchIncapacidades();
  }, []);

  useEffect(() => {
    obtenerIncapacidades();
    obtenerCatalogos();
    obtenerEmpleados();
  }, []);

  const fetchNombreEmpleado = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/datosPersona/${id}`);
      return response.data[0][0].Nombre; // Asegúrate de que el campo se llama 'Nombre'
    } catch (error) {
      console.error(`Error fetching nombre for ID ${id}:`, error);
      return ''; // Retorna una cadena vacía si hay un error
    }
  };

  useEffect(() => {
    const fetchNombres = async () => {
      const nombresObj = {};
      for (const incapacidad of incapacidades) {
        const nombre = await fetchNombreEmpleado(incapacidad.empleados_idEmpleado);
        nombresObj[incapacidad.empleados_idEmpleado] = nombre; // Asigna el nombre al ID del empleado
      }
      setNombres(nombresObj);
    };

    if (incapacidades.length > 0) {
      fetchNombres();
    }
  }, [incapacidades]);

  return (
    <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Gestión de Incapacidades</h1>

      <button
        onClick={() => setModalCrear(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 shadow-md transition duration-300 ease-in-out transform hover:scale-105 mx-auto block"
      >
        + Nueva Incapacidad
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
              <th className="px-4 py-2 text-black dark:text-white text-center">ID Empleado</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Nombre</th> {/* Nuevo encabezado */}
              <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Inicio</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Fin</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Descripción</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Días</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Monto Deducción</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {incapacidades.map((incapacidad) => (
              <tr key={`${incapacidad.Fecha_Inicio}-${incapacidad.empleados_idEmpleado}`} className="border-b dark:border-[#4D4D61]">
                <td className="px-4 py-2 text-black dark:text-white text-center">{incapacidad.empleados_idEmpleado}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{nombres[incapacidad.empleados_idEmpleado] || 'Cargando...'}</td> {/* Nombre del empleado */}
                <td className="px-4 py-2 text-black dark:text-white text-center">
                  {new Date(incapacidad.Fecha_Inicio).toISOString().split('T')[0]}
                </td>
                <td className="px-4 py-2 text-black dark:text-white text-center">
                  {new Date(incapacidad.Fecha_Fin).toISOString().split('T')[0]}
                </td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{incapacidad.Descripcion_Incapacidades}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{incapacidad.Cantidad_Dias}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{incapacidad.Monto_Deduccion}</td>
                <td className="px-4 py-2 flex justify-center space-x-2">
                  <button
                    onClick={() => abrirModalActualizar(incapacidad)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg mr-2 shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => eliminarIncapacidad(incapacidad.Fecha_Inicio, incapacidad.empleados_idEmpleado)}
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Crear Nueva Incapacidad</h2>
            <form>
              {/* Fecha de Inicio */}
              <div>
                <label className="block mb-2">Fecha de Inicio:</label>
                <input
                  type="date"
                  value={nuevaIncapacidad.Fecha_Inicio}
                  onChange={(e) => handleChangeFecha('Fecha_Inicio', e.target.value)}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              {/* Fecha de Fin */}
              <div>
                <label className="block mb-2">Fecha de Fin:</label>
                <input
                  type="date"
                  value={nuevaIncapacidad.Fecha_Fin}
                  onChange={(e) => handleChangeFecha('Fecha_Fin', e.target.value)}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block mb-2">Descripción:</label>
                <input
                  type="text"
                  value={nuevaIncapacidad.Descripcion_Incapacidades}
                  onChange={(e) => setNuevaIncapacidad({ ...nuevaIncapacidad, Descripcion_Incapacidades: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              {/* Tipo de Incapacidad */}
              <div>
                <label className="block mb-2">Tipo de Incapacidad:</label>
                <select
                  value={nuevaIncapacidad.catalogo_incapacidad_idCatalogo_Incapacidad}
                  onChange={(e) => setNuevaIncapacidad({ ...nuevaIncapacidad, catalogo_incapacidad_idCatalogo_Incapacidad: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                >
                  <option value="">Seleccione un tipo de incapacidad</option>
                  {catalogos.map((catalogo) => (
                    <option key={catalogo.idCatalogo_Incapacidad} value={catalogo.idCatalogo_Incapacidad}>
                      {catalogo.Descripcion_Catalogo_Incapacidad}
                    </option>
                  ))}
                </select>
              </div>

              {/* Empleado */}
              <div>
                <label className="block mb-2">Empleado:</label>
                <select
                  value={nuevaIncapacidad.empleados_idEmpleado}
                  onChange={(e) => setNuevaIncapacidad({ ...nuevaIncapacidad, empleados_idEmpleado: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                >
                  <option value="">Seleccione un empleado</option>
                  {empleados.map((empleado) => (
                    <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                      {empleado.idEmpleado}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cantidad de Días */}
              <div>
                <label className="block mb-2">Cantidad de Días:</label>
                <input
                  type="number"
                  value={nuevaIncapacidad.Cantidad_Dias}
                  readOnly
                  className="border rounded-lg w-full px-3 py-2 bg-gray-200"
                />
              </div>

              {/* Monto Deducción */}
              <div>
                <label className="block mb-2">Monto Deducción:</label>
                <input
                  type="number"
                  value={nuevaIncapacidad.Monto_Deduccion}
                  onChange={(e) => setNuevaIncapacidad({ ...nuevaIncapacidad, Monto_Deduccion: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={crearIncapacidad}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md"
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setModalCrear(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md ml-2"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Modal Actualizar */}
      {modalActualizar && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Actualizar Incapacidad</h2>
            <form>
              {/* Fecha de Inicio */}
              <div>
                <label className="block mb-2">Fecha de Inicio:</label>
                <input
                  type="date"
                  value={incapacidadActualizar.Fecha_Inicio}
                  onChange={(e) => handleChangeFechaActualizar('Fecha_Inicio', e.target.value)}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              {/* Fecha de Fin */}
              <div>
                <label className="block mb-2">Fecha de Fin:</label>
                <input
                  type="date"
                  value={incapacidadActualizar.Fecha_Fin}
                  onChange={(e) => handleChangeFechaActualizar('Fecha_Fin', e.target.value)}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block mb-2">Descripción:</label>
                <input
                  type="text"
                  value={incapacidadActualizar.Descripcion_Incapacidades}
                  onChange={(e) => setIncapacidadActualizar({ ...incapacidadActualizar, Descripcion_Incapacidades: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              {/* Tipo de Incapacidad */}
              <div>
                <label className="block mb-2">Tipo de Incapacidad:</label>
                <select
                  value={incapacidadActualizar.catalogo_incapacidad_idCatalogo_Incapacidad}
                  onChange={(e) => setIncapacidadActualizar({ ...incapacidadActualizar, catalogo_incapacidad_idCatalogo_Incapacidad: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                >
                  <option value="">Seleccione un tipo de incapacidad</option>
                  {catalogos.map((catalogo) => (
                    <option key={catalogo.idCatalogo_Incapacidad} value={catalogo.idCatalogo_Incapacidad}>
                      {catalogo.Descripcion_Catalogo_Incapacidad}
                    </option>
                  ))}
                </select>
              </div>

              {/* Empleado */}
              <div>
                <label className="block mb-2">Empleado:</label>
                <select
                  value={incapacidadActualizar.empleados_idEmpleado}
                  onChange={(e) => setIncapacidadActualizar({ ...incapacidadActualizar, empleados_idEmpleado: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                >
                  <option value="">Seleccione un empleado</option>
                  {empleados.map((empleado) => (
                    <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                      {empleado.idEmpleado}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cantidad de Días */}
              <div>
                <label className="block mb-2">Cantidad de Días:</label>
                <input
                  type="number"
                  value={incapacidadActualizar.Cantidad_Dias}
                  readOnly
                  className="border rounded-lg w-full px-3 py-2 bg-gray-200"
                />
              </div>

              {/* Monto Deducción */}
              <div>
                <label className="block mb-2">Monto Deducción:</label>
                <input
                  type="number"
                  value={incapacidadActualizar.Monto_Deduccion}
                  onChange={(e) => setIncapacidadActualizar({ ...incapacidadActualizar, Monto_Deduccion: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={actualizarIncapacidad}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md"
                >
                  Actualizar
                </button>
                <button
                  type="button"
                  onClick={() => setModalActualizar(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md ml-2"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Incapacidades;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Incapacidades = () => {

  const [incapacidades, setIncapacidades] = useState([]);
  const [nombres, setNombres] = useState({});
  const [catalogos, setCatalogos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalActualizar, setModalActualizar] = useState(false);
  const [porcentajeDeduccionCrear, setPorcentajeDeduccionCrear] = useState(null);
  const [porcentajeDeduccionActualizar, setPorcentajeDeduccionActualizar] = useState(null);
  const [salarioDiarioCrear, setSalarioDiarioCrear] = useState(null);
  const [salarioDiarioActualizar, setSalarioDiarioActualizar] = useState(null);
  const [alertModal, setAlertModal] = useState({ visible: false, message: '', type: '' });


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


  const obtenerCatalogos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/catalogoIncapacidades');
      setCatalogos(response.data);
    } catch (error) {
      console.error('Error al obtener el catálogo de incapacidades:', error);
    }
  };

  const obtenerEmpleados = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/empleados/nombre-completo');
      setEmpleados(response.data[0]); // Asignar directamente la lista de empleados con idEmpleado y NombreCompleto
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }
  };

  const crearIncapacidad = async () => {
    const { Fecha_Inicio, Fecha_Fin, Descripcion_Incapacidades, Cantidad_Dias, catalogo_incapacidad_idCatalogo_Incapacidad, empleados_idEmpleado } = nuevaIncapacidad;
  
    // Validaciones
    if (!Fecha_Inicio) {
      setAlertModal({ visible: true, message: 'Debe seleccionar la Fecha de Inicio', type: 'error' });
      return;
    }
    if (!Fecha_Fin) {
      setAlertModal({ visible: true, message: 'Debe seleccionar la Fecha de Fin', type: 'error' });
      return;
    }
    if (Cantidad_Dias <= 0) {
      setAlertModal({ visible: true, message: 'La cantidad de días debe ser mayor a 0', type: 'error' });
      return;
    }
    if (!Descripcion_Incapacidades) {
      setAlertModal({ visible: true, message: 'Debe proporcionar una descripción para la incapacidad', type: 'error' });
      return;
    }
    if (!catalogo_incapacidad_idCatalogo_Incapacidad) {
      setAlertModal({ visible: true, message: 'Debe seleccionar un tipo de incapacidad', type: 'error' });
      return;
    }
    if (!empleados_idEmpleado) {
      setAlertModal({ visible: true, message: 'Debe seleccionar un empleado', type: 'error' });
      return;
    }
  
    try {
      const montoDeduccionCalculado = salarioDiarioCrear * porcentajeDeduccionCrear * Cantidad_Dias || 0;
      const incapacidadConMonto = { ...nuevaIncapacidad, Monto_Deduccion: montoDeduccionCalculado };
  
      await axios.post('http://localhost:3000/api/incapacidad', incapacidadConMonto);
  
      // Mostrar alerta de éxito
      setAlertModal({ visible: true, message: 'Incapacidad creada exitosamente', type: 'success' });
  
      setModalCrear(false);
      obtenerIncapacidades();
    } catch (error) {
      console.error('Error al crear la incapacidad:', error);
      setAlertModal({ visible: true, message: 'Error al crear la incapacidad', type: 'error' });
    }
  };
  


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


  const eliminarIncapacidad = async (Fecha_Inicio, empleados_idEmpleado) => {
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
            // Formatear la fecha a 'YYYY-MM-DD'
            const fechaFormateada = new Date(Fecha_Inicio).toISOString().split('T')[0];

            await axios.delete(`http://localhost:3000/api/incapacidad/${fechaFormateada}/${empleados_idEmpleado}`);
            Swal.fire('Eliminado', 'La incapacidad ha sido eliminada.', 'success');
            obtenerIncapacidades();
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar la incapacidad.', 'error');
        }
    }
};


  const calcularCantidadDias = (fechaInicio, fechaFin) => {
    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      const diferenciaEnMilisegundos = fin - inicio;
      const diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);
      return diferenciaEnDias >= 0 ? Math.floor(diferenciaEnDias) + 1 : 0;
    }
    return 0;
  };

  const fetchPorcentajeDeduccion = async (idCatalogoIncapacidad, setPorcentajeDeduccion) => {
    try {
      const response = await axios.get(`http://localhost:3000/catalogoIncapacidades/${idCatalogoIncapacidad}`);
      setPorcentajeDeduccion(response.data[0].Porcentaje_Deduccion);
    } catch (error) {
      console.error("Error fetching Porcentaje_Deduccion:", error);
      setPorcentajeDeduccion(null);
    }
  };

  const fetchSalarioDiario = async (idEmpleado, setSalarioDiario) => {
    try {
      const response = await axios.get(`http://localhost:3000/calcularSalarioDiario/${idEmpleado}`);
      const salarioDiario = response.data[0][0].SalarioDiario;
      setSalarioDiario(salarioDiario);

      // Calculate Monto_Deducción and update state
      const montoDeduccion = (salarioDiario * porcentajeDeduccionActualizar * incapacidadActualizar.Cantidad_Dias) || 0;
      setIncapacidadActualizar((prev) => ({ ...prev, Monto_Deduccion: montoDeduccion })); // Update Monto_Deducción
    } catch (error) {
      console.error("Error fetching SalarioDiario:", error);
      setSalarioDiario(null);
    }
  };

  const handleChangeFecha = (campo, valor) => {
    const updatedIncapacidad = { ...nuevaIncapacidad, [campo]: valor };

    // Calcular la cantidad de días si cambia Fecha_Inicio o Fecha_Fin
    if (campo === 'Fecha_Inicio' || campo === 'Fecha_Fin') {
      updatedIncapacidad.Cantidad_Dias = calcularCantidadDias(updatedIncapacidad.Fecha_Inicio, updatedIncapacidad.Fecha_Fin);
    }

    // Calcular el Monto de Deducción si el salario y el porcentaje están disponibles
    if (salarioDiarioCrear && porcentajeDeduccionCrear) {
      const montoDeduccion = salarioDiarioCrear * porcentajeDeduccionCrear * updatedIncapacidad.Cantidad_Dias;
      updatedIncapacidad.Monto_Deduccion = montoDeduccion || 0;
    }

    // Validar si la fecha de inicio es futura y mostrar el error si aplica
    if (campo === 'Fecha_Inicio' && new Date(valor) > new Date()) {
      setError('La fecha de inicio no puede ser un día futuro.');
    } else {
      setError('');
    }

    setNuevaIncapacidad(updatedIncapacidad);
  };



  const handleChangeFechaActualizar = (campo, valor) => {
    const updatedIncapacidad = { ...incapacidadActualizar, [campo]: valor };

    // Calcular la cantidad de días si cambia Fecha_Inicio o Fecha_Fin
    if (campo === 'Fecha_Inicio' || campo === 'Fecha_Fin') {
      updatedIncapacidad.Cantidad_Dias = calcularCantidadDias(updatedIncapacidad.Fecha_Inicio, updatedIncapacidad.Fecha_Fin);
    }

    // Calcular el Monto de Deducción si el salario y el porcentaje están disponibles
    const montoDeduccion = (salarioDiarioActualizar * porcentajeDeduccionActualizar * updatedIncapacidad.Cantidad_Dias) || 0;
    updatedIncapacidad.Monto_Deduccion = montoDeduccion;

    // Validar si la fecha de inicio es futura y mostrar el error si aplica
    if (campo === 'Fecha_Inicio' && new Date(valor) > new Date()) {
      setError('La fecha de inicio no puede ser un día futuro.');
    } else {
      setError('');
    }

    setIncapacidadActualizar(updatedIncapacidad);
  };




  const abrirModalActualizar = (incapacidad) => {
    const formatearFecha = (fecha) => new Date(fecha).toISOString().split('T')[0];

    setIncapacidadActualizar({
      ...incapacidad,
      Fecha_Inicio: formatearFecha(incapacidad.Fecha_Inicio),
      Fecha_Fin: formatearFecha(incapacidad.Fecha_Fin),
    });
    setModalActualizar(true);
  };


  useEffect(() => {
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
      return response.data[0][0].Nombre;
    } catch (error) {
      console.error(`Error fetching nombre for ID ${id}:`, error);
      return '';
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
    <div className="p-6 bg-[#EEEEEE] dark:bg-[#222831] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-[#393E46] dark:text-[#EEEEEE] text-center">Gestión de Incapacidades</h1>

      {/* Botón Crear Incapacidad */}
      <button
        onClick={() => setModalCrear(true)}
        className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg mb-4 shadow-md transition duration-300 ease-in-out transform hover:scale-105 mx-auto block"
      >
        + Nueva Incapacidad
      </button>

      {/* Tabla de Incapacidades */}
      <div className="overflow-hidden rounded-lg shadow-lg mb-6 animate-scale-up">
        <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
          <thead className="bg-[#00ADB5]">
            <tr>
              <th className="px-4 py-2 text-white text-center">ID Empleado</th>
              <th className="px-4 py-2 text-white text-center">Nombre</th>
              <th className="px-4 py-2 text-white text-center">Fecha Inicio</th>
              <th className="px-4 py-2 text-white text-center">Fecha Fin</th>
              <th className="px-4 py-2 text-white text-center">Descripción</th>
              <th className="px-4 py-2 text-white text-center">Días</th>
              <th className="px-4 py-2 text-white text-center">Monto Deducción</th>
              <th className="px-4 py-2 text-white text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {incapacidades.map((incapacidad) => (
              <tr key={`${incapacidad.Fecha_Inicio}-${incapacidad.empleados_idEmpleado}`} className="border-b hover:bg-[#EEEEEE] dark:hover:bg-[#393E46] transition-all duration-200">
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{incapacidad.empleados_idEmpleado}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{nombres[incapacidad.empleados_idEmpleado] || 'Cargando...'}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{new Date(incapacidad.Fecha_Inicio).toISOString().split('T')[0]}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{new Date(incapacidad.Fecha_Fin).toISOString().split('T')[0]}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{incapacidad.Descripcion_Incapacidades}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{incapacidad.Cantidad_Dias}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">₡{incapacidad.Monto_Deduccion}</td>
                <td className="px-4 py-2 flex justify-center space-x-2">
                  <button
                    onClick={() => abrirModalActualizar(incapacidad)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg max-w-md w-full animate-scale-up">
            <h2 className="text-lg font-semibold mb-4 text-[#393E46] dark:text-[#EEEEEE]">Crear Nueva Incapacidad</h2>
            <form>
              {/* Fecha de Inicio */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Fecha de Inicio:</label>
                <input
                  type="date"
                  value={nuevaIncapacidad.Fecha_Inicio}
                  onChange={(e) => handleChangeFecha('Fecha_Inicio', e.target.value)}
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#2D2D3B] text-[#393E46] dark:text-[#EEEEEE]"
                />
              </div>

              {/* Fecha de Fin */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Fecha de Fin:</label>
                <input
                  type="date"
                  value={nuevaIncapacidad.Fecha_Fin}
                  onChange={(e) => handleChangeFecha('Fecha_Fin', e.target.value)}
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#2D2D3B] text-[#393E46] dark:text-[#EEEEEE]"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Descripción:</label>
                <input
                  type="text"
                  value={nuevaIncapacidad.Descripcion_Incapacidades}
                  onChange={(e) => setNuevaIncapacidad({ ...nuevaIncapacidad, Descripcion_Incapacidades: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#2D2D3B] text-[#393E46] dark:text-[#EEEEEE]"
                />
              </div>

              {/* Tipo de Incapacidad */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Tipo de Incapacidad:</label>
                <select
                  value={nuevaIncapacidad.catalogo_incapacidad_idCatalogo_Incapacidad}
                  onChange={(e) => {
                    setNuevaIncapacidad({ ...nuevaIncapacidad, catalogo_incapacidad_idCatalogo_Incapacidad: e.target.value });
                    fetchPorcentajeDeduccion(e.target.value, setPorcentajeDeduccionCrear);
                  }}
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#2D2D3B] text-[#393E46] dark:text-[#EEEEEE]"
                >
                  <option value="">Seleccione un tipo de incapacidad</option>
                  {catalogos.map((catalogo) => (
                    <option key={catalogo.idCatalogo_Incapacidad} value={catalogo.idCatalogo_Incapacidad}>
                      {catalogo.Descripcion_Catalogo_Incapacidad}
                    </option>
                  ))}
                </select>
              </div>

              {/* Porcentaje de Deducción */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Porcentaje de Deducción:</label>
                <input
                  type="number"
                  value={porcentajeDeduccionCrear || ''}
                  readOnly
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-gray-200 text-[#393E46] dark:bg-[#2D2D3B] dark:text-[#EEEEEE]"
                />
              </div>

              {/* Empleado */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Empleado:</label>
                <select
                  value={nuevaIncapacidad.empleados_idEmpleado}
                  onChange={(e) => {
                    const idEmpleado = e.target.value;
                    setNuevaIncapacidad({ ...nuevaIncapacidad, empleados_idEmpleado: idEmpleado });
                    fetchSalarioDiario(idEmpleado, setSalarioDiarioCrear);
                  }}
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#2D2D3B] text-[#393E46] dark:text-[#EEEEEE]"
                >
                  <option value="">Seleccione un empleado</option>
                  {empleados.map((empleado) => (
                    <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                      {empleado.NombreCompleto}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salario Diario */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Salario Diario:</label>
                <input
                  type="number"
                  value={salarioDiarioCrear || ''}
                  readOnly
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-gray-200 text-[#393E46] dark:bg-[#2D2D3B] dark:text-[#EEEEEE]"
                />
              </div>

              {/* Cantidad de Días */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Cantidad de Días:</label>
                <input
                  type="number"
                  value={nuevaIncapacidad.Cantidad_Dias}
                  readOnly
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-gray-200 text-[#393E46] dark:bg-[#2D2D3B] dark:text-[#EEEEEE]"
                />
              </div>

              {/* Monto de Deducción */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Monto de Deducción:</label>
                <input
                  type="number"
                  value={(salarioDiarioCrear * porcentajeDeduccionCrear * nuevaIncapacidad.Cantidad_Dias) || 0}
                  readOnly
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-gray-200 text-[#393E46] dark:bg-[#2D2D3B] dark:text-[#EEEEEE]"
                />
              </div>

              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-end mt-4 space-x-4">
                <button
                  type="button"
                  onClick={crearIncapacidad}
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



      {/* Modal Actualizar */}
      {modalActualizar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg max-w-md w-full animate-scale-up">
            <h2 className="text-lg font-semibold mb-4 text-[#393E46] dark:text-[#EEEEEE]">Actualizar Incapacidad</h2>
            <form>
              {/* Fecha de Inicio */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Fecha de Inicio:</label>
                <input
                  type="date"
                  value={incapacidadActualizar.Fecha_Inicio}
                  onChange={(e) => handleChangeFechaActualizar('Fecha_Inicio', e.target.value)}
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#2D2D3B] text-[#393E46] dark:text-[#EEEEEE]"
                />
              </div>

              {/* Fecha de Fin */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Fecha de Fin:</label>
                <input
                  type="date"
                  value={incapacidadActualizar.Fecha_Fin}
                  onChange={(e) => handleChangeFechaActualizar('Fecha_Fin', e.target.value)}
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#2D2D3B] text-[#393E46] dark:text-[#EEEEEE]"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Descripción:</label>
                <input
                  type="text"
                  value={incapacidadActualizar.Descripcion_Incapacidades}
                  onChange={(e) => setIncapacidadActualizar({ ...incapacidadActualizar, Descripcion_Incapacidades: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#2D2D3B] text-[#393E46] dark:text-[#EEEEEE]"
                />
              </div>

              {/* Tipo de Incapacidad */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Tipo de Incapacidad:</label>
                <select
                  value={incapacidadActualizar.catalogo_incapacidad_idCatalogo_Incapacidad}
                  onChange={(e) => {
                    const tipoIncapacidadId = e.target.value;
                    setIncapacidadActualizar({ ...incapacidadActualizar, catalogo_incapacidad_idCatalogo_Incapacidad: tipoIncapacidadId });
                    fetchPorcentajeDeduccion(tipoIncapacidadId, setPorcentajeDeduccionActualizar);
                  }}
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#2D2D3B] text-[#393E46] dark:text-[#EEEEEE]"
                >
                  <option value="">Seleccione un tipo de incapacidad</option>
                  {catalogos.map((catalogo) => (
                    <option key={catalogo.idCatalogo_Incapacidad} value={catalogo.idCatalogo_Incapacidad}>
                      {catalogo.Descripcion_Catalogo_Incapacidad}
                    </option>
                  ))}
                </select>
              </div>

              {/* Porcentaje de Deducción */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Porcentaje de Deducción:</label>
                <input
                  type="number"
                  value={porcentajeDeduccionActualizar || ''}
                  readOnly
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-gray-200 text-[#393E46] dark:bg-[#2D2D3B] dark:text-[#EEEEEE]"
                />
              </div>

              {/* Empleado */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Empleado:</label>
                <select
                  value={incapacidadActualizar.empleados_idEmpleado}
                  onChange={(e) => {
                    const idEmpleado = e.target.value;
                    setIncapacidadActualizar({ ...incapacidadActualizar, empleados_idEmpleado: idEmpleado });
                    fetchSalarioDiario(idEmpleado, setSalarioDiarioActualizar);
                  }}
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#2D2D3B] text-[#393E46] dark:text-[#EEEEEE]"
                >
                  <option value="">Seleccione un empleado</option>
                  {empleados.map((empleado) => (
                    <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                      {empleado.NombreCompleto}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salario Diario */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Salario Diario:</label>
                <input
                  type="number"
                  value={salarioDiarioActualizar || ''}
                  readOnly
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-gray-200 text-[#393E46] dark:bg-[#2D2D3B] dark:text-[#EEEEEE]"
                />
              </div>

              {/* Cantidad de Días */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Cantidad de Días:</label>
                <input
                  type="number"
                  value={incapacidadActualizar.Cantidad_Dias}
                  readOnly
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-gray-200 text-[#393E46] dark:bg-[#2D2D3B] dark:text-[#EEEEEE]"
                />
              </div>

              {/* Monto Deducción */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Monto Deducción:</label>
                <input
                  type="number"
                  value={incapacidadActualizar.Monto_Deduccion}
                  readOnly
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-gray-200 text-[#393E46] dark:bg-[#2D2D3B] dark:text-[#EEEEEE]"
                />
              </div>

              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-end mt-4 space-x-4">
                <button
                  type="button"
                  onClick={actualizarIncapacidad}
                  className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Actualizar
                </button>
                <button
                  type="button"
                  onClick={() => setModalActualizar(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {alertModal.visible && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className={`bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg max-w-md mx-auto text-center ${alertModal.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
      <h2 className="text-xl font-bold mb-4">{alertModal.type === 'success' ? '¡Éxito!' : 'Error'}</h2>
      <p className="text-gray-700 dark:text-white">{alertModal.message}</p>
      <button
        onClick={() => setAlertModal({ visible: false, message: '', type: '' })}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
      >
        Cerrar
      </button>
    </div>
  </div>
)}




    </div>
  );
};

export default Incapacidades;
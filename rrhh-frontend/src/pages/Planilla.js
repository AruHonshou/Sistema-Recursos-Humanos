import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Planilla = () => {
  const [planillas, setPlanillas] = useState([]);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [nuevaPlanilla, setNuevaPlanilla] = useState({ fechaPlanilla: '' });
  const [fechaEliminar, setFechaEliminar] = useState('');
  const [alertMessages, setAlertMessages] = useState([]);

  // Obtener mes y año actual
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Fetch all payroll records
const obtenerPlanillas = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/planillas');

    // Ordena primero por fecha de planilla (más reciente a más antigua) y luego por idEmpleado (menor a mayor)
    const planillasOrdenadas = response.data[0].sort((a, b) => {
      const dateComparison = new Date(b.Fecha_Planilla) - new Date(a.Fecha_Planilla);
      if (dateComparison !== 0) return dateComparison; // Ordena por fecha primero
      return a.idEmpleado - b.idEmpleado; // Si las fechas son iguales, ordena por idEmpleado
    });

    setPlanillas(planillasOrdenadas);
  } catch (error) {
    console.error('Error al obtener las planillas:', error);
  }
};


  // Create new payroll entry with on-screen validation alerts
  const crearPlanilla = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/planillas/calcular', nuevaPlanilla);
      const data = response.data;

      if (data.alertas && data.alertas.length > 0) {
        setAlertMessages(data.alertas.map(alert => alert.mensaje));
      } else {
        setAlertMessages(['Planilla calculada exitosamente.']);
      }

      setModalCrear(false);
      obtenerPlanillas();
    } catch (error) {
      console.error('Error al calcular la planilla:', error);
      setAlertMessages(['Error en el cálculo de planilla. Verifique los datos e intente de nuevo.']);
    }
  };

  const eliminarPlanilla = async () => {
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
        await axios.delete('http://localhost:3000/api/planillas/eliminar', { data: { fechaPlanilla: fechaEliminar } });
        Swal.fire('Eliminado', 'La planilla ha sido eliminada.', 'success');
        obtenerPlanillas();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la planilla.', 'error');
      }
    }
  };


  useEffect(() => {
    obtenerPlanillas();
  }, []);

  // Extract unique dates for the dropdown
  const uniqueDates = [...new Set(planillas.map(planilla => new Date(planilla.Fecha_Planilla).toISOString().split('T')[0]))];

  return (
    <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Gestión de Planilla</h1>

      {alertMessages.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-200 border-l-4 border-yellow-500 text-yellow-700 rounded-lg">
          {alertMessages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      )}

      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => setModalCrear(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          + Calcular Nueva Planilla
        </button>

        <button
          onClick={() => setModalEliminar(true)}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Eliminar Planilla
        </button>
      </div>

      <div className="overflow-hidden rounded-lg shadow-lg">
        <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
          <thead className="bg-gray-100 dark:bg-[#3A3A4D] border-b">
            <tr>
              <th className="px-4 py-2 text-black dark:text-white text-center">ID Empleado</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Nombre</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Planilla</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Descripción</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Total Horas Extras</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Deducciones</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Incapacidades</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Recortes</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Monto Total</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Cálculos Fiscales</th>
            </tr>
          </thead>
          <tbody>
            {planillas.map((planilla) => (
              <tr key={planilla.Fecha_Planilla} className="border-b dark:border-[#4D4D61]">
                <td className="px-4 py-2 text-black dark:text-white text-center">{planilla.idEmpleado}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{planilla.Persona}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(planilla.Fecha_Planilla).toISOString().split('T')[0]}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{planilla.Descripcion_Planilla}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">₡{planilla.Monto_Total_Horas_Extras}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">₡{planilla.Monto_Total_Deducciones}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">₡{planilla.Monto_Total_Incapacidades}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">₡{planilla.Monto_Descontado_Recortar}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">₡{planilla.Monto_Total_Planilla}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">₡{planilla.Monto_Calculos_Fiscales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Crear Planilla */}
      {modalCrear && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Calcular Nueva Planilla</h2>
            <form>
              <div>
                <label className="block mb-2">Fecha de Planilla:</label>
                <div className="flex space-x-2">
                  {/* Selector de Año */}
                  <select
                    value={nuevaPlanilla.anio}
                    onChange={(e) => setNuevaPlanilla({ ...nuevaPlanilla, anio: e.target.value, mes: '' })}
                    className="border rounded-lg w-full px-3 py-2"
                  >
                    <option value="">Seleccione el año</option>
                    {Array.from({ length: 5 }, (_, i) => currentYear + i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>

                  {/* Selector de Mes */}
                  <select
                    value={nuevaPlanilla.mes}
                    onChange={(e) => setNuevaPlanilla({ ...nuevaPlanilla, mes: e.target.value })}
                    className="border rounded-lg w-full px-3 py-2"
                  >
                    <option value="">Seleccione el mes</option>
                    {(nuevaPlanilla.anio == currentYear
                      ? Array.from({ length: 12 - currentMonth + 1 }, (_, i) => i + currentMonth)
                      : Array.from({ length: 12 }, (_, i) => i + 1)
                    ).map((month) => (
                      <option key={month} value={month}>
                        {new Date(0, month - 1).toLocaleString("es", { month: "long" })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={crearPlanilla}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md"
                >
                  Calcular
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

      {/* Modal Eliminar Planilla */}
      {modalEliminar && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Eliminar Planilla</h2>
            <form>
              <div>
                <label className="block mb-2">Seleccione la Fecha de Planilla a Eliminar:</label>
                <select
                  value={fechaEliminar}
                  onChange={(e) => setFechaEliminar(e.target.value)}
                  className="border rounded-lg w-full px-3 py-2"
                >
                  <option value="">Seleccione una fecha</option>
                  {uniqueDates.map((date) => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={eliminarPlanilla}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md"
                >
                  Eliminar
                </button>
                <button
                  type="button"
                  onClick={() => setModalEliminar(false)}
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

export default Planilla;

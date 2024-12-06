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

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const obtenerPlanillas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/planillas');

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
    <div className="p-6 bg-[#EEEEEE] dark:bg-[#222831] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-[#393E46] dark:text-[#EEEEEE] text-center">Gestión de Planilla</h1>

      {alertMessages.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-200 border-l-4 border-yellow-500 text-yellow-700 rounded-lg">
          {alertMessages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      )}

      <div className="flex justify-center space-x-4 mb-4">
        {/* Botón Calcular Nueva Planilla */}
        <button
          onClick={() => setModalCrear(true)}
          className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          + Calcular Nueva Planilla
        </button>

        {/* Botón Eliminar Planilla */}
        <button
          onClick={() => setModalEliminar(true)}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Eliminar Planilla
        </button>
      </div>

      {/* Tabla de Planillas */}
      <div className="overflow-hidden rounded-lg shadow-lg mb-6 animate-scale-up">
        <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
          <thead className="bg-[#00ADB5]">
            <tr>
              <th className="px-4 py-2 text-white text-center">ID Empleado</th>
              <th className="px-4 py-2 text-white text-center">Nombre</th>
              <th className="px-4 py-2 text-white text-center">Fecha Planilla</th>
              <th className="px-4 py-2 text-white text-center">Descripción</th>
              <th className="px-4 py-2 text-white text-center">Total Horas Extras</th>
              <th className="px-4 py-2 text-white text-center">Deducciones</th>
              <th className="px-4 py-2 text-white text-center">Incapacidades</th>
              <th className="px-4 py-2 text-white text-center">Recortes</th>
              <th className="px-4 py-2 text-white text-center">Monto Total</th>
              <th className="px-4 py-2 text-white text-center">Cálculos Fiscales</th>
            </tr>
          </thead>
          <tbody>
            {planillas.map((planilla) => (
              <tr key={planilla.Fecha_Planilla} className="border-b hover:bg-[#EEEEEE] dark:hover:bg-[#393E46] transition-all duration-200">
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{planilla.idEmpleado}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{planilla.Persona}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{new Date(planilla.Fecha_Planilla).toISOString().split('T')[0]}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{planilla.Descripcion_Planilla}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">₡{planilla.Monto_Total_Horas_Extras}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">₡{planilla.Monto_Total_Deducciones}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">₡{planilla.Monto_Total_Incapacidades}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">₡{planilla.Monto_Descontado_Recortar}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">₡{planilla.Monto_Total_Planilla}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">₡{planilla.Monto_Calculos_Fiscales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>



      {/* Modal Crear Planilla */}
      {modalCrear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg max-w-md w-full animate-scale-up">
            <h2 className="text-lg font-semibold mb-4 text-[#393E46] dark:text-[#EEEEEE]">Calcular Nueva Planilla</h2>
            <form>
              {/* Fecha de Planilla */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Fecha de Planilla:</label>
                <div className="flex space-x-2">
                  {/* Selector de Año */}
                  <select
                    value={nuevaPlanilla.anio}
                    onChange={(e) => setNuevaPlanilla({ ...nuevaPlanilla, anio: e.target.value, mes: '' })}
                    className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#2D2D3B] text-[#393E46] dark:text-[#EEEEEE]"
                  >
                    <option value="">Seleccione el año</option>
                    {Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => 2000 + i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>


                  {/* Selector de Mes */}
                  <select
                    value={nuevaPlanilla.mes}
                    onChange={(e) => setNuevaPlanilla({ ...nuevaPlanilla, mes: e.target.value })}
                    className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#2D2D3B] text-[#393E46] dark:text-[#EEEEEE]"
                  >
                    <option value="">Seleccione el mes</option>
                    {(nuevaPlanilla.anio == currentYear
                      ? Array.from({ length: currentMonth }, (_, i) => i + 1) // Meses hasta el mes actual
                      : Array.from({ length: 12 }, (_, i) => i + 1) // Todos los meses para años anteriores
                    ).map((month) => (
                      <option key={month} value={month}>
                        {new Date(0, month - 1).toLocaleString("es", { month: "long" })}
                      </option>
                    ))}
                  </select>

                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end mt-4 space-x-4">
                <button
                  type="button"
                  onClick={crearPlanilla}
                  className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Calcular
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


      {/* Modal Eliminar Planilla */}
      {modalEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg max-w-md w-full animate-scale-up">
            <h2 className="text-lg font-semibold mb-4 text-[#393E46] dark:text-[#EEEEEE]">Eliminar Planilla</h2>
            <form>
              {/* Selector de Fecha de Planilla */}
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Seleccione la Fecha de Planilla a Eliminar:</label>
                <select
                  value={fechaEliminar}
                  onChange={(e) => setFechaEliminar(e.target.value)}
                  className="border rounded-lg w-full px-3 py-2 mb-2 bg-white dark:bg-[#2D2D3B] text-[#393E46] dark:text-[#EEEEEE]"
                >
                  <option value="">Seleccione una fecha</option>
                  {uniqueDates.map((date) => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end mt-4 space-x-4">
                <button
                  type="button"
                  onClick={eliminarPlanilla}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Eliminar
                </button>
                <button
                  type="button"
                  onClick={() => setModalEliminar(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
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

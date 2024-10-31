import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Planilla = () => {
  const [planillas, setPlanillas] = useState([]);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [nuevaPlanilla, setNuevaPlanilla] = useState({ fechaPlanilla: '' });
  const [fechaEliminar, setFechaEliminar] = useState('');
  const [alertMessages, setAlertMessages] = useState([]);

  // Fetch all payroll records
  const obtenerPlanillas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/planillas');
      setPlanillas(response.data[0]);
    } catch (error) {
      console.error('Error al obtener las planillas:', error);
    }
  };

  // Create new payroll entry with on-screen validation alerts
  const crearPlanilla = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/planillas/calcular', nuevaPlanilla);
      const data = response.data;

      // Update the alert messages state if there are validation messages
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

  // Delete payroll entry by selected date
  const eliminarPlanilla = async () => {
    try {
      const formattedDate = new Date(fechaEliminar).toISOString().split('T')[0];
      await axios.delete('http://localhost:3000/api/planillas/eliminar', { data: { fechaPlanilla: formattedDate } });
      setAlertMessages(['Planilla eliminada exitosamente.']);
      setModalEliminar(false);
      obtenerPlanillas();
    } catch (error) {
      console.error('Error al eliminar la planilla:', error);
      setAlertMessages(['Error al eliminar la planilla. Intente nuevamente.']);
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

      {/* Alert Messages Section */}
      {alertMessages.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-200 border-l-4 border-yellow-500 text-yellow-700 rounded-lg">
          {alertMessages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      )}

      <div className="flex justify-center space-x-4 mb-4">
        {/* Create Payroll Button */}
        <button
          onClick={() => setModalCrear(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          + Calcular Nueva Planilla
        </button>

        {/* Delete Payroll Button */}
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
                <td className="px-4 py-2 text-black dark:text-white text-center">{planilla.Monto_Total_Horas_Extras}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{planilla.Monto_Total_Deducciones}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{planilla.Monto_Total_Incapacidades}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{planilla.Monto_Descontado_Recortar}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{planilla.Monto_Total_Planilla}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{planilla.Monto_Calculos_Fiscales}</td>
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
                <input
                  type="date"
                  value={nuevaPlanilla.fechaPlanilla}
                  onChange={(e) => setNuevaPlanilla({ ...nuevaPlanilla, fechaPlanilla: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                />
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

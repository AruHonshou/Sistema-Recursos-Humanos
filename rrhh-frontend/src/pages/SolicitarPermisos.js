import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SolicitarPermisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [catalogoPermisos, setCatalogoPermisos] = useState([]);
  const [modalCrear, setModalCrear] = useState(false);
  const [alertModal, setAlertModal] = useState({ visible: false, message: '', type: '' });
  const [nuevoPermiso, setNuevoPermiso] = useState({
    fecha_permiso: '',
    detalle_permiso: '',
    fecha_solicitud: '',
    con_gose: 0,
    catalogo_permiso_id: '',
    empleados_idEmpleado: '',
    horas_permiso: 0
  });

  // Obtener permisos para el usuario
  const obtenerPermisos = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const idusuario = user ? user.idusuarios : null;

      if (idusuario) {
        const response = await axios.get(`http://localhost:3000/api/permisos/usuario/${idusuario}`);
        const sortedPermisos = response.data[0].sort((a, b) => new Date(b.fecha_permiso) - new Date(a.fecha_permiso));
        setPermisos(sortedPermisos);
      } else {
        console.error('Usuario no encontrado en el local storage');
      }
    } catch (error) {
      console.error('Error al obtener los permisos:', error);
    }
  };


  // Obtener empleados para el usuario
  const obtenerEmpleados = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const idusuario = user ? user.idusuarios : null;

      if (idusuario) {
        const response = await axios.get(`http://localhost:3000/api/empleados/usuario/${idusuario}`);
        setEmpleados([response.data]); // Wrap the object in an array to map over it in the dropdown
      } else {
        console.error('Usuario no encontrado en el local storage');
      }
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }
  };

  // Obtener catálogo de permisos
  const obtenerCatalogoPermisos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/catalogoPermiso/');
      setCatalogoPermisos(response.data[0]);
    } catch (error) {
      console.error('Error al obtener el catálogo de permisos:', error);
    }
  };

  const crearPermiso = async () => {
    const { fecha_permiso, con_gose, catalogo_permiso_id, empleados_idEmpleado, horas_permiso } = nuevoPermiso;

    // Validation checks
    if (!fecha_permiso) {
      setAlertModal({ visible: true, message: 'Debe seleccionar la Fecha de Permiso', type: 'error' });
      return;
    }
    if (con_gose === null) {
      setAlertModal({ visible: true, message: 'Debe seleccionar si es Con Goce', type: 'error' });
      return;
    }
    if (!catalogo_permiso_id) {
      setAlertModal({ visible: true, message: 'Debe seleccionar un Tipo de Permiso', type: 'error' });
      return;
    }
    if (!empleados_idEmpleado) {
      setAlertModal({ visible: true, message: 'Debe seleccionar un Empleado', type: 'error' });
      return;
    }
    if (!horas_permiso || horas_permiso <= 0) {
      setAlertModal({ visible: true, message: 'Debe ingresar un valor válido para Horas de Permiso', type: 'error' });
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/permisos/', nuevoPermiso);

      // Show success alert
      setAlertModal({ visible: true, message: 'Permiso creado exitosamente', type: 'success' });

      setModalCrear(false);
      obtenerPermisos();
    } catch (error) {
      const errorMessage = error.response && error.response.status === 400
        ? error.response.data.error
        : 'Error al crear el permiso';
      setAlertModal({ visible: true, message: errorMessage, type: 'error' });
      console.error('Error al crear el permiso:', error);
    }
  };

  useEffect(() => {
    obtenerPermisos();
    obtenerEmpleados();
    obtenerCatalogoPermisos();

    // Set the current date in Costa Rica as fecha_solicitud
    const now = new Date();
    now.setHours(now.getHours() - 6); // Adjust to UTC-6
    const costaRicaDate = now.toISOString().split('T')[0];
    setNuevoPermiso((prev) => ({ ...prev, fecha_solicitud: costaRicaDate }));
  }, []);


  return (
    <div className="p-6 bg-[#EEEEEE] dark:bg-[#222831] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-[#393E46] dark:text-[#EEEEEE] text-center animate-fade-in">
        Gestión de Permisos
      </h1>

      <button
        onClick={() => setModalCrear(true)}
        className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg mb-4 shadow-md transition duration-300 ease-in-out transform hover:scale-105 mx-auto block"
      >
        + Nuevo Permiso
      </button>

      <div className="overflow-hidden rounded-lg shadow-lg mb-6 animate-scale-up">
        <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
          <thead className="bg-[#00ADB5]">
            <tr>
              <th className="px-4 py-2 text-white text-center">ID Empleado</th>
              <th className="px-4 py-2 text-white text-center">Nombre</th>
              <th className="px-4 py-2 text-white text-center">Fecha Permiso</th>
              <th className="px-4 py-2 text-white text-center">Fecha Solicitud</th>
              <th className="px-4 py-2 text-white text-center">Con Goce</th>
              <th className="px-4 py-2 text-white text-center">Horas Permiso</th>
              <th className="px-4 py-2 text-white text-center">Monto Permiso</th>
              <th className="px-4 py-2 text-white text-center">Descripción Permiso</th>
              <th className="px-4 py-2 text-white text-center">Estado Solicitud</th>
            </tr>
          </thead>
          <tbody>
            {permisos.map((permiso) => (
              <tr
                key={`${new Date(permiso.fecha_permiso).toISOString()}-${permiso.idEmpleado}`}
                className="border-b hover:bg-[#EEEEEE] dark:hover:bg-[#393E46] transition-all duration-200"
              >
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{permiso.idEmpleado}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{permiso.Persona || 'Cargando...'}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">
                  {new Date(permiso.fecha_permiso).toISOString().split('T')[0]}
                </td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">
                  {new Date(permiso.fecha_solicitud).toISOString().split('T')[0]}
                </td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{permiso.Con_Gose}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{permiso.horas_permiso}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">₡{permiso.monto_permiso}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">{permiso.descripcion_permiso}</td>
                <td className="px-4 py-2 text-[#393E46] dark:text-[#EEEEEE] text-center">
                  {permiso.estado_solicitud_idestado_solicitud === 1
                    ? 'Aceptado'
                    : permiso.estado_solicitud_idestado_solicitud === 2
                      ? 'Rechazado'
                      : 'En Espera'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>



      {/* Modal Crear */}
      {modalCrear && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg max-w-md w-full animate-scale-up">
            <h2 className="text-xl font-bold mb-4 text-[#393E46] dark:text-[#EEEEEE]">Crear Nuevo Permiso</h2>
            <form>
              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Fecha de Permiso:</label>
                <input
                  type="date"
                  value={nuevoPermiso.fecha_permiso}
                  onChange={(e) => setNuevoPermiso({ ...nuevoPermiso, fecha_permiso: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
                />
              </div>

              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Fecha de Solicitud:</label>
                <input
                  type="date"
                  value={nuevoPermiso.fecha_solicitud}
                  readOnly
                  className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
                />
              </div>

              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Con Goce:</label>
                <select
                  value={nuevoPermiso.con_gose}
                  onChange={(e) => setNuevoPermiso({ ...nuevoPermiso, con_gose: parseInt(e.target.value) })}
                  className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
                >
                  <option value="1">Sí</option>
                  <option value="0">No</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Tipo de Permiso:</label>
                <select
                  value={nuevoPermiso.catalogo_permiso_id}
                  onChange={(e) => setNuevoPermiso({ ...nuevoPermiso, catalogo_permiso_id: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
                >
                  <option value="">Seleccione un Tipo de Permiso</option>
                  {catalogoPermisos.map((permiso) => (
                    <option key={permiso.idcatalogo_permiso} value={permiso.idcatalogo_permiso}>
                      {permiso.descripcion_permiso}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Empleado:</label>
                <select
                  value={nuevoPermiso.empleados_idEmpleado}
                  onChange={(e) => setNuevoPermiso({ ...nuevoPermiso, empleados_idEmpleado: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
                >
                  <option value="">Seleccione un Empleado</option>
                  {empleados.length > 0 ? (
                    empleados.map((empleado) => (
                      <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                        {empleado.NombreCompleto}
                      </option>
                    ))
                  ) : (
                    <option value="">Cargando empleados...</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-[#393E46] dark:text-[#EEEEEE]">Horas de Permiso:</label>
                <input
                  type="number"
                  value={nuevoPermiso.horas_permiso}
                  onChange={(e) => setNuevoPermiso({ ...nuevoPermiso, horas_permiso: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2 mb-2 dark:bg-[#393E46] dark:text-[#EEEEEE]"
                />
              </div>

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={() => setModalCrear(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={crearPermiso}
                  className="bg-[#00ADB5] hover:bg-[#00ADB5] text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Alert Modal */}
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

export default SolicitarPermisos;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SolicitarPermisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [catalogoPermisos, setCatalogoPermisos] = useState([]);
  const [modalCrear, setModalCrear] = useState(false);
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

  // Crear nuevo permiso
  const crearPermiso = async () => {
    try {
      await axios.post('http://localhost:3000/api/permisos/', nuevoPermiso);
      setModalCrear(false);
      obtenerPermisos();
    } catch (error) {
      console.error('Error al crear el permiso:', error);
    }
  };

  useEffect(() => {
    obtenerPermisos();
    obtenerEmpleados();
    obtenerCatalogoPermisos();
  }, []);

  return (
    <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Gestión de Permisos</h1>

      <button
        onClick={() => setModalCrear(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 shadow-md transition duration-300 ease-in-out transform hover:scale-105 mx-auto block"
      >
        + Nuevo Permiso
      </button>

      <div className="overflow-hidden rounded-lg shadow-lg">
        <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
          <thead className="bg-gray-100 dark:bg-[#3A3A4D] border-b">
            <tr>
              <th className="px-4 py-2 text-black dark:text-white text-center">ID Empleado</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Nombre</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Permiso</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Solicitud</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Con Goce</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Horas Permiso</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Monto Permiso</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Descripción Permiso</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Estado Solicitud</th>
            </tr>
          </thead>
          <tbody>
            {permisos.map((permiso) => (
              <tr key={`${new Date(permiso.fecha_permiso).toISOString()}-${permiso.idEmpleado}`} className="border-b dark:border-[#4D4D61]">
                <td className="px-4 py-2 text-black dark:text-white text-center">{permiso.idEmpleado}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{permiso.Persona || 'Cargando...'}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(permiso.fecha_permiso).toISOString().split('T')[0]}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(permiso.fecha_solicitud).toISOString().split('T')[0]}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{permiso.Con_Gose}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{permiso.horas_permiso}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{permiso.monto_permiso}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{permiso.descripcion_permiso}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#2D2D3B] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Permiso</h2>
            <form>
              <div>
                <label className="block mb-2">Fecha de Permiso:</label>
                <input
                  type="date"
                  value={nuevoPermiso.fecha_permiso}
                  onChange={(e) => setNuevoPermiso({ ...nuevoPermiso, fecha_permiso: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-2">Fecha de Solicitud:</label>
                <input
                  type="date"
                  value={nuevoPermiso.fecha_solicitud}
                  onChange={(e) => setNuevoPermiso({ ...nuevoPermiso, fecha_solicitud: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-2">Con Goce:</label>
                <select
                  value={nuevoPermiso.con_gose}
                  onChange={(e) => setNuevoPermiso({ ...nuevoPermiso, con_gose: parseInt(e.target.value) })}
                  className="border rounded-lg w-full px-3 py-2"
                >
                  <option value="1">Sí</option>
                  <option value="0">No</option>
                </select>
              </div>

              <div>
                <label className="block mb-2">Tipo de Permiso:</label>
                <select
                  value={nuevoPermiso.catalogo_permiso_id}
                  onChange={(e) => setNuevoPermiso({ ...nuevoPermiso, catalogo_permiso_id: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
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
                <label className="block mb-2">Empleado:</label>
                <select
                  value={nuevoPermiso.empleados_idEmpleado}
                  onChange={(e) => setNuevoPermiso({ ...nuevoPermiso, empleados_idEmpleado: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
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
                <label className="block mb-2">Horas de Permiso:</label>
                <input
                  type="number"
                  value={nuevoPermiso.horas_permiso}
                  onChange={(e) => setNuevoPermiso({ ...nuevoPermiso, horas_permiso: e.target.value })}
                  className="border rounded-lg w-full px-3 py-2"
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
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitarPermisos;

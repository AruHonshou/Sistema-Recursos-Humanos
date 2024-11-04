// src/pages/ManagePermissions.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManagePermissions = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    // Cargar roles
    axios.get('/api/roles').then((res) => setRoles(res.data));
    
    // Cargar lista de páginas desde el backend o un archivo de configuración
    axios.get('/api/pages').then((res) => setPages(res.data));
  }, []);

  useEffect(() => {
    if (selectedRole) {
      // Cargar permisos del rol seleccionado
      axios.get(`/api/role-permissions/${selectedRole}`).then((res) => setPermissions(res.data));
    }
  }, [selectedRole]);

  const togglePermission = (pagePath) => {
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.page_path === pagePath ? { ...perm, has_access: !perm.has_access } : perm
      )
    );
  };

  const savePermissions = () => {
    axios.put('/api/role-permissions', { role_id: selectedRole, permissions })
      .then(() => alert('Permisos actualizados correctamente'))
      .catch((error) => console.error('Error al actualizar permisos', error));
  };

  return (
    <div>
      <h2>Gestión de Permisos por Rol</h2>
      <select onChange={(e) => setSelectedRole(e.target.value)} value={selectedRole || ''}>
        <option value="">Seleccione un rol</option>
        {roles.map((role) => (
          <option key={role.idroles} value={role.idroles}>
            {role.Descripcion_Rol}
          </option>
        ))}
      </select>

      {selectedRole && (
        <>
          <h3>Permisos para el rol: {selectedRole}</h3>
          <div>
            {pages.map((page) => {
              const permission = permissions.find((perm) => perm.page_path === page);
              return (
                <div key={page}>
                  <label>
                    <input
                      type="checkbox"
                      checked={permission?.has_access || false}
                      onChange={() => togglePermission(page)}
                    />
                    {page}
                  </label>
                </div>
              );
            })}
          </div>
          <button onClick={savePermissions}>Guardar Cambios</button>
        </>
      )}
    </div>
  );
};

export default ManagePermissions;

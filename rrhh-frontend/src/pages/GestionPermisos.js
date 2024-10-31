// src/pages/GestionPermisos.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GestionPermisos = () => {
  const [roles, setRoles] = useState([]); // Lista de roles disponibles
  const [selectedRole, setSelectedRole] = useState(null); // Rol seleccionado para gestionar permisos
  const [permissions, setPermissions] = useState([]); // Permisos para el rol seleccionado
  const [loading, setLoading] = useState(false); // Indicador de carga

  // Obtener todos los roles al cargar el componente
  useEffect(() => {
    fetchRoles();
  }, []);

  // Función para obtener los roles desde el backend
  const fetchRoles = async () => {
    try {
      const response = await axios.get('/api/roles'); // Asegúrate que esta ruta obtenga los roles
      setRoles(response.data);
    } catch (error) {
      console.error('Error al obtener los roles:', error);
    }
  };

  // Función para obtener los permisos del rol seleccionado
  const fetchPermissions = async (roleId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/rolePermissions/${roleId}`);
      setPermissions(response.data); // Establece los permisos del rol
      setSelectedRole(roleId);
    } catch (error) {
      console.error('Error al obtener los permisos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Maneja los cambios en los permisos individuales
  const handlePermissionChange = (permissionId, newAccess) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((perm) =>
        perm.id === permissionId ? { ...perm, has_access: newAccess } : perm
      )
    );
  };

  // Guardar cambios en los permisos del rol
  const savePermissions = async () => {
    try {
      const permissionsToSave = permissions.map(({ page_path, has_access }) => ({
        page_path,
        has_access,
      }));

      await axios.put('/api/rolePermissions', {
        role_id: selectedRole,
        permissions: permissionsToSave,
      });
      alert('Permisos guardados exitosamente');
    } catch (error) {
      console.error('Error al guardar los permisos:', error);
      alert('Error al guardar los permisos');
    }
  };

  return (
    <div className="gestion-permisos-container">
      <h2>Gestión de Permisos</h2>
      <div className="role-selection">
        <label>Seleccione un rol:</label>
        <select
          onChange={(e) => fetchPermissions(e.target.value)}
          value={selectedRole || ''}
        >
          <option value="" disabled>Seleccione un rol</option>
          {roles.map((role) => (
            <option key={role.idroles} value={role.idroles}>
              {role.Descripcion_Rol}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Cargando permisos...</p>
      ) : (
        <div className="permissions-list">
          {permissions.map((permission) => (
            <div key={permission.id} className="permission-item">
              <span>{permission.page_path}</span>
              <input
                type="checkbox"
                checked={permission.has_access}
                onChange={(e) =>
                  handlePermissionChange(permission.id, e.target.checked)
                }
              />
            </div>
          ))}
          <button onClick={savePermissions} className="save-button">Guardar Permisos</button>
        </div>
      )}
    </div>
  );
};

export default GestionPermisos;

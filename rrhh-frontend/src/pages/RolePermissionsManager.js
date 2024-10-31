// src/pages/RolePermissionsManager.js
import React, { useState, useEffect } from 'react';

const RolePermissionsManager = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);

    // Cargar roles al cargar el componente
    useEffect(() => {
        fetch('/api/roles')
            .then(res => res.json())
            .then(data => setRoles(data));
    }, []);

    // Cargar permisos para el rol seleccionado
    useEffect(() => {
        if (selectedRole) {
            fetch(`/api/role-permissions/${selectedRole}`)
                .then(res => res.json())
                .then(data => setPermissions(data));
        }
    }, [selectedRole]);

    // Manejar el cambio de rol
    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    // Alternar permiso de una página específica
    const togglePermission = (pagePath) => {
        setPermissions(prev =>
            prev.map(permission =>
                permission.page_path === pagePath
                    ? { ...permission, has_access: !permission.has_access }
                    : permission
            )
        );
    };

    // Guardar permisos actualizados
    const savePermissions = () => {
        fetch('/api/role-permissions', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role_id: selectedRole, permissions }),
        }).then(response => response.ok && alert('Permisos guardados exitosamente'));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Permisos de Roles</h2>
            <div style={{ margin: '20px 0' }}>
                <label>Selecciona un Rol: </label>
                <select onChange={handleRoleChange} value={selectedRole || ''}>
                    <option value="">-- Seleccione un rol --</option>
                    {roles.map(role => (
                        <option key={role.idroles} value={role.idroles}>
                            {role.Descripcion_Rol}
                        </option>
                    ))}
                </select>
            </div>

            {selectedRole && (
                <div style={{ margin: '20px 0' }}>
                    <h3>Configurar Permisos para el Rol Seleccionado</h3>
                    {permissions.map((permission, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                            <input
                                type="checkbox"
                                checked={permission.has_access}
                                onChange={() => togglePermission(permission.page_path)}
                                style={{ marginRight: '10px' }}
                            />
                            <label>{permission.page_path}</label>
                        </div>
                    ))}
                    <button onClick={savePermissions} style={{ marginTop: '20px' }}>Guardar Permisos</button>
                </div>
            )}
        </div>
    );
};

export default RolePermissionsManager;

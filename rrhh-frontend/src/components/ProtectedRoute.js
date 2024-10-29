// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = localStorage.getItem('role');

  // Verificar si el usuario tiene el rol adecuado
  if (!user || !requiredRoles.includes(role)) {
    // Redirigir al menú principal o página de acceso denegado
    return <Navigate to="/menu" />;
  }

  return children;
};

export default ProtectedRoute;

// src/routes/AppRoutes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Perfil from '../pages/Perfil';
import Aguinaldo from '../pages/Aguinaldo';
import Vacaciones from '../pages/Vacaciones';
import Permisos from '../pages/Permisos';
import HorasExtras from '../pages/HorasExtras';
import Planilla from '../pages/Planilla';
import Incapacidades from '../pages/Incapacidades';
import EvaluacionRendimiento from '../pages/EvaluacionRendimiento';
import PagosLiquidacion from '../pages/PagosLiquidacion';
import PuestoLaboral from '../pages/PuestoLaboral';
import Roles from '../pages/Roles';
import Feriados from '../pages/Feriados';
import CambioContrasena from '../pages/CambioContrasena';
import GestionUsuarios from '../pages/GestionUsuarios'; // Nueva página para la gestión de usuarios
import ReportesGestionUsuarios from '../pages/ReportesGestionUsuarios'; // Nueva página para la gestión de usuarios
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<LayoutWithSidebarNavbar />}>
          <Route path="/menu" element={<Dashboard />} />
          <Route path="/perfil" element={<Perfil />} />

          {/* Recursos Humanos */}
          <Route path="/aguinaldo" element={<Aguinaldo />} />
          <Route path="/vacaciones" element={<Vacaciones />} />
          <Route path="/permisos" element={<Permisos />} />
          <Route path="/horas-extras" element={<HorasExtras />} />
          <Route path="/planilla" element={<Planilla />} />
          <Route path="/incapacidades" element={<Incapacidades />} />
          <Route path="/evaluacion-rendimiento" element={<EvaluacionRendimiento />} />
          <Route path="/pagos-liquidacion" element={<PagosLiquidacion />} />

          {/* Mantenimientos*/}
          <Route path="/PuestoLaboral" element={<PuestoLaboral />} />
          <Route path="/Roles" element={<Roles />} />
          <Route path="/Feriados" element={<Feriados />} />
          <Route path="/gestion-usuarios" element={<GestionUsuarios />} />

          {/* Reportes */}
          <Route path="/reporte-gestion-usuarios" element={<ReportesGestionUsuarios />} />
          <Route path="/cambio-contrasena" element={<CambioContrasena />} />
        </Route>
      </Routes>
    </Router>
  );
};

// Layout que incluye Sidebar y Navbar
const LayoutWithSidebarNavbar = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <Navbar />
        <main className="p-4">
          <Routes>
            <Route path="/menu" element={<Dashboard />} />
            <Route path="/perfil" element={<Perfil />} />
            
            {/* Recursos Humanos */}
            <Route path="/aguinaldo" element={<Aguinaldo />} />
            <Route path="/vacaciones" element={<Vacaciones />} />
            <Route path="/permisos" element={<Permisos />} />
            <Route path="/horas-extras" element={<HorasExtras />} />
            <Route path="/planilla" element={<Planilla />} />
            <Route path="/incapacidades" element={<Incapacidades />} />
            <Route path="/evaluacion-rendimiento" element={<EvaluacionRendimiento />} />
            <Route path="/pagos-liquidacion" element={<PagosLiquidacion />} />

            {/* Mantenimientos*/}
            <Route path="/PuestoLaboral" element={<PuestoLaboral />} />
            <Route path="/Roles" element={<Roles />} />
            <Route path="/Feriados" element={<Feriados />} />
            <Route path="/gestion-usuarios" element={<GestionUsuarios />} />

            {/* Reportes */}
            <Route path="/reporte-gestion-usuarios" element={<ReportesGestionUsuarios />} />
            <Route path="/cambio-contrasena" element={<CambioContrasena />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AppRoutes;

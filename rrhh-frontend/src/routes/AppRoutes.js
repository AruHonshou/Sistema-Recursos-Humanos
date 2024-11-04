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
import GestionUsuarios from '../pages/GestionUsuarios';
import ReportesGestionUsuarios from '../pages/ReportesGestionUsuarios';
import IncapacidadesReportes from '../pages/IncapacidadesReportes';
import VacacionesReportes from '../pages/VacacionesReportes';
import PermisosReportes from '../pages/PermisosReportes';
import CambioContrasena from '../pages/CambioContrasena';
import MarcaTiempo from '../pages/MarcaTiempo';
import MarcaTiempoReportes from '../pages/MarcaTiempoReportes';
import HorasExtrasReportes from '../pages/HorasExtrasReportes';
import AguinaldoReportes from '../pages/AguinaldoReportes';
import PlanillaReportes from '../pages/PlanillaReportes.js';
import HistorialPagosPlanilla from '../pages/HistorialPagosPlanilla';
import SolicitarVacacion from '../pages/SolicitarVacacion';
import SolicitarPermisos from '../pages/SolicitarPermisos';
import SolicitarHorasExtras from '../pages/SolicitarHorasExtras';
import ConsultarPlanilla from '../pages/ConsultarPlanilla';
import ConsultarIncapacidad from '../pages/ConsultarIncapacidad';
import ConsultarVacaciones from '../pages/ConsultarVacaciones';
import ConsultarHorasExtras from '../pages/ConsultarHorasExtras';
import ConsultarPlanillaPagada from '../pages/ConsultarPlanillaPagada';
import ConsultarPermisos from '../pages/ConsultarPermisos';
import ConsultarAguinaldo from '../pages/ConsultarAguinaldo';
import ConsultarLiquidacion from '../pages/ConsultarLiquidacion';
import ConsultarMarcaTiempo from '../pages/ConsultarMarcaTiempo';
import LiquidacionReportes from '../pages/LiquidacionReportes';
import MarcaTiempoEmpleados from '../pages/MarcaTiempoEmpleados';
import EvaluacionRendimientoReportes from '../pages/EvaluacionRendimientoReportes';
import ConsultarEvaluacionRendimiento from '../pages/ConsultarEvaluacionRendimiento';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';

const LayoutWithSidebarNavbar = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <Navbar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/menu"
          element={
            <LayoutWithSidebarNavbar>
              <Dashboard />
            </LayoutWithSidebarNavbar>
          }
        />
        <Route
          path="/perfil"
          element={
            <LayoutWithSidebarNavbar>
              <Perfil />
            </LayoutWithSidebarNavbar>
          }
        />

        {/* Recursos Humanos - Solo accesible por Administradores */}
        <Route
          path="/aguinaldo"
          element={
            <ProtectedRoute requiredRoles={['1']}>
              <LayoutWithSidebarNavbar>
                <Aguinaldo />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vacaciones"
          element={
            <ProtectedRoute requiredRoles={['1']}>
              <LayoutWithSidebarNavbar>
                <Vacaciones />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/permisos"
          element={
            <ProtectedRoute requiredRoles={['1']}>
              <LayoutWithSidebarNavbar>
                <Permisos />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/horas-extras"
          element={
            <ProtectedRoute requiredRoles={['1']}>
              <LayoutWithSidebarNavbar>
                <HorasExtras />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/planilla"
          element={
            <ProtectedRoute requiredRoles={['1']}>
              <LayoutWithSidebarNavbar>
                <Planilla />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/incapacidades"
          element={
            <ProtectedRoute requiredRoles={['1']}>
              <LayoutWithSidebarNavbar>
                <Incapacidades />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/evaluacion-rendimiento"
          element={
            <ProtectedRoute requiredRoles={['1']}>
              <LayoutWithSidebarNavbar>
                <EvaluacionRendimiento />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pagos-liquidacion"
          element={
            <ProtectedRoute requiredRoles={['1']}>
              <LayoutWithSidebarNavbar>
                <PagosLiquidacion />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestion-usuarios"
          element={
            <ProtectedRoute requiredRoles={['1']}>
              <LayoutWithSidebarNavbar>
                <GestionUsuarios />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/marca-tiempo"
          element={
            <ProtectedRoute requiredRoles={['1']}>
              <LayoutWithSidebarNavbar>
                <MarcaTiempo />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />

        {/* Mantenimientos - Solo accesible por Administradores */}
        <Route
          path="/PuestoLaboral"
          element={
            <ProtectedRoute requiredRoles={['1']}>
              <LayoutWithSidebarNavbar>
                <PuestoLaboral />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Roles"
          element={
            <ProtectedRoute requiredRoles={['1']}>
              <LayoutWithSidebarNavbar>
                <Roles />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Feriados"
          element={
            <ProtectedRoute requiredRoles={['1']}>
              <LayoutWithSidebarNavbar>
                <Feriados />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />

        {/* Reportes - Accesible por Administradores y Empleadores */}
        <Route
          path="/reporte-gestion-usuarios"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <ReportesGestionUsuarios />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reporte-incapacidades"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <IncapacidadesReportes />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reporte-vacaciones"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <VacacionesReportes />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reporte-permisos"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <PermisosReportes />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reporte-marca-tiempo"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <MarcaTiempoReportes />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reporte-evaluacion-rendimiento"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <EvaluacionRendimientoReportes />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reporte-horas-extras"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <HorasExtrasReportes />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reporte-aguinaldo"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <AguinaldoReportes />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reporte-liquidacion"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <LiquidacionReportes />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reporte-planilla"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <PlanillaReportes />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/historial-pagos-planilla"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <HistorialPagosPlanilla />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cambio-contrasena"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <CambioContrasena />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />

        {/* Solicitudes - Accesible por Administradores y Empleadores */}
        <Route
          path="/solicitar-vacacion"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <SolicitarVacacion />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitar-permiso"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <SolicitarPermisos />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitar-horas-extras"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <SolicitarHorasExtras />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />

        {/* Consultas - Accesible por Administradores y Empleadores */}
        <Route
          path="/consultar-planilla"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <ConsultarPlanilla />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultar-incapacidad"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <ConsultarIncapacidad />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultar-vacaciones"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <ConsultarVacaciones />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultar-horas-extras"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <ConsultarHorasExtras />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultar-planilla-pagada"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <ConsultarPlanillaPagada />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultar-permisos"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <ConsultarPermisos />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultar-aguinaldo"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <ConsultarAguinaldo />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultar-liquidacion"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <ConsultarLiquidacion />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultar-marca-tiempo"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <ConsultarMarcaTiempo />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultar-evaluacion-rendimiento"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <ConsultarEvaluacionRendimiento />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />

        {/* Marcar Asistencia - Accesible por Administradores y Empleadores */}
        <Route
          path="/marca-tiempo-empleados"
          element={
            <ProtectedRoute requiredRoles={['1', '2']}>
              <LayoutWithSidebarNavbar>
                <MarcaTiempoEmpleados />
              </LayoutWithSidebarNavbar>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

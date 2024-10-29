// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [role, setRole] = useState('');

  // Mapear rutas a títulos actualizados
  const titlesMap = {
    '/menu': 'Menu',
    '/aguinaldo': 'Gestionar Aguinaldo',
    '/vacaciones': 'Gestión de Vacaciones',
    '/permisos': 'Gestionar Permisos del Colaborador',
    '/horas-extras': 'Gestionar Horas Extras',
    '/planilla': 'Gestionar Planilla',
    '/incapacidades': 'Gestionar Incapacidades',
    '/evaluacion-rendimiento': 'Gestión de la Evaluación del Rendimiento',
    '/pagos-liquidacion': 'Gestión de Pagos de Liquidación',
    '/PuestoLaboral': 'PuestoLaboral',
    '/Roles': 'Roles',
    '/Feriados': 'Feriados',
    '/gestion-usuarios': 'Gestión de Usuarios',
    '/reporte-gestion-usuarios': 'Reportes de Usuarios',
    '/reporte-incapacidades': 'Reportes de Incapacidades',
    '/reporte-vacaciones': 'Reportes de Vacaciones',
    '/reporte-permisos': 'Reportes de Permisos',
    '/cambio-contrasena': 'Cambio de Contraseña',
    '/perfil': 'Perfil',
    '/reporte-marca-tiempo': 'Reportes de Marca de Tiempo',
    '/marca-tiempo': 'Gestión de Marca de Tiempo'
  };

  // Obtener el título basado en la ruta actual
  const currentTitle = titlesMap[location.pathname] || 'Dashboard';

  useEffect(() => {
    const isDarkModeEnabled = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkModeEnabled);

    // Obtener rol del usuario desde localStorage
    const storedRole = localStorage.getItem('role');
    if (storedRole === '1') {
      setRole('Administrador');
    } else if (storedRole === '2') {
      setRole('Empleador');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkModeState = !darkMode;
    setDarkMode(newDarkModeState);
    if (newDarkModeState) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  // Función para manejar la navegación a la página de perfil
  const handleProfileClick = () => {
    navigate('/perfil');
  };

  // Función para manejar cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
  };

  // Función para alternar el menú de perfil
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <nav className="bg-[#222831] text-[#EEEEEE] px-4 py-3 shadow-md relative">
      <div className="flex items-center justify-between">
        {/* Espacio en blanco para alinear el título en el centro */}
        <div className="flex-1"></div>

        {/* Título dinámico del módulo actual */}
        <h1 className="text-xl font-bold text-[#00ADB5] text-center flex-1">{currentTitle}</h1>

        {/* Mostrar rol del usuario autenticado */}
        <span className="text-[#00ADB5] mr-4">{role}</span>

        {/* Opciones de perfil y dark mode */}
        <div className="flex-1 flex justify-end items-center space-x-4">
          {/* Botón de dark mode */}
          <button onClick={toggleDarkMode} className="text-[#EEEEEE]">
            {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>

          {/* Botón de perfil con menú desplegable */}
          <div className="relative">
            <button onClick={toggleProfileMenu} className="text-[#EEEEEE] focus:outline-none">
              <FiUser size={24} />
            </button>

            {/* Menú desplegable */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#393E46] rounded-md shadow-lg py-2 z-10">
                <button
                  onClick={handleProfileClick}
                  className="block px-4 py-2 text-[#EEEEEE] hover:bg-[#00ADB5] w-full text-left"
                >
                  Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-[#EEEEEE] hover:bg-[#00ADB5] w-full text-left"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiUser } from 'react-icons/fi';
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [nombreCompleto, setNombreCompleto] = useState('');

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
    '/reporte-horas-extras': 'Reportes de Horas Extras',
    '/reporte-aguinaldo': 'Reportes de Aguinaldo',
    '/reporte-liquidacion': 'Reportes de Liquidación',
    '/marca-tiempo': 'Gestión de Marca de Tiempo',
    '/reporte-planilla': 'Reportes de Planilla',
    '/historial-pagos-planilla': 'Historial de Pagos de Planilla',
    '/solicitar-vacacion': 'Solicitar Vacación',
    '/solicitar-permiso': 'Solicitar Permiso',
    '/solicitar-horas-extras': 'Solicitar Horas Extras',
    '/consultar-planilla': 'Consultar Planilla',
    '/consultar-incapacidad': 'Consultar Incapacidad',
    '/consultar-vacaciones': 'Consultar Vacaciones',
    '/consultar-horas-extras': 'Consultar Horas Extras',
    '/consultar-planilla-pagada': 'Consultar Planilla Pagada',
    '/consultar-permisos': 'Consultar Permisos',
    '/consultar-aguinaldo': 'Consultar Aguinaldo',
    '/consultar-liquidacion': 'Consultar Liquidación',
    '/consultar-marca-tiempo': 'Consultar Marca de Tiempo',
  };

  const currentTitle = titlesMap[location.pathname] || 'Dashboard';

  useEffect(() => {
    const isDarkModeEnabled = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkModeEnabled);

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      const { idusuarios } = storedUser;
      axios.get(`http://localhost:3000/api/dashboard/nombre-evaluaciones/${idusuarios}`)
        .then(response => {
          setNombreCompleto(response.data.nombreCompleto);
        })
        .catch(error => {
          console.error('Error fetching full name:', error);
        });
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

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <nav className="bg-[#222831] text-[#EEEEEE] px-4 py-3 shadow-md relative">
      <div className="flex items-center justify-between">
        <div className="flex-1"></div>

        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-[#00ADB5]">{currentTitle}</h1>
        </div>

        <div className="flex items-center space-x-4 flex-1 justify-end">
          <span className="px-3 py-1 rounded-full bg-[#00ADB5] text-[#222831] font-semibold">
            {nombreCompleto}
          </span>

          {/* Dark mode button with hover effect */}
          <button onClick={toggleDarkMode} className="text-[#EEEEEE] hover:bg-[#00ADB5] p-2 rounded">
            {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>

          {/* Profile icon with hover effect */}
          <div className="relative">
            <button onClick={toggleProfileMenu} className="text-[#EEEEEE] hover:bg-[#00ADB5] p-2 rounded focus:outline-none">
              <FiUser size={24} />
            </button>

            {/* Profile menu with hover effect on each option */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#393E46] rounded-md shadow-lg py-2 z-10">
                <button onClick={handleProfileClick} className="block px-4 py-2 text-[#EEEEEE] hover:bg-[#00ADB5] w-full text-left">
                  Perfil
                </button>
                <button onClick={handleLogout} className="block px-4 py-2 text-[#EEEEEE] hover:bg-[#00ADB5] w-full text-left">
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
// src/components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AiOutlineUser, AiOutlineDollarCircle, AiOutlineClockCircle, AiOutlineSolution, AiOutlineLogout } from 'react-icons/ai';
import { FaRegCalendarAlt, FaRegFileAlt, FaRegListAlt } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import vraiLogo from '../images/vraiLogo.png';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showRHSubmenu, setShowRHSubmenu] = useState(false);
  const [showCRSubmenu, setShowCRSubmenu] = useState(false);
  const [showReporteSubmenu, setShowReporteSubmenu] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el rol del usuario desde el localStorage
    const storedRole = localStorage.getItem('role');
    if (storedRole === '1') {
      setRole('Administrador');
    } else if (storedRole === '2') {
      setRole('Empleador');
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className={`min-h-screen bg-[#222831] p-4 flex flex-col ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
      {/* Botón para abrir/cerrar el sidebar */}
      <button onClick={toggleSidebar} className="absolute top-4 left-4 bg-[#393E46] text-[#EEEEEE] p-2 rounded-md mb-4">
        <FiMenu className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={24} />
      </button>

      <div className={`mb-6 text-center ${isOpen ? 'block' : 'hidden'}`}>
        <img
          src={vraiLogo}
          alt="Vrai Logo"
          className="mx-auto w-30 h-30 object-contain cursor-pointer"
          onClick={() => navigate('/menu')}
        />
      </div>

      {/* Recursos Humanos */}
      {role === 'Administrador' && (
        <>
          <button
            onClick={() => setShowRHSubmenu(!showRHSubmenu)}
            className="text-[#00ADB5] font-bold mb-2 w-full text-left flex items-center"
          >
            <AiOutlineUser className="mr-2" size={24} />
            {isOpen && <span>Recursos Humanos</span>}
          </button>

          {showRHSubmenu && (
            <ul className="space-y-2">
              <li>
                <NavLink to="/aguinaldo" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <AiOutlineDollarCircle className="mr-2" size={24} />
                  {isOpen && <span>Gestionar Aguinaldo</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/vacaciones" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <FaRegCalendarAlt className="mr-2" size={24} />
                  {isOpen && <span>Gestión de Vacaciones</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/permisos" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <AiOutlineSolution className="mr-2" size={24} />
                  {isOpen && <span>Gestionar Permisos del Colaborador</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/horas-extras" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <AiOutlineClockCircle className="mr-2" size={24} />
                  {isOpen && <span>Gestionar Horas Extras</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/planilla" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <AiOutlineDollarCircle className="mr-2" size={24} />
                  {isOpen && <span>Gestionar Planilla</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/incapacidades" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <FaRegFileAlt className="mr-2" size={24} />
                  {isOpen && <span>Gestionar Incapacidades</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/evaluacion-rendimiento" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <FaRegListAlt className="mr-2" size={24} />
                  {isOpen && <span>Gestión de la Evaluación del Rendimiento</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/pagos-liquidacion" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <AiOutlineUser className="mr-2" size={24} />
                  {isOpen && <span>Gestión de Pagos de Liquidación</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/gestion-usuarios" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <AiOutlineUser className="mr-2" size={24} />
                  {isOpen && <span>Gestión de Usuarios</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/marca-tiempo" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <AiOutlineClockCircle className="mr-2" size={24} />
                  {isOpen && <span>Gestión de Marca de Tiempo</span>}
                </NavLink>
              </li>
            </ul>
          )}
        </>
      )}

      {/* Mantenimientos */}
      {role === 'Administrador' && (
        <>
          <button
            onClick={() => setShowCRSubmenu(!showCRSubmenu)}
            className="text-[#00ADB5] font-bold mb-2 mt-4 w-full text-left flex items-center"
          >
            <FaRegListAlt className="mr-2" size={24} />
            {isOpen && <span>Mantenimientos</span>}
          </button>

          {showCRSubmenu && (
            <ul className="space-y-2">
              <li>
                <NavLink to="/PuestoLaboral" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <AiOutlineUser className="mr-2" size={24} />
                  {isOpen && <span>PuestoLaboral</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/Roles" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <FaRegListAlt className="mr-2" size={24} />
                  {isOpen && <span>Roles</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/Feriados" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <FaRegListAlt className="mr-2" size={24} />
                  {isOpen && <span>Feriados</span>}
                </NavLink>
              </li>
            </ul>
          )}
        </>
      )}

      {/* Reportes */}
      {(role === 'Administrador' || role === 'Empleador') && (
        <>
          <button
            onClick={() => setShowReporteSubmenu(!showReporteSubmenu)}
            className="text-[#00ADB5] font-bold mb-2 mt-4 w-full text-left flex items-center"
          >
            <AiOutlineUser className="mr-2" size={24} />
            {isOpen && <span>Reportes</span>}
          </button>

          {showReporteSubmenu && (
            <ul className="space-y-2">
              <li>
                <NavLink to="/reporte-gestion-usuarios" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <AiOutlineUser className="mr-2" size={24} />
                  {isOpen && <span>Reportes de Usuarios</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/reporte-incapacidades" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <AiOutlineUser className="mr-2" size={24} />
                  {isOpen && <span>Reportes de Incapacidades</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/reporte-vacaciones" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <AiOutlineUser className="mr-2" size={24} />
                  {isOpen && <span>Reportes de Vacaciones</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/reporte-permisos" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <AiOutlineUser className="mr-2" size={24} />
                  {isOpen && <span>Reportes de Permisos Solicitados</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/reporte-marca-tiempo" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <AiOutlineUser className="mr-2" size={24} />
                  {isOpen && <span>Reportes de Marca de Tiempo</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/cambio-contrasena" className="text-[#EEEEEE] bg-[#393E46] hover:bg-[#00ADB5] transition-all block p-3 rounded-lg flex items-center">
                  <AiOutlineUser className="mr-2" size={24} />
                  {isOpen && <span>Cambio de Contraseña</span>}
                </NavLink>
              </li>
            </ul>
          )}
        </>
      )}

      {/* Botón de Cerrar Sesión */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-[#EEEEEE] p-3 rounded-lg mt-auto flex items-center hover:bg-red-600 transition-all"
      >
        <AiOutlineLogout className="mr-2" size={24} />
        {isOpen && <span>Cerrar Sesión</span>}
      </button>
    </div>
  );
};

export default Sidebar;

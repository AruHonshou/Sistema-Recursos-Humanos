// src/components/Sidebar.js
import React, { useState } from 'react'; // Importamos React y useState
import { NavLink, useNavigate } from 'react-router-dom'; // Importamos NavLink y useNavigate para la navegación
import { AiOutlineUser, AiOutlineDollarCircle, AiOutlineClockCircle, AiOutlineSolution, AiOutlineLogout } from 'react-icons/ai'; // Importamos íconos de usuario, equipo, pagos, etc.
import { FaRegCalendarAlt, FaRegFileAlt, FaRegListAlt } from 'react-icons/fa'; // Importamos otros íconos
import { FiMenu } from 'react-icons/fi'; // Importamos el ícono del menú
import vraiLogo from '../images/vraiLogo.png'; // Importamos el logo de Vrai

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // Estado para manejar si el sidebar está abierto o cerrado
  const [showRHSubmenu, setShowRHSubmenu] = useState(false); // Estado para mostrar/ocultar submenú de Recursos Humanos
  const [showCRSubmenu, setShowCRSubmenu] = useState(false); // Estado para mostrar/ocultar submenú de Consultas y Reportes
  const [showSeguridadSubmenu, setShowSeguridadSubmenu] = useState(false); // Estado para mostrar/ocultar submenú de Seguridad
  const navigate = useNavigate(); // Hook para la redirección

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Cambia el estado de apertura del sidebar
  };

  const handleLogout = () => {
    navigate('/'); // Redirigir al login
  };

  return (
    <div className={`h-screen bg-[#222831] p-4 flex flex-col ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
      
      {/* Botón para abrir/cerrar el sidebar en la izquierda */}
      <button onClick={toggleSidebar} className="absolute top-4 left-4 bg-gray-700 text-white p-2 rounded-md mb-4">
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

      {/* Recursos Humanos con ícono */}
      <button
        onClick={() => setShowRHSubmenu(!showRHSubmenu)}
        className="text-[#00ADB5] font-bold mb-4 w-full text-left flex items-center"
      >
        <AiOutlineUser className="mr-2" size={24} /> {/* Ícono de Recursos Humanos */}
        {isOpen && <span>Recursos Humanos</span>}
      </button>
      {showRHSubmenu && (
        <ul className="space-y-2">
          <li>
            <NavLink to="/aguinaldo" className="text-[#EEEEEE] hover:bg-[#00ADB5] block p-2 rounded-md flex items-center">
              <AiOutlineDollarCircle className="mr-2" size={24} /> {/* Ícono de aguinaldo */}
              {isOpen && <span>Gestionar Aguinaldo</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/vacaciones" className="text-[#EEEEEE] hover:bg-[#00ADB5] block p-2 rounded-md flex items-center">
              <FaRegCalendarAlt className="mr-2" size={24} /> {/* Ícono de vacaciones */}
              {isOpen && <span>Gestión de Vacaciones</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/permisos" className="text-[#EEEEEE] hover:bg-[#00ADB5] block p-2 rounded-md flex items-center">
              <AiOutlineSolution className="mr-2" size={24} /> {/* Ícono de permisos */}
              {isOpen && <span>Gestionar Permisos del Colaborador</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/horas-extras" className="text-[#EEEEEE] hover:bg-[#00ADB5] block p-2 rounded-md flex items-center">
              <AiOutlineClockCircle className="mr-2" size={24} /> {/* Ícono de horas extras */}
              {isOpen && <span>Gestionar Horas Extras</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/planilla" className="text-[#EEEEEE] hover:bg-[#00ADB5] block p-2 rounded-md flex items-center">
              <AiOutlineDollarCircle className="mr-2" size={24} /> {/* Ícono de planilla */}
              {isOpen && <span>Gestionar Planilla</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/incapacidades" className="text-[#EEEEEE] hover:bg-[#00ADB5] block p-2 rounded-md flex items-center">
              <FaRegFileAlt className="mr-2" size={24} /> {/* Ícono de incapacidades */}
              {isOpen && <span>Gestionar Incapacidades</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/evaluacion-rendimiento" className="text-[#EEEEEE] hover:bg-[#00ADB5] block p-2 rounded-md flex items-center">
              <FaRegListAlt className="mr-2" size={24} /> {/* Ícono de evaluación */}
              {isOpen && <span>Gestión de la Evaluación del Rendimiento</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/pagos-liquidacion" className="text-[#EEEEEE] hover:bg-[#00ADB5] block p-2 rounded-md flex items-center">
              <AiOutlineUser className="mr-2" size={24} /> {/* Ícono de pagos */}
              {isOpen && <span>Gestión de Pagos de Liquidación</span>}
            </NavLink>
          </li>
        </ul>
      )}

      {/* Consultas y Reportes con ícono */}
      <button
        onClick={() => setShowCRSubmenu(!showCRSubmenu)}
        className="text-[#00ADB5] font-bold mb-4 w-full text-left flex items-center"
      >
        <FaRegListAlt className="mr-2" size={24} /> {/* Ícono de Consultas y Reportes */}
        {isOpen && <span>Consultas y Reportes</span>}
      </button>
      {showCRSubmenu && (
        <ul className="space-y-2">
          <li>
            <NavLink to="/consultas" className="text-[#EEEEEE] hover:bg-[#00ADB5] block p-2 rounded-md flex items-center">
              <AiOutlineUser className="mr-2" size={24} /> {/* Ícono de consultas */}
              {isOpen && <span>Consultas</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/reportes" className="text-[#EEEEEE] hover:bg-[#00ADB5] block p-2 rounded-md flex items-center">
              <FaRegListAlt className="mr-2" size={24} /> {/* Ícono de reportes */}
              {isOpen && <span>Reportes</span>}
            </NavLink>
          </li>
        </ul>
      )}

      {/* Seguridad con ícono */}
      <button
        onClick={() => setShowSeguridadSubmenu(!showSeguridadSubmenu)}
        className="text-[#00ADB5] font-bold mb-4 w-full text-left flex items-center"
      >
        <AiOutlineUser className="mr-2" size={24} /> {/* Ícono de Seguridad */}
        {isOpen && <span>Seguridad</span>}
      </button>
      {showSeguridadSubmenu && (
        <ul className="space-y-2">
          <li>
            <NavLink to="/gestion-usuarios" className="text-[#EEEEEE] hover:bg-[#00ADB5] block p-2 rounded-md flex items-center">
              <AiOutlineUser className="mr-2" size={24} /> {/* Ícono de gestión de usuarios */}
              {isOpen && <span>Gestión de Usuarios</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/cambio-contrasena" className="text-[#EEEEEE] hover:bg-[#00ADB5] block p-2 rounded-md flex items-center">
              <AiOutlineUser className="mr-2" size={24} /> {/* Ícono de cambio de contraseña */}
              {isOpen && <span>Cambio de Contraseña</span>}
            </NavLink>
          </li>
        </ul>
      )}

      {/* Botón de Cerrar Sesión */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded-md mt-auto flex items-center"
      >
        <AiOutlineLogout className="mr-2" size={24} /> {/* Ícono de cerrar sesión */}
        {isOpen && <span>Cerrar Sesión</span>}
      </button>
    </div>
  );
};

export default Sidebar;

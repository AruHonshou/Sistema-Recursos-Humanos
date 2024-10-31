// src/pages/Perfil.js
import React, { useEffect, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Perfil = () => {
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    // Obtener los datos del usuario desde el localStorage
    const userData = JSON.parse(localStorage.getItem('user'));

    if (userData) {
      setUserId(userData.idusuarios || '');
      setUsername(userData.Nombre_Usuario || '');
      setPassword(userData.Contrasena || '');
      setRole(userData.roles_idroles === '1' ? 'Administrador' : 'Empleador');
    }
  }, []);

  return (
    <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Editar Perfil</h1>
      <form>
        <div className="mb-4">
          <label className="block text-black dark:text-white mb-2" htmlFor="user-id">ID Usuario</label>
          <input 
            type="text" 
            id="user-id" 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" 
            value={userId}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-black dark:text-white mb-2" htmlFor="username">Nombre de Usuario</label>
          <input 
            type="text" 
            id="username" 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" 
            value={username}
            readOnly
          />
        </div>
        <div className="mb-4 relative">
          <label className="block text-black dark:text-white mb-2" htmlFor="password">Contraseña</label>
          <input 
            type={showPassword ? 'text' : 'password'} 
            id="password" 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" 
            value={password}
            readOnly
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-[2px] text-black dark:text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-black dark:text-white mb-2" htmlFor="role">Rol</label>
          <input 
            type="text" 
            id="role" 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" 
            value={role}
            readOnly
          />
        </div>
      </form>
    </div>
  );
};

export default Perfil;

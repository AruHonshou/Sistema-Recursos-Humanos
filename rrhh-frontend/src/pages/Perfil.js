import React from 'react';

const Perfil = () => {
  return (
    <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Editar Perfil</h1>
      <form>
        <div className="mb-4">
          <label className="block text-black dark:text-white mb-2" htmlFor="username">Nombre de Usuario</label>
          <input 
            type="text" 
            id="username" 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" 
            placeholder="Introduce tu nombre de usuario" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-black dark:text-white mb-2" htmlFor="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" 
            placeholder="Introduce tu correo" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-black dark:text-white mb-2" htmlFor="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" 
            placeholder="Introduce tu contraseña" 
          />
        </div>
        <button className="bg-blue-500 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default Perfil;

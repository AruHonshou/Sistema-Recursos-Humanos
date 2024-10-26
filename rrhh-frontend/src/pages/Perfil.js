import React from 'react';

const Perfil = () => {
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
            placeholder="Introduce tu ID de usuario" 
          />
        </div>
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
          <label className="block text-black dark:text-white mb-2" htmlFor="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" 
            placeholder="Introduce tu contraseña" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-black dark:text-white mb-2" htmlFor="role">Rol</label>
          <input 
            type="text" 
            id="role" 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" 
            placeholder="Introduce tu rol" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-black dark:text-white mb-2" htmlFor="new-password">Cambiar Contraseña</label>
          <input 
            type="password" 
            id="new-password" 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" 
            placeholder="Introduce tu nueva contraseña" 
          />
          <button className="mt-2 bg-blue-500 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-1 px-4 rounded-md transition duration-300">
            Cambiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Perfil;

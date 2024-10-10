import React from 'react'; // Importamos la librería React

// Definimos el componente funcional Dashboard
const Dashboard = () => {
  return (
    // Contenedor principal del Dashboard
    // min-h-screen: Mínimo ocupa el 100% de la altura de la pantalla
    // bg-[#f9f9f9]: Color de fondo en modo claro
    // dark:bg-[#1E1E2F]: Color de fondo en modo oscuro
    // p-6: Padding de 6 (1.5 rem o 24px) alrededor del contenedor
    <div className="h-screen bg-[#f9f9f9] dark:bg-[#1E1E2F] p-6">
      {/* Título principal del Dashboard */}
      {/* text-3xl: Tamaño de fuente 3xl
          font-bold: Negrita
          mb-6: Margen inferior de 6 (1.5 rem o 24px)
          text-black: Color de texto negro en modo claro
          dark:text-white: Color de texto blanco en modo oscuro */}
      <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">
        Bienvenido al Dashboard
      </h1>

      {/* Contenedor para las estadísticas en forma de grid */}
      {/* grid: Utiliza el sistema de grid de Tailwind CSS
          grid-cols-1: Una columna por defecto
          md:grid-cols-2: Dos columnas en pantallas medianas (≥768px)
          lg:grid-cols-3: Tres columnas en pantallas grandes (≥1024px)
          gap-6: Espaciado de 6 (1.5 rem o 24px) entre las columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta para mostrar total de usuarios */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          {/* Título de la tarjeta */}
          {/* text-xl: Tamaño de fuente xl
              font-bold: Negrita
              dark:text-white: Color de texto blanco en modo oscuro */}
          <h2 className="text-xl font-bold dark:text-white">Total de Usuarios</h2>
          {/* Texto del contenido */}
          {/* text-black: Color de texto negro en modo claro
              dark:text-gray-300: Color de texto gris en modo oscuro */}
          <p className="text-black dark:text-gray-300">25</p>
        </div>

        {/* Tarjeta para mostrar total de empleados */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          {/* Título de la tarjeta */}
          <h2 className="text-xl font-bold dark:text-white">Total de Empleados</h2>
          {/* Texto del contenido */}
          <p className="text-black dark:text-gray-300">200</p>
        </div>
      </div>
    </div>
  );
};

// Exportamos el componente para que pueda ser utilizado en otras partes de la aplicación
export default Dashboard;

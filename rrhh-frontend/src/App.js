import React, { useEffect } from 'react';  // Eliminamos 'useState'
import AppRoutes from './routes/AppRoutes';

function App() {
  useEffect(() => {
    const isDarkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (isDarkModeEnabled) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark'); // Aplicar dark mode al body también
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  return <AppRoutes />;
}

export default App;

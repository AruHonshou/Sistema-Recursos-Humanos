// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import vraiLogo from '../images/vraiLogo.png';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Evitar navegación hacia atrás o adelante
  useEffect(() => {
    const preventNavigation = (event) => {
      event.preventDefault();
      window.history.pushState(null, '', window.location.href);
    };

    // Agregar estado al historial y escuchar eventos de popstate
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', preventNavigation);

    return () => {
      window.removeEventListener('popstate', preventNavigation);
    };
  }, []);

  const handleSignIn = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      setError('Por favor, complete ambos campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/usuarios/autenticar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Nombre_Usuario: username, Contrasena: password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user data and role in localStorage, including Nombre_Usuario and Contrasena
        localStorage.setItem('user', JSON.stringify({ ...data, Nombre_Usuario: username, Contrasena: password }));
        localStorage.setItem('role', data.roles_idroles);

        setError('');
        navigate('/menu');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Error de conexión. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#222831]">
      <div className="bg-[#393E46] p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-6 text-center">
          <img
            src={vraiLogo}
            alt="Vrai Logo"
            className="mx-auto mb-4 w-100 h-100 object-contain"
          />
        </div>

        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label className="block text-[#00ADB5] text-sm font-bold mb-2" htmlFor="username">
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              placeholder="Ingrese su nombre de usuario"
              className="w-full px-3 py-2 placeholder-[#EEEEEE] border border-[#00ADB5] 
              rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#393E46] 
              text-[#EEEEEE]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-6 relative">
            <label className="block text-[#00ADB5] text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingrese su contraseña"
              className="w-full px-3 py-2 placeholder-[#EEEEEE] border border-[#00ADB5] 
              rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#393E46] 
              text-[#EEEEEE]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-[#EEEEEE]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
            </button>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            type="submit"
            className={`w-full bg-[#00ADB5] text-[#EEEEEE] font-bold py-2 px-4 
            rounded-md hover:bg-[#00ADB5] transition duration-300 ${!username || !password ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!username || !password}
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import vraiLogo from '../images/vraiLogo.png';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = (event) => {
    event.preventDefault();

    // Validación simple
    if (!email || !password) {
      setError('Por favor, complete ambos campos.');
      return;
    }

    // Redirigir a la página del menú
    setError('');
    navigate('/menu');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#222831]"> {/* Color de fondo */}
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
            <label className="block text-[#00ADB5] text-sm font-bold mb-2" htmlFor="email"> {/* Color del texto */}
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="Ingrese su correo"
              className="w-full px-3 py-2 placeholder-[#EEEEEE] border border-[#00ADB5] 
              rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#393E46] 
              text-[#EEEEEE]" // Color de fondo del input y texto
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Actualiza el estado del email
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#00ADB5] text-sm font-bold mb-2" htmlFor="password"> {/* Color del texto */}
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Ingrese su contraseña"
              className="w-full px-3 py-2 placeholder-[#EEEEEE] border border-[#00ADB5] 
              rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#393E46] 
              text-[#EEEEEE]" // Color de fondo del input y texto
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Actualiza el estado de la contraseña
            />
          </div>

          {/* Mensaje de error */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            type="submit"
            className={`w-full bg-[#00ADB5] text-[#EEEEEE] font-bold py-2 px-4 
            rounded-md hover:bg-[#00ADB5] transition duration-300 ${!email || !password ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!email || !password} // Deshabilita el botón si no hay email o contraseña
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

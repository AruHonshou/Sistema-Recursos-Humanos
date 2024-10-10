import axios from 'axios';

// Configura la URL base del backend
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Cambia esto si tu backend está en otra URL
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;

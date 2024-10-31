import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ConsultarIncapacidades = () => {
  const [incapacidades, setIncapacidades] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [nombres, setNombres] = useState({});
  const [idEmpleado, setIdEmpleado] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [catalogos, setCatalogos] = useState([]);

  const obtenerIncapacidades = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/incapacidad');
      if (response && response.data) {
        setIncapacidades(response.data);
      } else {
        console.error('La respuesta no tiene datos:', response);
      }
    } catch (error) {
      console.error('Error al obtener las incapacidades:', error);
    }
  };

  const obtenerCatalogos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/catalogoIncapacidades');
      setCatalogos(response.data);
    } catch (error) {
      console.error('Error al obtener el catálogo de incapacidades:', error);
    }
  };

  // Obtener empleados
const obtenerEmpleados = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const idusuario = user ? user.idusuarios : null;

        if (idusuario) {
            const response = await axios.get(`http://localhost:3000/api/empleados/usuario/${idusuario}`);
            setEmpleados([response.data]); // Wrap the object in an array to map over it in the display
            setIdEmpleado(response.data.idEmpleado); // Set default selected employee
        } else {
            console.error('Usuario no encontrado en el local storage');
        }
    } catch (error) {
        console.error('Error al obtener los empleados:', error);
    }
};


  const fetchNombreEmpleado = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/datosPersona/${id}`);
      return response.data[0][0].Nombre;
    } catch (error) {
      console.error(`Error fetching nombre for ID ${id}:`, error);
      return '';
    }
  };

  const obtenerDescripcionIncapacidad = (idCatalogo) => {
    const catalogo = catalogos.find((cat) => cat.idCatalogo_Incapacidad === idCatalogo);
    return catalogo ? catalogo.Descripcion_Catalogo_Incapacidad : 'Desconocido';
  };

  useEffect(() => {
    obtenerIncapacidades();
    obtenerCatalogos();
    obtenerEmpleados();
  }, []);

  useEffect(() => {
    const fetchNombres = async () => {
      const nombresObj = {};
      for (const incapacidad of incapacidades) {
        const nombre = await fetchNombreEmpleado(incapacidad.empleados_idEmpleado);
        nombresObj[incapacidad.empleados_idEmpleado] = nombre;
      }
      setNombres(nombresObj);
    };

    if (incapacidades.length > 0) {
      fetchNombres();
    }
  }, [incapacidades]);

  const incapacidadesFiltradas = incapacidades.filter((incapacidad) => {
    const fechaIncapacidad = new Date(incapacidad.Fecha_Inicio).getTime();
    const inicio = fechaInicio ? new Date(fechaInicio).getTime() : null;
    const fin = fechaFin ? new Date(fechaFin).getTime() : null;
    const empleadoMatch = idEmpleado === '' || incapacidad.empleados_idEmpleado === parseInt(idEmpleado);

    const fechaMatch =
      (!inicio || fechaIncapacidad >= inicio) &&
      (!fin || fechaIncapacidad <= fin);

    return empleadoMatch && fechaMatch;
  });

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID Empleado', 'Nombre', 'Fecha Inicio', 'Fecha Fin', 'Descripción', 'Días', 'Monto Deducción', 'Tipo Incapacidad']],
      body: incapacidadesFiltradas.map((incapacidad) => [
        incapacidad.empleados_idEmpleado,
        nombres[incapacidad.empleados_idEmpleado] || 'Cargando...',
        new Date(incapacidad.Fecha_Inicio).toLocaleDateString('es-ES'),
        new Date(incapacidad.Fecha_Fin).toLocaleDateString('es-ES'),
        incapacidad.Descripcion_Incapacidades,
        incapacidad.Cantidad_Dias,
        `₡${incapacidad.Monto_Deduccion}`,
        obtenerDescripcionIncapacidad(incapacidad.catalogo_incapacidad_idCatalogo_Incapacidad)
      ]),
    });
    doc.save('incapacidades.pdf');
  };

  const generarExcel = () => {
    const datosParaExcel = incapacidadesFiltradas.map((incapacidad) => ({
      'ID Empleado': incapacidad.empleados_idEmpleado,
      'Nombre': nombres[incapacidad.empleados_idEmpleado] || 'Cargando...',
      'Fecha Inicio': new Date(incapacidad.Fecha_Inicio).toLocaleDateString('es-ES'),
      'Fecha Fin': new Date(incapacidad.Fecha_Fin).toLocaleDateString('es-ES'),
      'Descripción': incapacidad.Descripcion_Incapacidades,
      'Días': incapacidad.Cantidad_Dias,
      'Monto Deducción': `₡${incapacidad.Monto_Deduccion}`,
      'Tipo Incapacidad': obtenerDescripcionIncapacidad(incapacidad.catalogo_incapacidad_idCatalogo_Incapacidad)
    }));

    const ws = XLSX.utils.json_to_sheet(datosParaExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Incapacidades');
    XLSX.writeFile(wb, 'incapacidades.xlsx');
  };

  return (
    <div className="p-6 bg-[#f9f9f9] dark:bg-[#1E1E2F] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">Reporte de Incapacidades</h1>

      <div className="flex justify-center mb-4 gap-4">
    <div className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md">
        <label className="block mb-1 text-center">Empleado</label>
        <input
            type="text"
            value={empleados.length > 0 ? empleados[0].NombreCompleto : 'Cargando...'}
            readOnly
            className="text-center bg-white dark:bg-[#2D2D3B] border-none cursor-default"
        />
    </div>

    <input
        type="date"
        value={fechaInicio}
        onChange={(e) => setFechaInicio(e.target.value)}
        className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md"
    />
    <input
        type="date"
        value={fechaFin}
        onChange={(e) => setFechaFin(e.target.value)}
        className="border rounded-lg px-4 py-2 bg-white dark:bg-[#2D2D3B] text-black dark:text-white shadow-md"
    />
</div>


      <div className="flex justify-between mb-4 gap-4">
        <button
          onClick={generarPDF}
          className="bg-[#222831] text-[#00ADB5] py-2 px-6 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 hover:bg-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
        >
          Exportar a PDF
        </button>
        <button
          onClick={generarExcel}
          className="bg-[#222831] text-[#00ADB5] py-2 px-6 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 hover:bg-[#393E46] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
        >
          Exportar a Excel
        </button>
      </div>

      <div className="overflow-hidden rounded-lg shadow-lg">
        <table className="min-w-full bg-white dark:bg-[#2D2D3B] border rounded-md shadow-md">
          <thead className="bg-gray-100 dark:bg-[#3A3A4D] border-b">
            <tr>
              <th className="px-4 py-2 text-black dark:text-white text-center">ID Empleado</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Nombre</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Inicio</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Fecha Fin</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Descripción</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Días</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Monto Deducción</th>
              <th className="px-4 py-2 text-black dark:text-white text-center">Tipo Incapacidad</th>
            </tr>
          </thead>
          <tbody>
            {incapacidadesFiltradas.map((incapacidad) => (
              <tr key={`${incapacidad.Fecha_Inicio}-${incapacidad.empleados_idEmpleado}`} className="border-b dark:border-[#4D4D61]">
                <td className="px-4 py-2 text-black dark:text-white text-center">{incapacidad.empleados_idEmpleado}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{nombres[incapacidad.empleados_idEmpleado] || 'Cargando...'}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(incapacidad.Fecha_Inicio).toLocaleDateString('es-ES')}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{new Date(incapacidad.Fecha_Fin).toLocaleDateString('es-ES')}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{incapacidad.Descripcion_Incapacidades}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{incapacidad.Cantidad_Dias}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">₡{incapacidad.Monto_Deduccion}</td>
                <td className="px-4 py-2 text-black dark:text-white text-center">{obtenerDescripcionIncapacidad(incapacidad.catalogo_incapacidad_idCatalogo_Incapacidad)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsultarIncapacidades;

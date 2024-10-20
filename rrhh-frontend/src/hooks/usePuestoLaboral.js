import { useState, useEffect } from 'react';
import axios from 'axios';

const usePuestoLaboral = () => {
    const [puestos, setPuestos] = useState([]);
    const [error, setError] = useState('');

    const obtenerPuestos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/puesto-laboral');
            const puestos = response.data[0];
            console.log('Puestos obtenidos:', puestos);
            setPuestos(puestos); // Asegúrate de que aquí los puestos tienen idpuesto_laboral
        } catch (error) {
            console.error('Error al obtener los puestos:', error);
        }
    };

    const validarPuesto = (nombre, salario) => {
        const nombreRegex = /^[A-Z][a-zA-Z\s]*$/; // Comienza con mayúscula y solo letras
        const salarioRegex = /^[0-9]*\.?[0-9]+$/; // Solo números y punto decimal
        return nombreRegex.test(nombre) && salarioRegex.test(salario);
    };

    const crearPuesto = async (nuevoPuesto) => {
        if (!validarPuesto(nuevoPuesto.Nombre_Puesto, nuevoPuesto.Salario_Puesto)) {
            setError('El nombre debe empezar con mayúscula y el salario solo puede contener números.');
            return false; // Indica que la validación falló
        }

        try {
            await axios.post('http://localhost:3000/api/puesto-laboral', nuevoPuesto);
            obtenerPuestos();
            setError(''); // Limpiar el mensaje de error
            return true; // Indica que la creación fue exitosa
        } catch (error) {
            setError('Error al crear el puesto laboral.');
            console.error('Error al crear el puesto laboral:', error);
            return false; // Indica que hubo un error
        }
    };

    const actualizarPuesto = async (id, puestoActualizar) => {
        if (!validarPuesto(puestoActualizar.Nombre_Puesto, puestoActualizar.Salario_Puesto)) {
            setError('El nombre debe empezar con mayúscula y el salario solo puede contener números.');
            return false; // Indica que la validación falló
        }

        try {
            await axios.put(`http://localhost:3000/api/puesto-laboral/${id}`, puestoActualizar);
            obtenerPuestos();
            setError(''); // Limpiar el mensaje de error
            return true; // Indica que la actualización fue exitosa
        } catch (error) {
            setError('Error al actualizar el puesto laboral.');
            console.error('Error al actualizar el puesto laboral:', error);
            return false; // Indica que hubo un error
        }
    };

    const eliminarPuesto = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/puesto-laboral/${id}`);
            obtenerPuestos();
        } catch (error) {
            setError('Error al eliminar el puesto laboral.');
            console.error('Error al eliminar el puesto laboral:', error);
        }
    };

    const buscarPorId = async (id) => {
        if (!id) {
            // Si el campo de búsqueda está vacío, recupera todos los puestos.
            obtenerPuestos();
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3000/api/puesto-laboral/${id}`);
            setPuestos(response.data ? [response.data] : []); // Si hay un resultado, lo pone en un array.
            setError(''); // Limpiar cualquier error anterior
        } catch (error) {
            setError('No se encontró el puesto laboral con ese ID.');
            console.error('Error al buscar el puesto laboral:', error);
        }
    };

    useEffect(() => {
        obtenerPuestos();
    }, []);

    return {
        puestos,
        error,
        crearPuesto,
        actualizarPuesto,
        eliminarPuesto,
        buscarPorId,
    };
};

export default usePuestoLaboral;
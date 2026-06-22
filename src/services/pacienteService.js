import api from './api'; // 👈 Instancia unificada apuntando al API Gateway (Puerto 8080)

export const obtenerMisConsultas = async (rut) => {
  try {
    // ✅ CORREGIDO PARA EL API GATEWAY: Añadimos explícitamente el prefijo '/bff'.
    // Axios construirá la ruta exacta que tu application.yml sabe enrutar:
    // http://localhost:8080/api/v1/bff/paciente/consultas/${rut}
    // El Gateway la recibirá, validará la seguridad y la mandará al BFF (8081) internamente.
    const response = await api.get(`/bff/paciente/consultas/${rut}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error en pacienteService al mapear consultas para el RUT ${rut}:`, error);
    throw error;
  }
};
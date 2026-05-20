import api from './api'; // 👈 Instancia unificada apuntando al API Gateway (Puerto 8080)

export const getResumenDashboard = async () => {
  try {
    // ✅ CORREGIDO PARA EL GATEWAY: Añadimos el prefijo '/bff'.
    // Axios construirá la ruta exacta requerida por tu application.yml:
    // http://localhost:8080/api/v1/bff/resumen-dashboard
    // El Gateway la recibirá, aplicará la seguridad y la enviará al BFF (8081).
    const response = await api.get('/bff/resumen-dashboard');
    return response.data; 
  } catch (error) {
    console.error("❌ Error al obtener datos del médico desde el BFF mediante Gateway:", error);
    throw error; 
  }
};
import axios from 'axios'

// ✅ CONFIGURACIÓN UNIFICADA: Apuntamos la URL base general a la raíz del API Gateway (8080)
// Esto nos permitirá usar un único cliente para Login y para el Negocio Orquestado del BFF.
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', 
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// 🔑 INTERCEPTOR DE PETICIONES CENTRALIZADO
// Se ejecutará de manera inteligente en cada petición inyectando el token JWT.
api.interceptors.request.use((config) => {
  let token = null;

  // 1. Estrategia A: Buscamos el token guardado independientemente
  token = localStorage.getItem('rednorte_token');

  // 2. Estrategia B: Si no existe, lo buscamos dentro del objeto estructurado del usuario
  if (!token) {
    const storedUser = localStorage.getItem('rednorte_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        token = userData.token || userData.accessToken;
      } catch (e) {
        console.error("❌ [Axios Interceptor] Error al parsear el JSON de rednorte_user:", e);
      }
    }
  }

  // 3. Inyección Dinámica y Segura en Cabeceras HTTP
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Es normal ver esta advertencia únicamente durante la llamada de Login, ya que ahí no hay token aún.
    console.log(`ℹ️ [Axios Interceptor] Petición saliente sin token de seguridad hacia: ${config.url}`);
  }

  return config;
}, (error) => {
  return Promise.reject(error);
})

export default api;
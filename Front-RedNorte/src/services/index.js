import api from './api' // ✅ Importamos la instancia unificada 'api' (Puerto 8080)

// --- MS1: Sistema de listas de espera (Canalizado mediante el BFF) ---
export const listaEsperaService = {
  // ✅ Canalizado a través de la aduana del BFF
  getAll: () => api.get('/bff/lista-espera/detallada'), 
  getById: (id) => api.get(`/bff/lista-espera/${id}`),
  crear: (data) => api.post('/bff/lista-espera/registrar', data), 
  actualizar: (id, data) => api.put('/bff/lista-espera/actualizar/' + id, data), 
  eliminar: (id) => api.delete('/bff/lista-espera/eliminar/' + id), 
  getMetricas: () => api.get('/bff/lista-espera/metricas'),
  
  // Acción Orquestada y Transaccional
  cancelarYReasignar: (payload) => api.post('/bff/lista-espera/cancelar', payload),
}

// --- MS2: Sistema de reasignación automática (A través del BFF) ---
export const reasignacionService = {
  // ✅ Todos pasan por la aduana agregando el prefijo '/bff'
  getPendientes: () => api.get('/bff/reasignaciones/pendientes'),
  getHistorial: (params) => api.get('/bff/reasignaciones/historial', { params }),
  iniciarManual: (citaId) => api.post(`/bff/reasignaciones/iniciar/${citaId}`),
  confirmar: (id) => api.patch(`/bff/reasignaciones/${id}/confirmar`),
  rechazar: (id, motivo) => api.patch(`/bff/reasignaciones/${id}/rechazar`, { motivo }),
}

// --- MS3: Módulo de Usuarios / Pacientes (A través del BFF) ---
export const userService = {
  // ✅ Mapeado al endpoint unificado del BFF para el control administrativo de usuarios
  listarTodos: () => api.get('/bff/usuarios'),
  registrarNuevo: (data) => api.post('/bff/usuarios', data),
}

export const pacienteService = {
  // ✅ Lleva el prefijo '/bff' exigido por el Gateway perimetral
  obtenerMisConsultas: (rut) => api.get(`/bff/paciente/consultas/${rut}`),
  getDetallePaciente: (idInterconsulta) => api.get(`/bff/pacientes/detalle/${idInterconsulta}`),
  getMiEstado: (rut) => api.get(`/bff/portal/estado/${rut}`),
}

// --- Auth (Rutas directas de Autenticación en ms-usuarios) ---
export const authService = {
  // 🔥 SOLUCIÓN AL 401: Eliminamos '/usuarios' porque tu Postman demostró 
  // que el endpoint directo del backend es simplemente '/auth/login'
  // URL Final: http://localhost:8080/api/v1/auth/login
  login: (credentials) => api.post('/auth/login', credentials),
  
  // ✅ Alineamos el resto de los endpoints de autenticación sin el prefijo erróneo
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}
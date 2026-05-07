import api from './api'

// ─── MS1: Sistema integrado de listas de espera ───────────────────────────────

export const listaEsperaService = {
  getAll: () => api.get('/lista-espera/todos'), 
  getById: (id) => api.get(`/lista-espera/${id}`), 
  crear: (data) => api.post('/lista-espera/registrar', data), 
  actualizar: (id, data) => api.put(`/lista-espera/actualizar/${id}`, data), 
  eliminar: (id) => api.delete(`/lista-espera/eliminar/${id}`), 
  cancelar: (id) => api.post(`/lista-espera/cancelar/${id}`), 
  getMetricas: () => api.get('/lista-espera/metricas'),
}

// ─── MS2: Sistema de reasignación automática ──────────────────────────────────

export const reasignacionService = {
  getPendientes: () => api.get('/reasignaciones/pendientes'),
  getHistorial: (params) => api.get('/reasignaciones/historial', { params }),
  iniciarManual: (citaId) => api.post(`/reasignaciones/iniciar/${citaId}`),
  confirmar: (id) => api.patch(`/reasignaciones/${id}/confirmar`),
  rechazar: (id, motivo) => api.patch(`/reasignaciones/${id}/rechazar`, { motivo }),
  getHorasDisponibles: (especialidad) =>
    api.get('/reasignaciones/horas-disponibles', { params: { especialidad } }),
}

// ─── MS3: Portal de información para pacientes ────────────────────────────────

export const pacienteService = {
  // 👇 ESTE ES EL ENDPOINT REAL DEL BFF 👇
  getDetallePaciente: (idInterconsulta) => api.get(`/detalle-paciente/${idInterconsulta}`),
  
  // (Estos de abajo los dejamos comentados o tal cual están, 
  // pero recuerda que darán error si los usas porque el backend no los tiene aún)
  getMiEstado: (rut) => api.get(`/portal/estado/${rut}`),
  getMisCitas: () => api.get('/portal/mis-citas'),
  getMisNotificaciones: () => api.get('/portal/notificaciones'),
  marcarNotificacionLeida: (id) => api.patch(`/portal/notificaciones/${id}/leida`),
  getDetalleCita: (id) => api.get(`/portal/citas/${id}`),
}

// ─── Auth (BFF) ───────────────────────────────────────────────────────────────

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}
import api from './api'; // 👈 Instancia unificada apuntando al API Gateway (Puerto 8080)

export const listaEsperaService = {
    // ✅ CORREGIDO PARA EL GATEWAY: Añadimos '/bff' al inicio de cada ruta.
    // Axios construirá la ruta exacta requerida por tu application.yml:
    // http://localhost:8080/api/v1/bff/lista-espera/detallada
    // El Gateway la recibirá, aplicará seguridad perimetral y la enviará al BFF (8081).
    getAll: () => api.get('/bff/lista-espera/detallada'),
    
    // ✅ CORREGIDO: Ruta canalizada a través del orquestador del BFF
    crear: (datos) => api.post('/bff/lista-espera/registrar', datos),
    
    // ✅ CORREGIDO: Ruta canalizada a través del orquestador del BFF para actualizaciones
    actualizar: (id, datos) => api.put(`/bff/lista-espera/${id}`, datos),

    // ✅ ACCIÓN OPERACIONAL CRÍTICA: Llama al flujo transaccional unificado del BFF (cancelación + reasignación)
    cancelarYReasignar: (payload) => api.post('/bff/lista-espera/cancelar', payload),
};
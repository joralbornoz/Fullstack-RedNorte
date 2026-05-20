import api from './api'; // 👈 Instancia unificada apuntando al API Gateway (Puerto 8080)

export const usuarioService = {
    // ✅ CORREGIDO PARA EL API GATEWAY: Añadimos el prefijo '/bff'.
    // Axios construirá la ruta exacta que tu application.yml sabe enrutar al orquestador:
    // http://localhost:8080/api/v1/bff/usuarios (GET)
    listarTodos: () => api.get('/bff/usuarios'),
    
    // ✅ CORREGIDO PARA EL API GATEWAY: Añadimos el prefijo '/bff'.
    // URL final: http://localhost:8080/api/v1/bff/usuarios (POST)
    crear: (datosUsuario) => api.post('/bff/usuarios', datosUsuario)
};
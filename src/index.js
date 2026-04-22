// src/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors()); // Permite que el React (puerto 5173) hable con el BFF (puerto 4000)
app.use(express.json()); // Permite recibir JSON en el body

// ==========================================
// RUTAS DEL BFF (El contrato con el Frontend)
// ==========================================

// 1. Endpoint para consultar estado del paciente (Simula la llamada al MS de Lista de Espera)
app.get('/api/pacientes/:rut/estado', async (req, res) => {
  const { rut } = req.params;

  try {
    // AQUÍ EN EL FUTURO: const response = await axios.get(`URL_API_GATEWAY/lista-espera/${rut}`);
    
    // Por ahora, simulamos la respuesta para conectar con React
    console.log(`Buscando paciente con RUT: ${rut} en el sistema...`);
    
    // Lógica simulada de estado
    const estadoSimulado = rut.includes('k') ? 'CANCELADO' : 'ESPERA';

    res.json({
      nombre: 'Paciente desde el BFF',
      rut: rut,
      atencion: 'Consulta Especialista',
      hospital: 'Hospital Regional (Mock)',
      estado: estadoSimulado,
      fechaIngreso: new Date().toLocaleDateString('es-CL'),
      prioridad: 'Media'
    });

  } catch (error) {
    console.error("Error al consultar el API Gateway:", error);
    res.status(500).json({ error: "Fallo de comunicación con los microservicios core" });
  }
});

// 2. Endpoint para el Login de Funcionarios (Simula la llamada a tu MS de Usuarios)
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // AQUÍ EN EL FUTURO: Llamada al API Gateway -> Microservicio de Usuarios para validar y obtener JWT
    
    if (username === 'admin' && password === '123') {
      res.json({
        token: 'jwt_falso_123456789',
        user: { nombre: 'Dr. Funcionario', rol: 'Administrador' }
      });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`🚀 BFF de RedNorte corriendo en http://localhost:${PORT}`);
  console.log(`Esperando peticiones del Frontend...`);
});
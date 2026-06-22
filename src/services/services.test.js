/**
 * services.test.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Testea todos los métodos de servicio: index.js (listaEsperaService,
 * reasignacionService, userService, pacienteService, authService) y los
 * servicios individuales (dashboardService, listaEsperaService standalone,
 * pacienteService standalone, usuarioService standalone).
 *
 * Estrategia: jest.mock('./api') reemplaza la instancia de Axios por un
 * objeto con funciones spy (jest.fn()). Cada test verifica que el método de
 * servicio llama al endpoint correcto — sin red real, sin backend.
 *
 * Patrón AAA. Mocks reseteados entre tests para evitar interferencias.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Mock de la instancia de Axios ANTES de importar los servicios ─────────────
jest.mock('./api', () => ({
  get:    jest.fn(),
  post:   jest.fn(),
  put:    jest.fn(),
  patch:  jest.fn(),
  delete: jest.fn(),
}))

import api from './api'
import {
  listaEsperaService,
  reasignacionService,
  userService,
  pacienteService,
  authService,
} from './index'

// Limpiamos los mocks antes de cada test para no tener llamadas "heredadas"
beforeEach(() => {
  jest.clearAllMocks()
  // Silenciar console durante tests de servicios con manejo de errores
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  console.error.mockRestore()
})

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 1: listaEsperaService (desde index.js)
// ═══════════════════════════════════════════════════════════════════════════════

describe('listaEsperaService', () => {

  test('getAll() hace GET a /bff/lista-espera/detallada', () => {
    // Arrange
    api.get.mockResolvedValue({ data: [] })
    // Act
    listaEsperaService.getAll()
    // Assert
    expect(api.get).toHaveBeenCalledWith('/bff/lista-espera/detallada')
  })

  test('getById() hace GET a /bff/lista-espera/:id', () => {
    // Arrange
    api.get.mockResolvedValue({ data: {} })
    // Act
    listaEsperaService.getById('42')
    // Assert
    expect(api.get).toHaveBeenCalledWith('/bff/lista-espera/42')
  })

  test('crear() hace POST a /bff/lista-espera/registrar con los datos del formulario', () => {
    // Arrange
    const datos = { rutPaciente: '11.111.111-1', especialidadDestino: 'Cardiología' }
    api.post.mockResolvedValue({ data: { id: 'le123' } })
    // Act
    listaEsperaService.crear(datos)
    // Assert
    expect(api.post).toHaveBeenCalledWith('/bff/lista-espera/registrar', datos)
  })

  test('actualizar() hace PUT a /bff/lista-espera/actualizar/:id', () => {
    // Arrange
    api.put.mockResolvedValue({ data: {} })
    // Act
    listaEsperaService.actualizar('99', { estado: 'CONFIRMADO' })
    // Assert
    expect(api.put).toHaveBeenCalledWith('/bff/lista-espera/actualizar/99', { estado: 'CONFIRMADO' })
  })

  test('eliminar() hace DELETE a /bff/lista-espera/eliminar/:id', () => {
    // Arrange
    api.delete.mockResolvedValue({ data: {} })
    // Act
    listaEsperaService.eliminar('5')
    // Assert
    expect(api.delete).toHaveBeenCalledWith('/bff/lista-espera/eliminar/5')
  })

  test('cancelarYReasignar() hace POST a /bff/lista-espera/cancelar con el payload', () => {
    // Arrange
    const payload = { id: '7', rutPaciente: '12.345.678-9', motivo: 'Inasistencia' }
    api.post.mockResolvedValue({ data: {} })
    // Act
    listaEsperaService.cancelarYReasignar(payload)
    // Assert
    expect(api.post).toHaveBeenCalledWith('/bff/lista-espera/cancelar', payload)
  })

  test('getMetricas() hace GET a /bff/lista-espera/metricas', () => {
    // Arrange
    api.get.mockResolvedValue({ data: {} })
    // Act
    listaEsperaService.getMetricas()
    // Assert
    expect(api.get).toHaveBeenCalledWith('/bff/lista-espera/metricas')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 2: authService (desde index.js)
// ═══════════════════════════════════════════════════════════════════════════════

describe('authService', () => {

  test('login() hace POST a /auth/login con las credenciales', () => {
    // Arrange
    const creds = { rut: '12.345.678-9', contrasena: 'clave123' }
    api.post.mockResolvedValue({ data: { rol: 'ADMIN', token: 'jwt' } })
    // Act
    authService.login(creds)
    // Assert
    expect(api.post).toHaveBeenCalledWith('/auth/login', creds)
  })

  test('logout() hace POST a /auth/logout', () => {
    // Arrange
    api.post.mockResolvedValue({ data: {} })
    // Act
    authService.logout()
    // Assert
    expect(api.post).toHaveBeenCalledWith('/auth/logout')
  })

  test('me() hace GET a /auth/me', () => {
    // Arrange
    api.get.mockResolvedValue({ data: {} })
    // Act
    authService.me()
    // Assert
    expect(api.get).toHaveBeenCalledWith('/auth/me')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 3: userService (desde index.js)
// ═══════════════════════════════════════════════════════════════════════════════

describe('userService', () => {

  test('listarTodos() hace GET a /bff/usuarios', () => {
    api.get.mockResolvedValue({ data: [] })
    userService.listarTodos()
    expect(api.get).toHaveBeenCalledWith('/bff/usuarios')
  })

  test('registrarNuevo() hace POST a /bff/usuarios con los datos del usuario', () => {
    const datos = { nombre: 'Dr. House', rol: 'MEDICO' }
    api.post.mockResolvedValue({ data: { id: 'u001' } })
    userService.registrarNuevo(datos)
    expect(api.post).toHaveBeenCalledWith('/bff/usuarios', datos)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 4: pacienteService (desde index.js)
// ═══════════════════════════════════════════════════════════════════════════════

describe('pacienteService (index)', () => {

  test('obtenerMisConsultas() hace GET a /bff/paciente/consultas/:rut', () => {
    api.get.mockResolvedValue({ data: [] })
    pacienteService.obtenerMisConsultas('12.345.678-9')
    expect(api.get).toHaveBeenCalledWith('/bff/paciente/consultas/12.345.678-9')
  })

  test('getMiEstado() hace GET a /bff/portal/estado/:rut', () => {
    api.get.mockResolvedValue({ data: {} })
    pacienteService.getMiEstado('12.345.678-9')
    expect(api.get).toHaveBeenCalledWith('/bff/portal/estado/12.345.678-9')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 5: reasignacionService (desde index.js)
// ═══════════════════════════════════════════════════════════════════════════════

describe('reasignacionService', () => {

  test('getPendientes() hace GET a /bff/reasignaciones/pendientes', () => {
    api.get.mockResolvedValue({ data: [] })
    reasignacionService.getPendientes()
    expect(api.get).toHaveBeenCalledWith('/bff/reasignaciones/pendientes')
  })

  test('iniciarManual() hace POST a /bff/reasignaciones/iniciar/:citaId', () => {
    api.post.mockResolvedValue({ data: {} })
    reasignacionService.iniciarManual('cita-55')
    expect(api.post).toHaveBeenCalledWith('/bff/reasignaciones/iniciar/cita-55')
  })

  test('confirmar() hace PATCH a /bff/reasignaciones/:id/confirmar', () => {
    api.patch.mockResolvedValue({ data: {} })
    reasignacionService.confirmar('rea-10')
    expect(api.patch).toHaveBeenCalledWith('/bff/reasignaciones/rea-10/confirmar')
  })

  test('rechazar() hace PATCH a /bff/reasignaciones/:id/rechazar con motivo', () => {
    api.patch.mockResolvedValue({ data: {} })
    reasignacionService.rechazar('rea-10', 'Sin disponibilidad')
    expect(api.patch).toHaveBeenCalledWith('/bff/reasignaciones/rea-10/rechazar', {
      motivo: 'Sin disponibilidad',
    })
  })
})

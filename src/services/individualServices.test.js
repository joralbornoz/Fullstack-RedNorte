/**
 * individualServices.test.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Testea los servicios definidos en archivos individuales:
 *   - dashboardService.js   → getResumenDashboard() con try/catch
 *   - listaEsperaService.js → (standalone, duplicado de parte del index)
 *   - pacienteService.js    → obtenerMisConsultas() con try/catch
 *   - usuarioService.js     → listarTodos(), crear()
 *
 * Foco: el manejo de errores explícito (re-throw) en servicios con try/catch.
 * Patrón AAA. Mock del módulo ./api para aislar de la red.
 * ─────────────────────────────────────────────────────────────────────────────
 */

jest.mock('./api', () => ({
  get:  jest.fn(),
  post: jest.fn(),
  put:  jest.fn(),
}))

import api from './api'
import { getResumenDashboard } from './dashboardService'
import { listaEsperaService as listaEsperaStandalone } from './listaEsperaService'
import { obtenerMisConsultas } from './pacienteService'
import { usuarioService } from './usuarioService'

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => {
  console.error.mockRestore()
})

// ═══════════════════════════════════════════════════════════════════════════════
// dashboardService.js
// ═══════════════════════════════════════════════════════════════════════════════

describe('dashboardService', () => {

  test('getResumenDashboard() hace GET a /bff/resumen-dashboard', async () => {
    // Arrange
    const mockData = { totalPacientes: 10, enEspera: 3, atencionesHoy: 2, tiempoPromedio: '25 min' }
    api.get.mockResolvedValue({ data: mockData })

    // Act
    const resultado = await getResumenDashboard()

    // Assert
    expect(api.get).toHaveBeenCalledWith('/bff/resumen-dashboard')
    expect(resultado).toEqual(mockData)
  })

  test('getResumenDashboard() propaga el error cuando la API falla', async () => {
    // Arrange: la API lanza un error (server down, 500, etc.)
    const errorSimulado = new Error('Network Error')
    api.get.mockRejectedValue(errorSimulado)

    // Act + Assert: el servicio re-lanza el error (el componente debe manejarlo)
    await expect(getResumenDashboard()).rejects.toThrow('Network Error')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// listaEsperaService.js (standalone)
// ═══════════════════════════════════════════════════════════════════════════════

describe('listaEsperaService (standalone)', () => {

  test('getAll() hace GET a /bff/lista-espera/detallada', () => {
    api.get.mockResolvedValue({ data: [] })
    listaEsperaStandalone.getAll()
    expect(api.get).toHaveBeenCalledWith('/bff/lista-espera/detallada')
  })

  test('crear() hace POST a /bff/lista-espera/registrar', () => {
    const datos = { rutPaciente: '11.111.111-1', especialidadDestino: 'Neurología' }
    api.post.mockResolvedValue({ data: {} })
    listaEsperaStandalone.crear(datos)
    expect(api.post).toHaveBeenCalledWith('/bff/lista-espera/registrar', datos)
  })

  test('actualizar() hace PUT a /bff/lista-espera/:id', () => {
    api.put.mockResolvedValue({ data: {} })
    listaEsperaStandalone.actualizar('33', { estado: 'CONFIRMADO' })
    expect(api.put).toHaveBeenCalledWith('/bff/lista-espera/33', { estado: 'CONFIRMADO' })
  })

  test('cancelarYReasignar() hace POST a /bff/lista-espera/cancelar', () => {
    const payload = { id: '7', motivo: 'Inasistencia' }
    api.post.mockResolvedValue({ data: {} })
    listaEsperaStandalone.cancelarYReasignar(payload)
    expect(api.post).toHaveBeenCalledWith('/bff/lista-espera/cancelar', payload)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// pacienteService.js (standalone)
// ═══════════════════════════════════════════════════════════════════════════════

describe('pacienteService (standalone)', () => {

  test('obtenerMisConsultas() hace GET a /bff/paciente/consultas/:rut', async () => {
    // Arrange
    const mockConsultas = [{ id: 'le1', especialidadDestino: 'Cardiología' }]
    api.get.mockResolvedValue({ data: mockConsultas })

    // Act
    const resultado = await obtenerMisConsultas('12.345.678-9')

    // Assert
    expect(api.get).toHaveBeenCalledWith('/bff/paciente/consultas/12.345.678-9')
    expect(resultado).toEqual(mockConsultas)
  })

  test('obtenerMisConsultas() propaga el error cuando la API falla', async () => {
    // Arrange
    api.get.mockRejectedValue(new Error('Timeout'))

    // Act + Assert
    await expect(obtenerMisConsultas('12.345.678-9')).rejects.toThrow('Timeout')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// usuarioService.js (standalone)
// ═══════════════════════════════════════════════════════════════════════════════

describe('usuarioService (standalone)', () => {

  test('listarTodos() hace GET a /bff/usuarios', () => {
    api.get.mockResolvedValue({ data: [] })
    usuarioService.listarTodos()
    expect(api.get).toHaveBeenCalledWith('/bff/usuarios')
  })

  test('crear() hace POST a /bff/usuarios con los datos del usuario', () => {
    const datosUsuario = { nombreCompleto: 'Juan Pérez', rol: 'PACIENTE', rut: '10.000.000-1' }
    api.post.mockResolvedValue({ data: { id: 'u99' } })
    usuarioService.crear(datosUsuario)
    expect(api.post).toHaveBeenCalledWith('/bff/usuarios', datosUsuario)
  })
})

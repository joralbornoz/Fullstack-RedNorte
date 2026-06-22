/**
 * PacientePortal.test.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Patrón AAA en cada test.
 *
 * Foco principal: la CAPA DE DESEMPAQUE DEFENSIVA del componente.
 * PacientePortal maneja 5 estructuras distintas de respuesta del backend Spring
 * (array directo, .body, .data, .data.body, .data.data). Testeamos los 3 más
 * probables (A, C, E) más el caso de respuesta irreconocible.
 *
 * Mocks:
 *   - PageWrapper          → wrapper mínimo
 *   - AuthContext.useAuth  → test double con user.rut controlado
 *   - services.pacienteService → stub de obtenerMisConsultas()
 * ─────────────────────────────────────────────────────────────────────────────
 */

jest.mock('../../components/layout/PageWrapper', () =>
  ({ children }) => <div data-testid="page-wrapper">{children}</div>
)

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}))

jest.mock('../../services', () => ({
  pacienteService: {
    obtenerMisConsultas: jest.fn(),
  },
}))

import { render, screen, waitFor } from '@testing-library/react'
import { useAuth } from '../../context/AuthContext'
import { pacienteService } from '../../services'
import PacientePortal from './PacientePortal'

// ── Datos de prueba ───────────────────────────────────────────────────────────
const USUARIO_MOCK = { rut: '12.345.678-9', nombre: 'María López', rol: 'PACIENTE' }

const ATENCIONES_MOCK = [
  {
    id: 'int1',
    especialidadDestino: 'Cardiología',
    patologiaSospecha: 'Arritmia leve',
    prioridad: 'ALTA',
    fechaIngreso: '2024-03-10',
    estado: 'EN_ESPERA',
  },
  {
    id: 'int2',
    especialidadDestino: 'Neurología',
    patologiaSospecha: 'Cefalea crónica',
    prioridad: 'MEDIA',
    fechaIngreso: '2024-04-01',
    estado: 'CONFIRMADO',
  },
]

// ── Setup ─────────────────────────────────────────────────────────────────────
beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  // Por defecto, usuario autenticado con RUT
  useAuth.mockReturnValue({ user: USUARIO_MOCK })
})

afterEach(() => jest.restoreAllMocks())

// ── Helper: render y esperar carga ────────────────────────────────────────────
async function renderAndWait() {
  render(<PacientePortal />)
  // Esperamos a que el loading desaparezca
  await waitFor(() =>
    expect(screen.queryByText(/sincronizando/i)).not.toBeInTheDocument(),
    { timeout: 3000 }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 1: Sin user.rut no llama a la API (skip de carga)
// ─────────────────────────────────────────────────────────────────────────────
test('si el usuario no tiene RUT, no llama a la API y muestra el portal vacío', async () => {
  // Arrange: usuario sin RUT
  useAuth.mockReturnValue({ user: { nombre: 'Anónimo', rol: 'PACIENTE' } })

  // Act
  render(<PacientePortal />)

  // Assert: nunca llama al servicio
  await waitFor(() =>
    expect(pacienteService.obtenerMisConsultas).not.toHaveBeenCalled()
  )
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 2: Muestra el RUT del usuario en el subtitle del header
// ─────────────────────────────────────────────────────────────────────────────
test('muestra el RUT del usuario autenticado en el encabezado', async () => {
  // Arrange
  pacienteService.obtenerMisConsultas.mockResolvedValue([])

  // Act
  render(<PacientePortal />)
  await waitFor(() =>
    expect(screen.getByText(/mis interconsultas/i)).toBeInTheDocument()
  )

  // Assert
  expect(screen.getByText(/12\.345\.678-9/)).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 3: Caso A — respuesta es un Array directo
// ─────────────────────────────────────────────────────────────────────────────
test('CASO A: procesa la respuesta cuando obtenerMisConsultas devuelve un Array directo', async () => {
  // Arrange: el servicio devuelve directamente el array (sin Axios wrapper)
  pacienteService.obtenerMisConsultas.mockResolvedValue(ATENCIONES_MOCK)

  // Act
  await renderAndWait()

  // Assert: las interconsultas se muestran
  expect(screen.getByText('Cardiología')).toBeInTheDocument()
  expect(screen.getByText('Neurología')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 4: Caso C — respuesta envuelta en { data: [...] } (Axios estándar)
// ─────────────────────────────────────────────────────────────────────────────
test('CASO C: procesa la respuesta cuando viene en resultado.data (envoltorio Axios estándar)', async () => {
  // Arrange: estructura típica que devuelve Axios: { data: [...] }
  pacienteService.obtenerMisConsultas.mockResolvedValue({ data: ATENCIONES_MOCK })

  // Act
  await renderAndWait()

  // Assert
  expect(screen.getByText('Cardiología')).toBeInTheDocument()
  expect(screen.getByText('Neurología')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 5: Caso E — respuesta en doble envoltorio { data: { data: [...] } }
// ─────────────────────────────────────────────────────────────────────────────
test('CASO E: procesa la respuesta en doble envoltorio resultado.data.data', async () => {
  // Arrange: backend Spring con ResponseEntity + wrapper propio de RedNorte
  pacienteService.obtenerMisConsultas.mockResolvedValue({
    data: { data: ATENCIONES_MOCK },
  })

  // Act
  await renderAndWait()

  // Assert
  expect(screen.getByText('Cardiología')).toBeInTheDocument()
  expect(screen.getByText('Neurología')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 6: Respuesta sin formato reconocible → EmptyState "Sin interconsultas"
// ─────────────────────────────────────────────────────────────────────────────
test('muestra "Sin interconsultas vigentes" cuando el formato de respuesta no es reconocible', async () => {
  // Arrange: formato completamente inesperado (ej: string, null, objeto plano)
  pacienteService.obtenerMisConsultas.mockResolvedValue({ resultado: 'ok', codigo: 200 })

  // Act
  await renderAndWait()

  // Assert: estado vacío con mensaje claro
  expect(screen.getByText(/sin interconsultas vigentes/i)).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 7: Error de API → EmptyState de error
// ─────────────────────────────────────────────────────────────────────────────
test('muestra el error de conexión cuando obtenerMisConsultas() rechaza', async () => {
  // Arrange
  pacienteService.obtenerMisConsultas.mockRejectedValue(new Error('Timeout'))

  // Act
  render(<PacientePortal />)

  // Assert: mensaje de error al usuario
  await waitFor(() =>
    expect(
      screen.getByText(/no pudimos cargar tu historial/i)
    ).toBeInTheDocument()
  )
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 8: ProgressBar aparece para EN_ESPERA/PENDIENTE, no para CONFIRMADO
// ─────────────────────────────────────────────────────────────────────────────
test('muestra la barra de progreso para estados EN_ESPERA/PENDIENTE, pero NO para CONFIRMADO', async () => {
  // Arrange: una consulta EN_ESPERA y otra CONFIRMADO (array directo)
  pacienteService.obtenerMisConsultas.mockResolvedValue(ATENCIONES_MOCK)

  // Act
  render(<PacientePortal />)

  // Esperamos a que el contenido real aparezca (ambas especialidades visibles)
  await waitFor(() => screen.getByText('Cardiología'))
  await waitFor(() => screen.getByText('Neurología'))

  // Assert: "En revisión médica" solo aparece para la fila EN_ESPERA
  // Para CONFIRMADO no se renderiza la sección de ProgressBar
  const textoProgreso = screen.getAllByText(/en revisión médica/i)
  expect(textoProgreso).toHaveLength(1)
})


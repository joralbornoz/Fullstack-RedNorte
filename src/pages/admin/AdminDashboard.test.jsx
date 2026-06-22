/**
 * AdminDashboard.test.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Patrón AAA en cada test.
 *
 * Mocks:
 *   - PageWrapper  → reemplazado por wrapper mínimo para evitar la cadena
 *                    PageWrapper → Topbar → useAuth → localStorage
 *   - usuarioService → stub de listarTodos() y crear() (llamadas HTTP)
 *   - lucide-react  → iconos reemplazados por spans vacíos (sin SVG real)
 *
 * Foco: lógica de carga de datos, cálculo de stats, apertura/cierre del modal,
 * flujo de creación de usuario con recarga posterior.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Mock de componentes de infraestructura (no son el sujeto del test) ────────
jest.mock('../../components/layout/PageWrapper', () =>
  ({ children }) => <div data-testid="page-wrapper">{children}</div>
)

jest.mock('lucide-react', () => ({
  Users:         () => <span />,
  ShieldCheck:   () => <span />,
  User:          () => <span />,
  LayoutDashboard: () => <span />,
  UserPlus:      () => <span />,
}))

// ── Mock del servicio de usuarios ─────────────────────────────────────────────
jest.mock('../../services/usuarioService', () => ({
  usuarioService: {
    listarTodos: jest.fn(),
    crear:       jest.fn(),
  },
}))

import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { usuarioService } from '../../services/usuarioService'
import AdminDashboard from './AdminDashboard'

// ── Dataset de prueba ─────────────────────────────────────────────────────────
const USUARIOS_MOCK = [
  { id: 'u1', rut: '11.111.111-1', nombreCompleto: 'Ana Pérez',    email: 'ana@rednorte.cl',   rol: 'ADMIN',    numeroTelefono: '912345678' },
  { id: 'u2', rut: '22.222.222-2', nombreCompleto: 'Dr. García',   email: 'garcia@rednorte.cl',rol: 'MEDICO',   numeroTelefono: '987654321' },
  { id: 'u3', rut: '33.333.333-3', nombreCompleto: 'María López',  email: 'maria@rednorte.cl', rol: 'PACIENTE', numeroTelefono: '911111111' },
  { id: 'u4', rut: '44.444.444-4', nombreCompleto: 'Pedro Soto',   email: 'pedro@rednorte.cl', rol: 'PACIENTE', numeroTelefono: '922222222' },
]

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  jest.restoreAllMocks()
})

// Helper: render estándar
async function renderAndWait() {
  usuarioService.listarTodos.mockResolvedValue({ data: USUARIOS_MOCK })
  render(<AdminDashboard />)
  // Esperamos a que termine la carga
  await waitFor(() => expect(screen.queryByRole('table')).toBeInTheDocument())
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 1: Llama a listarTodos() al montar el componente
// ─────────────────────────────────────────────────────────────────────────────
test('llama a usuarioService.listarTodos() al montar el componente', async () => {
  // Arrange
  usuarioService.listarTodos.mockResolvedValue({ data: [] })

  // Act
  render(<AdminDashboard />)

  // Assert
  await waitFor(() => expect(usuarioService.listarTodos).toHaveBeenCalledTimes(1))
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 2: Renderiza los usuarios en la tabla después de cargar
// ─────────────────────────────────────────────────────────────────────────────
test('renderiza el nombre y RUT de cada usuario en la tabla', async () => {
  // Arrange + Act
  await renderAndWait()

  // Assert: los nombres de los usuarios del mock aparecen
  expect(screen.getByText('Ana Pérez')).toBeInTheDocument()
  expect(screen.getByText('Dr. García')).toBeInTheDocument()
  expect(screen.getByText('María López')).toBeInTheDocument()
  // Los RUTs también aparecen
  expect(screen.getByText('11.111.111-1')).toBeInTheDocument()
  expect(screen.getByText('22.222.222-2')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 3: Calcula correctamente el total de usuarios
// ─────────────────────────────────────────────────────────────────────────────
test('muestra el total correcto de usuarios en la métrica "Total Usuarios"', async () => {
  // Arrange + Act
  await renderAndWait()

  // Assert: 4 usuarios en el mock → el número "4" aparece junto a la etiqueta
  const labelTotal = screen.getByText(/total usuarios/i)
  // El valor está en el mismo contenedor que el label
  const cardTotal = labelTotal.closest('div')
  expect(within(cardTotal).getByText('4')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 4: Calcula correctamente el conteo por rol
// ─────────────────────────────────────────────────────────────────────────────
test('calcula correctamente: 1 admin, 1 médico, 2 pacientes', async () => {
  // Arrange + Act
  await renderAndWait()

  // Assert: labels de métricas existen con sus conteos
  const cardAdmins   = screen.getByText(/administradores/i).closest('div')
  const cardPacientes = screen.getByText(/pacientes/i).closest('div')
  const cardMedicos  = screen.getByText(/médicos/i).closest('div')

  expect(within(cardAdmins).getByText('1')).toBeInTheDocument()    // 1 ADMIN
  expect(within(cardMedicos).getByText('1')).toBeInTheDocument()   // 1 MEDICO
  expect(within(cardPacientes).getByText('2')).toBeInTheDocument() // 2 PACIENTES
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 5: El botón "Crear Usuario" abre el modal
// ─────────────────────────────────────────────────────────────────────────────
test('hacer clic en "Crear Usuario" abre el modal con el formulario', async () => {
  // Arrange
  await renderAndWait()

  // Assert: el modal NO está visible antes del clic
  expect(screen.queryByText('Crear Nuevo Usuario')).not.toBeInTheDocument()

  // Act
  await userEvent.click(screen.getByText('Crear Usuario'))

  // Assert: el modal aparece
  expect(screen.getByText('Crear Nuevo Usuario')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 6: Cancelar en el modal lo cierra
// ─────────────────────────────────────────────────────────────────────────────
test('hacer clic en Cancelar dentro del modal lo cierra', async () => {
  // Arrange: abrir modal
  await renderAndWait()
  await userEvent.click(screen.getByText('Crear Usuario'))
  expect(screen.getByText('Crear Nuevo Usuario')).toBeInTheDocument()

  // Act: cancelar
  await userEvent.click(screen.getByText('Cancelar'))

  // Assert: el modal desaparece
  await waitFor(() => {
    expect(screen.queryByText('Crear Nuevo Usuario')).not.toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 7: Crear usuario llama a usuarioService.crear() y recarga la lista
// ─────────────────────────────────────────────────────────────────────────────
test('guardar en el modal llama a crear() y vuelve a llamar a listarTodos()', async () => {
  // Arrange
  usuarioService.listarTodos.mockResolvedValue({ data: USUARIOS_MOCK })
  usuarioService.crear.mockResolvedValue({ data: { id: 'u5' } })
  render(<AdminDashboard />)
  await waitFor(() => screen.getByText('Crear Usuario'))

  // Act: abrir modal
  await userEvent.click(screen.getByText('Crear Usuario'))

  // Completar el formulario mínimamente (campos required)
  const inputs = screen.getAllByPlaceholderText(/nombre completo/i)
  await userEvent.type(inputs[0], 'Nuevo Médico')

  // Hacer clic en "Guardar Usuario"
  await userEvent.click(screen.getByText('Guardar Usuario'))

  // Assert: crear() fue llamado
  await waitFor(() => expect(usuarioService.crear).toHaveBeenCalledTimes(1))

  // Assert: listarTodos() fue llamado al menos 2 veces (carga inicial + recarga)
  await waitFor(() => expect(usuarioService.listarTodos).toHaveBeenCalledTimes(2))
})

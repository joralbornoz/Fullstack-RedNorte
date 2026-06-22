/**
 * MedicoDashboard.test.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Patrón AAA en cada test.
 *
 * Mocks:
 *   - PageWrapper          → wrapper mínimo (evita cadena Topbar → useAuth)
 *   - ../../services       → listaEsperaService (getAll, crear, actualizar,
 *                            cancelarYReasignar)
 *   - ../../services/dashboardService → getResumenDashboard
 *   - window.alert         → spy global (el componente usa alert() nativo)
 *
 * Componentes internos testeados:
 *   - NuevaConsultaModal   → validación de campos requeridos, submit correcto
 *   - CancelarConsultaModal → validación de motivo, submit correcto
 *   - MedicoDashboard      → carga, filtros, selección de fila, formatos de fecha
 * ─────────────────────────────────────────────────────────────────────────────
 */

jest.mock('../../components/layout/PageWrapper', () =>
  ({ children }) => <div data-testid="page-wrapper">{children}</div>
)

jest.mock('../../services', () => ({
  listaEsperaService: {
    getAll:            jest.fn(),
    crear:             jest.fn(),
    actualizar:        jest.fn(),
    cancelarYReasignar: jest.fn(),
  },
}))

jest.mock('../../services/dashboardService', () => ({
  getResumenDashboard: jest.fn(),
}))

import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { listaEsperaService } from '../../services'
import { getResumenDashboard } from '../../services/dashboardService'
import MedicoDashboard from './MedicoDashboard'

// ── Datos de prueba ───────────────────────────────────────────────────────────
const RESUMEN_MOCK = {
  totalPacientes: 12, enEspera: 4, atencionesHoy: 3, tiempoPromedio: '22 min',
}

const LISTA_MOCK = [
  {
    id: 'le1', rutPaciente: '11.111.111-1',
    nombreCompleto: 'Ana Pérez', email: 'ana@rednorte.cl',
    especialidadDestino: 'Cardiología', patologiaSospecha: 'Arritmia leve',
    fechaIngreso: '2024-03-10', prioridad: 'ALTA', estado: 'PENDIENTE',
  },
  {
    id: 'le2', rutPaciente: '22.222.222-2',
    nombreCompleto: 'Pedro Soto', email: 'pedro@rednorte.cl',
    especialidadDestino: 'Neurología', patologiaSospecha: 'Cefalea crónica',
    fechaIngreso: '2024-04-05', prioridad: 'MEDIA', estado: 'CONFIRMADO',
  },
]

// ── Setup global ──────────────────────────────────────────────────────────────
beforeEach(() => {
  jest.clearAllMocks()
  // El componente usa window.alert — lo reemplazamos con un spy
  global.alert = jest.fn()
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  jest.restoreAllMocks()
})

// ── Helper: render + esperar a que cargue la tabla ───────────────────────────
async function renderAndLoad(listaData = LISTA_MOCK) {
  listaEsperaService.getAll.mockResolvedValue({ data: listaData })
  getResumenDashboard.mockResolvedValue(RESUMEN_MOCK)
  render(<MedicoDashboard />)
  // Esperamos a que aparezca el encabezado de la tabla (señal de que terminó la carga)
  await waitFor(() =>
    expect(screen.getByText(/paciente \/ rut/i)).toBeInTheDocument()
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 1: Carga datos usando Promise.all y los renderiza en tabla
// ─────────────────────────────────────────────────────────────────────────────
test('carga la lista de espera y el resumen en paralelo, y los muestra en pantalla', async () => {
  // Arrange + Act
  await renderAndLoad()

  // Assert: datos de la lista de espera en la tabla
  expect(screen.getByText('Ana Pérez')).toBeInTheDocument()
  expect(screen.getByText('Pedro Soto')).toBeInTheDocument()
  // Assert: métricas del resumen (valor numérico)
  expect(screen.getByText('12')).toBeInTheDocument() // totalPacientes
  expect(screen.getByText('22 min')).toBeInTheDocument() // tiempoPromedio
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 2: Muestra EmptyState de error si la API falla
// ─────────────────────────────────────────────────────────────────────────────
test('muestra mensaje de error de conexión cuando la API falla', async () => {
  // Arrange: ambas promesas rechazan
  listaEsperaService.getAll.mockRejectedValue(new Error('Network Error'))
  getResumenDashboard.mockRejectedValue(new Error('Network Error'))
  render(<MedicoDashboard />)

  // Assert: aparece el mensaje de error
  await waitFor(() =>
    expect(screen.getByText(/error de conexión/i)).toBeInTheDocument()
  )
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 3: Filtro "Confirmados" muestra solo consultas con estado CONFIRMADO
// ─────────────────────────────────────────────────────────────────────────────
test('el filtro "Confirmados" oculta las consultas PENDIENTE y muestra solo las CONFIRMADO', async () => {
  // Arrange
  await renderAndLoad()
  // Estado inicial: ambas filas visibles
  expect(screen.getByText('Ana Pérez')).toBeInTheDocument()
  expect(screen.getByText('Pedro Soto')).toBeInTheDocument()

  // Act: hacer clic en el filtro "Confirmados"
  await userEvent.click(screen.getByText('Confirmados'))

  // Assert: solo Pedro Soto (CONFIRMADO) queda visible
  expect(screen.queryByText('Ana Pérez')).not.toBeInTheDocument()
  expect(screen.getByText('Pedro Soto')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 4: Filtro "Todos" restaura la vista completa
// ─────────────────────────────────────────────────────────────────────────────
test('el filtro "Todos" muestra todas las consultas sin importar el estado', async () => {
  // Arrange: filtrar primero por Confirmados
  await renderAndLoad()
  await userEvent.click(screen.getByText('Confirmados'))
  expect(screen.queryByText('Ana Pérez')).not.toBeInTheDocument()

  // Act: volver a "Todos"
  await userEvent.click(screen.getByText('Todos'))

  // Assert: ambas filas vuelven a aparecer
  expect(screen.getByText('Ana Pérez')).toBeInTheDocument()
  expect(screen.getByText('Pedro Soto')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 5: NuevaConsultaModal — muestra errores si se envía vacío
// ─────────────────────────────────────────────────────────────────────────────
test('NuevaConsultaModal: mostrar errores de validación al enviar el formulario vacío', async () => {
  // Arrange
  await renderAndLoad()

  // Act: abrir modal y enviar sin llenar nada
  await userEvent.click(screen.getByText('+ Nueva consulta'))
  expect(screen.getByText('Nueva consulta')).toBeInTheDocument()
  await userEvent.click(screen.getByText('Crear consulta'))

  // Assert: aparecen los mensajes de validación
  expect(screen.getByText('El RUT es requerido')).toBeInTheDocument()
  expect(screen.getByText('Selecciona una especialidad')).toBeInTheDocument()
  expect(screen.getByText('Ingresa la patología de sospecha')).toBeInTheDocument()
  expect(screen.getByText('Selecciona la prioridad')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 6: NuevaConsultaModal — submit válido llama a listaEsperaService.crear()
// ─────────────────────────────────────────────────────────────────────────────
test('NuevaConsultaModal: crear() es llamado con los datos del formulario válido', async () => {
  // Arrange
  listaEsperaService.crear.mockResolvedValue({ data: { id: 'le99' } })
  await renderAndLoad()

  // Act: abrir modal y completar formulario
  await userEvent.click(screen.getByText('+ Nueva consulta'))

  await userEvent.type(
    screen.getByPlaceholderText('Ej: 12.345.678-9'),
    '55.555.555-5'
  )
  // Seleccionar especialidad
  await userEvent.selectOptions(
    screen.getByRole('combobox'),
    'Cardiología'
  )
  await userEvent.type(
    screen.getByPlaceholderText(/describe la patología/i),
    'Sospecha de infarto'
  )
  // Prioridad: buscamos el botón cuyo texto sea exactamente 'Alta'
  // (el componente genera: p.charAt(0) + p.slice(1).toLowerCase() → 'Alta')
  const todosLosBotones = screen.getAllByRole('button')
  const btnAlta = todosLosBotones.find(b => b.textContent.trim() === 'Alta')
  await userEvent.click(btnAlta)

  // Enviar
  await userEvent.click(screen.getByText('Crear consulta'))

  // Assert: el servicio fue llamado con los datos correctos
  await waitFor(() =>
    expect(listaEsperaService.crear).toHaveBeenCalledWith(
      expect.objectContaining({
        rutPaciente:         '55.555.555-5',
        especialidadDestino: 'Cardiología',
        patologiaSospecha:   'Sospecha de infarto',
        prioridad:           'ALTA',
      })
    )
  )
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 7: CancelarConsultaModal — muestra error si motivo está vacío
// ─────────────────────────────────────────────────────────────────────────────
test('CancelarConsultaModal: muestra error cuando se envía sin ingresar el motivo', async () => {
  // Arrange: cargar y seleccionar una fila
  await renderAndLoad()
  // Clic en la primera fila para seleccionarla (aparece el panel de detalle)
  await userEvent.click(screen.getByText('Ana Pérez'))

  // El panel lateral muestra botones «Confirmar» y «Cancelar».
  // Buscamos todos los botones y filtramos el que dice exactamente «Cancelar».
  await waitFor(() => screen.getByText('Detalle del Paciente'))
  const botones = screen.getAllByRole('button')
  const btnCancelar = botones.find(b => b.textContent.trim() === 'Cancelar')
  await userEvent.click(btnCancelar)

  // Verificar que el modal de cancelación se abrió
  expect(screen.getByText(/cancelar consulta médica/i)).toBeInTheDocument()

  // Act: enviar sin ingresar motivo
  await userEvent.click(screen.getByText('Confirmar Cancelación'))

  // Assert: error de validación
  expect(
    screen.getByText('Debes ingresar un motivo para cancelar la consulta.')
  ).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 8: CancelarConsultaModal — submit con motivo llama a cancelarYReasignar()
// ─────────────────────────────────────────────────────────────────────────────
test('CancelarConsultaModal: llama a cancelarYReasignar() con el motivo ingresado', async () => {
  // Arrange
  listaEsperaService.cancelarYReasignar.mockResolvedValue({ data: {} })
  await renderAndLoad()

  // Seleccionar fila y abrir modal de cancelación
  await userEvent.click(screen.getByText('Ana Pérez'))
  await waitFor(() => screen.getByText('Detalle del Paciente'))
  const botones = screen.getAllByRole('button')
  const btnCancelar = botones.find(b => b.textContent.trim() === 'Cancelar')
  await userEvent.click(btnCancelar)
  expect(screen.getByText(/cancelar consulta médica/i)).toBeInTheDocument()

  // Act: ingresar motivo y confirmar
  await userEvent.type(
    screen.getByPlaceholderText(/paciente reagendó/i),
    'Inasistencia del paciente'
  )
  await userEvent.click(screen.getByText('Confirmar Cancelación'))

  // Assert: el servicio fue llamado con el payload correcto
  await waitFor(() =>
    expect(listaEsperaService.cancelarYReasignar).toHaveBeenCalledWith(
      expect.objectContaining({ motivo: 'Inasistencia del paciente' })
    )
  )
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 9: formatFechaChilena — muestra "No registrada" con fecha nula
// ─────────────────────────────────────────────────────────────────────────────
test('muestra "No registrada" en la tabla cuando fechaIngreso es null', async () => {
  // Arrange: consulta sin fecha
  const sinFecha = [
    {
      id: 'le99', rutPaciente: '99.999.999-9',
      nombreCompleto: 'Sin Fecha', email: 'x@x.cl',
      especialidadDestino: 'Oncología', patologiaSospecha: 'Control',
      fechaIngreso: null, prioridad: 'BAJA', estado: 'PENDIENTE',
    },
  ]
  await renderAndLoad(sinFecha)

  // Assert: la celda muestra el texto de fallback
  expect(screen.getByText('No registrada')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 10: Confirmar consulta llama a listaEsperaService.actualizar() con CONFIRMADO
// ─────────────────────────────────────────────────────────────────────────────
test('el botón Confirmar del panel de detalle llama a actualizar() con estado CONFIRMADO', async () => {
  // Arrange
  listaEsperaService.actualizar.mockResolvedValue({ data: {} })
  await renderAndLoad()

  // Seleccionar la primera fila
  await userEvent.click(screen.getByText('Ana Pérez'))
  await waitFor(() => screen.getByText('Detalle del Paciente'))

  // Act: buscamos el botón «Confirmar» entre todos los botones visibles
  const botones = screen.getAllByRole('button')
  const btnConfirmar = botones.find(b => b.textContent.trim() === 'Confirmar')
  await userEvent.click(btnConfirmar)

  // Assert
  await waitFor(() =>
    expect(listaEsperaService.actualizar).toHaveBeenCalledWith(
      'le1',
      { estado: 'CONFIRMADO' }
    )
  )
})

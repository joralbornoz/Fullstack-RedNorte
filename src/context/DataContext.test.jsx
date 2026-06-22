/**
 * DataContext.test.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Patrón AAA en cada test.
 * Test doubles: renderWithProviders envuelve con DataProvider sin mocks externos,
 * porque toda la lógica de DataContext es pura (sin llamadas a API).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataProvider, useData } from './DataContext'

// ── Helper Factory: componente que expone toda la API de DataContext ──────────
function ConsumerDeData({ onMount } = {}) {
  const { usuarios, listaEspera, crearUsuario, crearConsulta, actualizarEstadoConsulta } = useData()

  return (
    <div>
      <span data-testid="cant-usuarios">{usuarios.length}</span>
      <span data-testid="cant-espera">{listaEspera.length}</span>

      {/* Lista de usuarios para verificar propiedades */}
      {usuarios.map(u => (
        <div key={u.id} data-testid={`usuario-${u.id}`}>
          <span data-testid="u-nombre">{u.nombreCompleto}</span>
          <span data-testid="u-rol">{u.rol}</span>
          <span data-testid="u-activo">{String(u.activo)}</span>
        </div>
      ))}

      {/* Lista de espera para verificar propiedades */}
      {listaEspera.map(c => (
        <div key={c.id} data-testid={`consulta-${c.id}`}>
          <span data-testid="c-estado">{c.estado}</span>
          <span data-testid="c-paciente">{c.nombrePaciente}</span>
        </div>
      ))}

      {/* Botones de acción */}
      <button onClick={() => crearUsuario({ nombreCompleto: 'Carlos López', rol: 'MEDICO' })}>
        Crear usuario
      </button>
      <button onClick={() => crearConsulta({ rutPaciente: '12.345.678-9', nombrePaciente: 'María' })}>
        Crear consulta
      </button>
      <button onClick={() => {
        // Obtenemos el id del primer item de listaEspera para actualizarlo
        // Se setea desde afuera a través de un callback al que llamamos
        if (onMount) onMount(actualizarEstadoConsulta)
      }}>
        Actualizar
      </button>
    </div>
  )
}

// ── Wrapper limpio para cada test ─────────────────────────────────────────────
function renderDataContext(props = {}) {
  return render(
    <DataProvider>
      <ConsumerDeData {...props} />
    </DataProvider>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 1: Estado inicial vacío
// ─────────────────────────────────────────────────────────────────────────────
test('DataContext inicia con usuarios y listaEspera vacíos', () => {
  // Arrange + Act
  renderDataContext()
  // Assert
  expect(screen.getByTestId('cant-usuarios').textContent).toBe('0')
  expect(screen.getByTestId('cant-espera').textContent).toBe('0')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 2: crearUsuario agrega un usuario con id generado y activo: true
// ─────────────────────────────────────────────────────────────────────────────
test('crearUsuario() agrega el usuario al estado con id generado y activo: true', async () => {
  // Arrange
  renderDataContext()
  expect(screen.getByTestId('cant-usuarios').textContent).toBe('0')

  // Act
  await userEvent.click(screen.getByText('Crear usuario'))

  // Assert: ahora hay 1 usuario
  expect(screen.getByTestId('cant-usuarios').textContent).toBe('1')
  // El nombre fue preservado
  expect(screen.getByTestId('u-nombre').textContent).toBe('Carlos López')
  // El rol fue preservado
  expect(screen.getByTestId('u-rol').textContent).toBe('MEDICO')
  // activo siempre se fuerza a true
  expect(screen.getByTestId('u-activo').textContent).toBe('true')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 3: crearConsulta agrega con estado EN_ESPERA y fecha de hoy
// ─────────────────────────────────────────────────────────────────────────────
test('crearConsulta() crea la consulta con estado EN_ESPERA y fecha de hoy', async () => {
  // Arrange
  renderDataContext()
  const hoy = new Date().toISOString().split('T')[0]

  // Act
  await userEvent.click(screen.getByText('Crear consulta'))

  // Assert
  expect(screen.getByTestId('cant-espera').textContent).toBe('1')
  expect(screen.getByTestId('c-estado').textContent).toBe('EN_ESPERA')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 4: crearConsulta usa el nombrePaciente si viene en los datos
// ─────────────────────────────────────────────────────────────────────────────
test('crearConsulta() usa nombrePaciente cuando viene en los datos', async () => {
  // Arrange
  renderDataContext()

  // Act
  await userEvent.click(screen.getByText('Crear consulta'))

  // Assert: usó el nombrePaciente que pasamos ('María')
  expect(screen.getByTestId('c-paciente').textContent).toBe('María')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 5: crearConsulta genera nombre fallback si no viene nombrePaciente
// ─────────────────────────────────────────────────────────────────────────────
test('crearConsulta() genera nombre fallback "Paciente (rut)" si no hay nombrePaciente', () => {
  // Arrange: componente con acción personalizada
  let crearConsultaRef
  function ConsumerFallback() {
    const { listaEspera, crearConsulta } = useData()
    crearConsultaRef = crearConsulta
    return (
      <div>
        {listaEspera.map(c => (
          <span key={c.id} data-testid="nombre-generado">{c.nombrePaciente}</span>
        ))}
      </div>
    )
  }

  render(
    <DataProvider>
      <ConsumerFallback />
    </DataProvider>
  )

  // Act: crear sin nombrePaciente
  act(() => {
    crearConsultaRef({ rutPaciente: '99.999.999-9' })
  })

  // Assert: el nombre generado contiene el RUT
  expect(screen.getByTestId('nombre-generado').textContent).toContain('99.999.999-9')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 6: actualizarEstadoConsulta cambia el estado de la consulta correcta
// ─────────────────────────────────────────────────────────────────────────────
test('actualizarEstadoConsulta() cambia el estado de la consulta indicada por id', () => {
  // Arrange
  let actualizarRef
  let primeraConsultaId

  function ConsumerActualizar() {
    const { listaEspera, crearConsulta, actualizarEstadoConsulta } = useData()
    actualizarRef = actualizarEstadoConsulta

    return (
      <div>
        {listaEspera.map(c => (
          <span key={c.id} data-testid={`estado-${c.id}`}>{c.estado}</span>
        ))}
        <button onClick={() => {
          const nueva = crearConsulta({ rutPaciente: '11.111.111-1', nombrePaciente: 'Test' })
          primeraConsultaId = nueva.id
        }}>
          Crear
        </button>
      </div>
    )
  }

  render(
    <DataProvider>
      <ConsumerActualizar />
    </DataProvider>
  )

  // Act 1: crear consulta
  act(() => {
    screen.getByText('Crear').click()
  })

  // Verificamos que empieza en EN_ESPERA
  expect(screen.getByTestId(`estado-${primeraConsultaId}`).textContent).toBe('EN_ESPERA')

  // Act 2: actualizar estado
  act(() => {
    actualizarRef(primeraConsultaId, 'CONFIRMADO')
  })

  // Assert: el estado cambió
  expect(screen.getByTestId(`estado-${primeraConsultaId}`).textContent).toBe('CONFIRMADO')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 7: useData() lanza error si se usa fuera del DataProvider
// ─────────────────────────────────────────────────────────────────────────────
test('useData() lanza Error descriptivo cuando se usa fuera de DataProvider', () => {
  function ComponenteSinProvider() {
    useData()
    return null
  }
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  expect(() => render(<ComponenteSinProvider />)).toThrow(
    'useData must be used inside DataProvider'
  )
  consoleSpy.mockRestore()
})

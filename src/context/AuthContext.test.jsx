/**
 * AuthContext.test.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Patrón AAA (Arrange / Act / Assert) en cada test.
 * Test doubles: funciones spy con jest.fn() inyectadas como value del Provider.
 * Mock de localStorage: Jest reemplaza el objeto global para aislar efectos.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth, ROLES } from './AuthContext'

// ── Helper: componente mínimo que consume el contexto ────────────────────────
// Patrón Factory: reutilizado en todos los tests para renderizar con Provider.
function ConsumerDeAuth() {
  const { user, isAuthenticated, rolActivo, login, logout } = useAuth()
  return (
    <div>
      <span data-testid="autenticado">{String(isAuthenticated)}</span>
      <span data-testid="rol">{rolActivo ?? 'sin-rol'}</span>
      <span data-testid="nombre">{user?.nombre ?? 'sin-nombre'}</span>
      <button onClick={() => login({ nombre: 'Ana', rol: 'ADMIN', token: 'tok123' })}>
        Iniciar sesión
      </button>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  )
}

// ── Limpieza de localStorage antes de cada test ──────────────────────────────
beforeEach(() => {
  localStorage.clear()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 1: El contexto empieza sin usuario cuando localStorage está vacío
// ─────────────────────────────────────────────────────────────────────────────
test('estado inicial: isAuthenticated es false cuando no hay sesión guardada', () => {
  // Arrange: localStorage vacío (beforeEach lo limpia)
  // Act
  render(
    <AuthProvider>
      <ConsumerDeAuth />
    </AuthProvider>
  )
  // Assert
  expect(screen.getByTestId('autenticado').textContent).toBe('false')
  expect(screen.getByTestId('rol').textContent).toBe('sin-rol')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 2: login() guarda el usuario en el estado y en localStorage
// ─────────────────────────────────────────────────────────────────────────────
test('login() actualiza isAuthenticated a true y persiste el usuario en localStorage', async () => {
  // Arrange
  render(
    <AuthProvider>
      <ConsumerDeAuth />
    </AuthProvider>
  )
  // Act
  await userEvent.click(screen.getByText('Iniciar sesión'))
  // Assert: estado en pantalla
  expect(screen.getByTestId('autenticado').textContent).toBe('true')
  expect(screen.getByTestId('rol').textContent).toBe('ADMIN')
  expect(screen.getByTestId('nombre').textContent).toBe('Ana')
  // Assert: persistencia
  const guardado = JSON.parse(localStorage.getItem('rednorte_user'))
  expect(guardado.nombre).toBe('Ana')
  expect(guardado.rol).toBe('ADMIN')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 3: logout() borra el usuario del estado y de localStorage
// ─────────────────────────────────────────────────────────────────────────────
test('logout() deja isAuthenticated en false y elimina rednorte_user de localStorage', async () => {
  // Arrange: iniciamos sesión primero
  render(
    <AuthProvider>
      <ConsumerDeAuth />
    </AuthProvider>
  )
  await userEvent.click(screen.getByText('Iniciar sesión'))
  expect(screen.getByTestId('autenticado').textContent).toBe('true')

  // Act
  await userEvent.click(screen.getByText('Cerrar sesión'))

  // Assert
  expect(screen.getByTestId('autenticado').textContent).toBe('false')
  expect(screen.getByTestId('rol').textContent).toBe('sin-rol')
  expect(localStorage.getItem('rednorte_user')).toBeNull()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 4: El Provider recupera la sesión desde localStorage al montar
// ─────────────────────────────────────────────────────────────────────────────
test('AuthProvider restaura la sesión guardada en localStorage al inicializar', () => {
  // Arrange: simulamos que ya había una sesión guardada
  localStorage.setItem('rednorte_user', JSON.stringify({ nombre: 'Pedro', rol: 'MEDICO' }))

  // Act
  render(
    <AuthProvider>
      <ConsumerDeAuth />
    </AuthProvider>
  )

  // Assert: la sesión se restaura sin necesidad de hacer login de nuevo
  expect(screen.getByTestId('autenticado').textContent).toBe('true')
  expect(screen.getByTestId('rol').textContent).toBe('MEDICO')
  expect(screen.getByTestId('nombre').textContent).toBe('Pedro')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 5: rolActivo es null cuando no hay sesión
// ─────────────────────────────────────────────────────────────────────────────
test('rolActivo es null cuando el usuario no está autenticado', () => {
  // Arrange + Act
  render(
    <AuthProvider>
      <ConsumerDeAuth />
    </AuthProvider>
  )
  // Assert
  expect(screen.getByTestId('rol').textContent).toBe('sin-rol') // el componente muestra 'sin-rol' cuando rolActivo es null
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 6: ROLES tiene exactamente los tres roles esperados del sistema
// ─────────────────────────────────────────────────────────────────────────────
test('la constante ROLES contiene ADMIN, MEDICO y PACIENTE', () => {
  // Arrange + Act + Assert (test de contrato de datos puro)
  expect(ROLES.ADMIN).toBe('ADMIN')
  expect(ROLES.MEDICO).toBe('MEDICO')
  expect(ROLES.PACIENTE).toBe('PACIENTE')
  expect(Object.keys(ROLES)).toHaveLength(3)
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 7: useAuth() lanza un error claro si se usa fuera del Provider
// ─────────────────────────────────────────────────────────────────────────────
test('useAuth() lanza Error descriptivo cuando se usa fuera de AuthProvider', () => {
  // Arrange: componente que usa useAuth sin Provider padre
  function ComponenteSinProvider() {
    useAuth() // debe explotar
    return null
  }
  // Suppress expected error output from console
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  // Act + Assert
  expect(() => render(<ComponenteSinProvider />)).toThrow(
    'useAuth must be used inside AuthProvider'
  )

  consoleSpy.mockRestore()
})

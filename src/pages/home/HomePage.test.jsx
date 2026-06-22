/**
 * HomePage.test.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Patrón AAA en cada test.
 *
 * HomePage es principalmente un componente PRESENTACIONAL (landing page),
 * con tres tipos de comportamiento testeable:
 *   1. Renderizado de secciones y datos estáticos (STATS, FEATURES, STEPS)
 *   2. Navegación a /login con useNavigate (3 botones distintos: navbar,
 *      hero, cards de rol)
 *   3. Registro/limpieza de event listener de scroll (useEffect)
 *
 * Mock: useNavigate (desde react-router-dom) — spy para verificar navegación.
 * No necesitamos Router real porque useNavigate está completamente mockeado.
 * ─────────────────────────────────────────────────────────────────────────────
 */

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}))

import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useNavigate } from 'react-router-dom'
import HomePage from './HomePage'

let mockNavigate

beforeEach(() => {
  mockNavigate = jest.fn()
  useNavigate.mockReturnValue(mockNavigate)
})

afterEach(() => jest.restoreAllMocks())

// ─────────────────────────────────────────────────────────────────────────────
// TEST 1: Renderiza el título principal del Hero y el logo
// ─────────────────────────────────────────────────────────────────────────────
test('renderiza el título principal del hero y el logo RedNorte', () => {
  // Arrange + Act
  render(<HomePage />)

  // Assert: h1 del hero existe
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  // El span dentro del h1 con el texto de acento
  expect(screen.getByText('listas de espera')).toBeInTheDocument()
  // Logo en la navbar (texto span "RedNorte" — hay más de uno en la página)
  const logos = screen.getAllByText('RedNorte')
  expect(logos.length).toBeGreaterThanOrEqual(1)
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 2: Renderiza las 4 métricas de STATS
// ─────────────────────────────────────────────────────────────────────────────
test('renderiza las 4 estadísticas de la sección STATS', () => {
  // Arrange + Act
  render(<HomePage />)

  // Assert: los 4 valores de STATS aparecen en pantalla
  expect(screen.getByText('48+')).toBeInTheDocument()
  expect(screen.getByText('1.2M')).toBeInTheDocument()
  expect(screen.getByText('94%')).toBeInTheDocument()
  expect(screen.getByText('< 48h')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 3: Renderiza los 6 features del sistema
// ─────────────────────────────────────────────────────────────────────────────
test('renderiza los 6 módulos del sistema de la sección FEATURES', () => {
  // Arrange + Act
  render(<HomePage />)

  // Assert: los títulos de los 6 FEATURES
  expect(screen.getByText('Lista de espera inteligente')).toBeInTheDocument()
  expect(screen.getByText('Reasignación automática')).toBeInTheDocument()
  expect(screen.getByText('Portal del paciente')).toBeInTheDocument()
  expect(screen.getByText('Red de establecimientos')).toBeInTheDocument()
  expect(screen.getByText('Reportes y métricas')).toBeInTheDocument()
  expect(screen.getByText('Acceso por roles')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 4: Renderiza los 4 pasos de "¿Cómo funciona?"
// ─────────────────────────────────────────────────────────────────────────────
test('renderiza los 4 pasos del flujo "¿Cómo funciona?"', () => {
  // Arrange + Act
  render(<HomePage />)

  // Assert: títulos de los 4 STEPS
  expect(screen.getByText('El paciente ingresa a lista')).toBeInTheDocument()
  expect(screen.getByText('El sistema prioriza')).toBeInTheDocument()
  expect(screen.getByText('Se asigna una hora')).toBeInTheDocument()
  expect(screen.getByText('El paciente es notificado')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 5: Renderiza los 3 perfiles de la sección de roles
// ─────────────────────────────────────────────────────────────────────────────
test('renderiza los 3 perfiles de usuario (Paciente, Médico, Administrador)', () => {
  // Arrange + Act
  render(<HomePage />)

  // Assert: cada perfil tiene su nombre visible
  expect(screen.getByText('Paciente')).toBeInTheDocument()
  expect(screen.getByText('Médico')).toBeInTheDocument()
  expect(screen.getByText('Administrador')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 6: Botón "Acceder al sistema" del Hero navega a /login
// ─────────────────────────────────────────────────────────────────────────────
test('el botón "Acceder al sistema" navega a /login', async () => {
  // Arrange
  render(<HomePage />)

  // Act
  await userEvent.click(screen.getByText('Acceder al sistema'))

  // Assert
  expect(mockNavigate).toHaveBeenCalledWith('/login')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 7: Botón "Iniciar sesión" de la navbar navega a /login
// ─────────────────────────────────────────────────────────────────────────────
test('el botón "Iniciar sesión" de la navbar navega a /login', async () => {
  // Arrange
  render(<HomePage />)

  // Hay múltiples botones "Iniciar sesión" (navbar + CTA final).
  // El de la navbar es el primero en el DOM.
  const botonesLogin = screen.getAllByText('Iniciar sesión')
  expect(botonesLogin.length).toBeGreaterThanOrEqual(1)

  // Act: clic en el primero (navbar)
  await userEvent.click(botonesLogin[0])

  // Assert
  expect(mockNavigate).toHaveBeenCalledWith('/login')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 8: Botones "Ingresar →" de las cards de rol navegan a /login
// ─────────────────────────────────────────────────────────────────────────────
test('los botones "Ingresar →" de las cards de rol navegan a /login', async () => {
  // Arrange
  render(<HomePage />)
  const botonesIngresar = screen.getAllByText('Ingresar →')

  // Act: clic en el primero (Paciente)
  await userEvent.click(botonesIngresar[0])

  // Assert
  expect(mockNavigate).toHaveBeenCalledWith('/login')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 9: El footer muestra el nombre de la asignatura
// ─────────────────────────────────────────────────────────────────────────────
test('el footer muestra la referencia al curso DSY1106', () => {
  // Arrange + Act
  render(<HomePage />)

  // Assert: texto del footer que identifica el proyecto académico
  expect(screen.getByText(/DSY1106/)).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 10: useEffect registra y limpia el listener de scroll
// ─────────────────────────────────────────────────────────────────────────────
test('el evento scroll se registra al montar y se limpia al desmontar', () => {
  // Arrange: espiamos addEventListener y removeEventListener del window
  const addSpy    = jest.spyOn(window, 'addEventListener')
  const removeSpy = jest.spyOn(window, 'removeEventListener')

  // Act: montar y desmontar
  const { unmount } = render(<HomePage />)

  // Assert: scroll se registró al montar
  expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function))

  // Act: desmontar
  unmount()

  // Assert: scroll se limpió al desmontar (cleanup del useEffect)
  expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
})

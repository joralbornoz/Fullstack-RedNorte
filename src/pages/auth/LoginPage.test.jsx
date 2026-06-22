/**
 * LoginPage.test.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Patrón AAA en cada test.
 *
 * Mocks necesarios:
 *   - authService.login  → stub de la llamada HTTP (jest.mock de '../../services')
 *   - useAuth            → test double que expone un spy de login() del contexto
 *   - useNavigate        → spy para verificar que la redirección ocurre al destino correcto
 *
 * No necesitamos BrowserRouter porque useNavigate está completamente mockeado.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Mocks declarados ANTES de los imports ────────────────────────────────────
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}))

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}))

jest.mock('../../services', () => ({
  authService: {
    login: jest.fn(),
  },
}))

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services'
import LoginPage from './LoginPage'

// ── Spies reutilizables ───────────────────────────────────────────────────────
let mockNavigate
let mockLoginCtx

beforeEach(() => {
  // Spy de navegación
  mockNavigate = jest.fn()
  useNavigate.mockReturnValue(mockNavigate)

  // Spy del login del contexto (AuthContext.login — NO el de authService)
  mockLoginCtx = jest.fn()
  useAuth.mockReturnValue({ login: mockLoginCtx })

  // Limpiar localStorage entre tests
  localStorage.clear()

  // Silenciar console.log/warn del componente
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  jest.restoreAllMocks()
})

// ── Helper ────────────────────────────────────────────────────────────────────
function renderLogin() {
  return render(<LoginPage />)
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 1: Renderizado del formulario
// ─────────────────────────────────────────────────────────────────────────────
test('renderiza el título "Iniciar sesión" y el logotipo RedNorte', () => {
  // Arrange + Act
  renderLogin()
  // Assert
  expect(screen.getByText('RedNorte')).toBeInTheDocument()
  expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 2: El formulario tiene los campos RUT y contraseña
// ─────────────────────────────────────────────────────────────────────────────
test('renderiza los campos RUT y Contraseña y el botón Ingresar', () => {
  // Arrange + Act
  renderLogin()
  // Assert
  expect(screen.getByPlaceholderText('Ej: 12.345.678-9')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 3: El campo RUT actualiza su valor al escribir
// ─────────────────────────────────────────────────────────────────────────────
test('el campo RUT actualiza su valor cuando el usuario escribe', async () => {
  // Arrange
  renderLogin()
  const campoRut = screen.getByPlaceholderText('Ej: 12.345.678-9')

  // Act
  await userEvent.type(campoRut, '12.345.678-9')

  // Assert
  expect(campoRut.value).toBe('12.345.678-9')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 4: Login exitoso como ADMIN → guarda token y navega a /admin
// ─────────────────────────────────────────────────────────────────────────────
test('login exitoso de ADMIN: llama a login() del contexto y navega a /admin', async () => {
  // Arrange: la API devuelve datos de un ADMIN
  authService.login.mockResolvedValue({
    data: { rol: 'ADMIN', nombre: 'Ana Admin', token: 'jwt-admin-123' },
  })
  renderLogin()

  // Act: completar el formulario y enviarlo
  await userEvent.type(screen.getByPlaceholderText('Ej: 12.345.678-9'), '12.345.678-9')
  await userEvent.type(screen.getByPlaceholderText('••••••••'), 'clave123')
  await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))

  // Assert: login del contexto fue llamado con los datos correctos
  await waitFor(() => {
    expect(mockLoginCtx).toHaveBeenCalledWith(
      expect.objectContaining({ rol: 'ADMIN', nombre: 'Ana Admin' })
    )
  })
  // Assert: navegó a la vista de admin
  expect(mockNavigate).toHaveBeenCalledWith('/admin')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 5: Login exitoso como MEDICO → navega a /medico
// ─────────────────────────────────────────────────────────────────────────────
test('login exitoso de MEDICO: navega a /medico', async () => {
  // Arrange
  authService.login.mockResolvedValue({
    data: { rol: 'MEDICO', nombre: 'Dr. García', token: 'jwt-medico' },
  })
  renderLogin()

  // Act
  await userEvent.type(screen.getByPlaceholderText('Ej: 12.345.678-9'), '99.888.777-6')
  await userEvent.type(screen.getByPlaceholderText('••••••••'), 'pass')
  await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))

  // Assert
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/medico'))
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 6: Login exitoso como PACIENTE → navega a /paciente
// ─────────────────────────────────────────────────────────────────────────────
test('login exitoso de PACIENTE: navega a /paciente', async () => {
  // Arrange
  authService.login.mockResolvedValue({
    data: { rol: 'PACIENTE', nombre: 'María', rut: '11.222.333-4' },
  })
  renderLogin()

  // Act
  await userEvent.type(screen.getByPlaceholderText('Ej: 12.345.678-9'), '11.222.333-4')
  await userEvent.type(screen.getByPlaceholderText('••••••••'), 'pass')
  await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))

  // Assert
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/paciente'))
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 7: Login exitoso → guarda el token en localStorage
// ─────────────────────────────────────────────────────────────────────────────
test('login exitoso: guarda el token JWT en localStorage como rednorte_token', async () => {
  // Arrange
  authService.login.mockResolvedValue({
    data: { rol: 'ADMIN', nombre: 'Admin', token: 'mi-jwt-secreto' },
  })
  renderLogin()

  // Act
  await userEvent.type(screen.getByPlaceholderText('Ej: 12.345.678-9'), '12.345.678-9')
  await userEvent.type(screen.getByPlaceholderText('••••••••'), 'clave')
  await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))

  // Assert
  await waitFor(() => {
    expect(localStorage.getItem('rednorte_token')).toBe('mi-jwt-secreto')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 8: Respuesta en doble envoltorio (response.data.data) — desempaque
// ─────────────────────────────────────────────────────────────────────────────
test('maneja la respuesta anidada response.data.data extrayendo los datos correctamente', async () => {
  // Arrange: el backend devuelve { data: { data: { rol, nombre, token } } }
  authService.login.mockResolvedValue({
    data: {
      data: { rol: 'MEDICO', nombre: 'Dr. Torres', token: 'jwt-nested' },
    },
  })
  renderLogin()

  // Act
  await userEvent.type(screen.getByPlaceholderText('Ej: 12.345.678-9'), '77.777.777-7')
  await userEvent.type(screen.getByPlaceholderText('••••••••'), 'clave')
  await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))

  // Assert: aunque venía anidado, se extrajo correctamente el rol
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/medico'))
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 9: Error de API → muestra mensaje de error en pantalla
// ─────────────────────────────────────────────────────────────────────────────
test('muestra el mensaje de error cuando authService.login() rechaza la promesa', async () => {
  // Arrange: la API devuelve un error 401 con mensaje específico
  authService.login.mockRejectedValue({
    response: { data: { mensaje: 'RUT o contraseña incorrectos' } },
  })
  renderLogin()

  // Act
  await userEvent.type(screen.getByPlaceholderText('Ej: 12.345.678-9'), 'rut-malo')
  await userEvent.type(screen.getByPlaceholderText('••••••••'), 'clave-mala')
  await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))

  // Assert: el mensaje del backend aparece en pantalla
  await waitFor(() => {
    expect(screen.getByText('RUT o contraseña incorrectos')).toBeInTheDocument()
  })
  // Y NO navegó a ningún lado
  expect(mockNavigate).not.toHaveBeenCalled()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 10: Respuesta sin rol → lanza error y no navega
// ─────────────────────────────────────────────────────────────────────────────
test('muestra error cuando la respuesta del servidor no incluye un rol válido', async () => {
  // Arrange: la API responde pero sin campo 'rol' (falla de configuración del backend)
  authService.login.mockResolvedValue({
    data: { nombre: 'Alguien', token: 'jwt-sin-rol' },
    // sin 'rol' → el componente lanza Error interno
  })
  renderLogin()

  // Act
  await userEvent.type(screen.getByPlaceholderText('Ej: 12.345.678-9'), '12.345.678-9')
  await userEvent.type(screen.getByPlaceholderText('••••••••'), 'clave')
  await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))

  // Assert: muestra el error al usuario (mensaje del throw interno)
  await waitFor(() => {
    expect(
      screen.getByText(/no retornó un rol válido/i)
    ).toBeInTheDocument()
  })
  expect(mockNavigate).not.toHaveBeenCalled()
})

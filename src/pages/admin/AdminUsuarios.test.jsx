/**
 * AdminUsuarios.test.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Patrón AAA en cada test.
 *
 * AdminUsuariosLogin es un formulario de login duplicado de LoginPage, montado
 * en la ruta activa /admin/usuarios (App.jsx línea 38). Tiene la misma lógica
 * de handleSubmit pero sin el desempaque defensivo de data.data que sí tiene
 * LoginPage. Se testean los caminos esenciales de esa ruta.
 *
 * Mocks: misma estrategia que LoginPage (useNavigate, useAuth, authService).
 * ─────────────────────────────────────────────────────────────────────────────
 */

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
import AdminUsuariosLogin from './AdminUsuarios'

let mockNavigate
let mockLoginCtx

beforeEach(() => {
  mockNavigate = jest.fn()
  useNavigate.mockReturnValue(mockNavigate)
  mockLoginCtx = jest.fn()
  useAuth.mockReturnValue({ login: mockLoginCtx })
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => jest.restoreAllMocks())

// ─────────────────────────────────────────────────────────────────────────────
// TEST 1: Renderiza el formulario con los campos esperados
// ─────────────────────────────────────────────────────────────────────────────
test('renderiza los campos RUT, Contraseña y el botón Ingresar', () => {
  // Arrange + Act
  render(<AdminUsuariosLogin />)

  // Assert
  expect(screen.getByPlaceholderText('Ej: 12.345.678-9')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument()
  // El logo y título deben estar presentes
  expect(screen.getByText('RedNorte')).toBeInTheDocument()
  expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 2: Login exitoso como ADMIN → llama a login() del contexto y navega a /admin
// ─────────────────────────────────────────────────────────────────────────────
test('login exitoso de ADMIN: llama a login() del contexto y navega a /admin', async () => {
  // Arrange
  authService.login.mockResolvedValue({
    data: { rol: 'ADMIN', nombre: 'Ana Admin', token: 'jwt-admin' },
  })
  render(<AdminUsuariosLogin />)

  // Act
  await userEvent.type(screen.getByPlaceholderText('Ej: 12.345.678-9'), '12.345.678-9')
  await userEvent.type(screen.getByPlaceholderText('••••••••'), 'clave123')
  await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))

  // Assert
  await waitFor(() => {
    expect(mockLoginCtx).toHaveBeenCalledWith(
      expect.objectContaining({ rol: 'ADMIN', nombre: 'Ana Admin' })
    )
    expect(mockNavigate).toHaveBeenCalledWith('/admin')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 3: Login exitoso como MEDICO → navega a /medico
// ─────────────────────────────────────────────────────────────────────────────
test('login exitoso de MEDICO: navega a /medico', async () => {
  // Arrange
  authService.login.mockResolvedValue({
    data: { rol: 'MEDICO', nombre: 'Dr. García' },
  })
  render(<AdminUsuariosLogin />)

  // Act
  await userEvent.type(screen.getByPlaceholderText('Ej: 12.345.678-9'), '99.888.777-6')
  await userEvent.type(screen.getByPlaceholderText('••••••••'), 'pass')
  await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))

  // Assert
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/medico'))
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 4: Error de API → muestra el mensaje de error en pantalla
// ─────────────────────────────────────────────────────────────────────────────
test('muestra el mensaje de error cuando authService.login() rechaza', async () => {
  // Arrange
  authService.login.mockRejectedValue({
    response: { data: { mensaje: 'RUT o contraseña incorrectos' } },
  })
  render(<AdminUsuariosLogin />)

  // Act
  await userEvent.type(screen.getByPlaceholderText('Ej: 12.345.678-9'), 'rut-malo')
  await userEvent.type(screen.getByPlaceholderText('••••••••'), 'clave-mala')
  await userEvent.click(screen.getByRole('button', { name: /ingresar/i }))

  // Assert: mensaje del backend visible, sin navegación
  await waitFor(() =>
    expect(screen.getByText('RUT o contraseña incorrectos')).toBeInTheDocument()
  )
  expect(mockNavigate).not.toHaveBeenCalled()
})

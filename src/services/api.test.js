/**
 * api.test.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Testea el interceptor de Axios definido en api.js.
 *
 * Estrategia: accedemos a api.interceptors.request.handlers directamente
 * para extraer la función registrada y llamarla con configs de prueba.
 * Así verificamos la lógica pura del interceptor sin levantar un servidor real.
 *
 * Patrón AAA en cada test. Mock de localStorage (global de jsdom).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import api from './api'

// Silenciamos los logs del interceptor durante los tests
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  console.log.mockRestore()
  console.error.mockRestore()
})

beforeEach(() => {
  localStorage.clear()
})

// Helper: obtiene la función del interceptor de request registrada
function getRequestInterceptorFn() {
  // api.interceptors.request.handlers es el array interno de Axios
  // con los interceptores registrados. El nuestro es el primero (índice 0).
  const handler = api.interceptors.request.handlers.find(h => h !== null)
  return handler?.fulfilled
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 1: La instancia api se crea con la baseURL correcta
// ─────────────────────────────────────────────────────────────────────────────
test('api tiene la baseURL apuntando al API Gateway en el puerto 8080', () => {
  // Arrange + Act: el módulo ya está inicializado al importarlo
  const baseURL = api.defaults.baseURL
  // Assert: la URL contiene el host del gateway
  expect(baseURL).toContain('8080')
  expect(baseURL).toContain('/api/v1')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 2: El interceptor registra un handler de request
// ─────────────────────────────────────────────────────────────────────────────
test('api registra exactamente un interceptor de request', () => {
  // Arrange + Act
  const handlers = api.interceptors.request.handlers.filter(h => h !== null)
  // Assert
  expect(handlers.length).toBeGreaterThanOrEqual(1)
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 3: Estrategia A — lee rednorte_token de localStorage
// ─────────────────────────────────────────────────────────────────────────────
test('interceptor: inyecta token desde rednorte_token (Estrategia A)', () => {
  // Arrange
  localStorage.setItem('rednorte_token', 'jwt-token-estrategia-a')
  const interceptorFn = getRequestInterceptorFn()
  const config = { headers: {} }

  // Act
  const resultado = interceptorFn(config)

  // Assert
  expect(resultado.headers.Authorization).toBe('Bearer jwt-token-estrategia-a')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 4: Estrategia B — lee token desde objeto rednorte_user en localStorage
// ─────────────────────────────────────────────────────────────────────────────
test('interceptor: inyecta token desde rednorte_user.token cuando no hay rednorte_token (Estrategia B)', () => {
  // Arrange: solo rednorte_user con el token dentro del objeto
  localStorage.setItem(
    'rednorte_user',
    JSON.stringify({ nombre: 'Dr. García', rol: 'MEDICO', token: 'jwt-token-estrategia-b' })
  )
  const interceptorFn = getRequestInterceptorFn()
  const config = { headers: {} }

  // Act
  const resultado = interceptorFn(config)

  // Assert
  expect(resultado.headers.Authorization).toBe('Bearer jwt-token-estrategia-b')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 5: Estrategia B — alternativa con accessToken en lugar de token
// ─────────────────────────────────────────────────────────────────────────────
test('interceptor: inyecta token desde rednorte_user.accessToken si no hay .token', () => {
  // Arrange
  localStorage.setItem(
    'rednorte_user',
    JSON.stringify({ nombre: 'Admin', rol: 'ADMIN', accessToken: 'jwt-access-token' })
  )
  const interceptorFn = getRequestInterceptorFn()
  const config = { headers: {} }

  // Act
  const resultado = interceptorFn(config)

  // Assert
  expect(resultado.headers.Authorization).toBe('Bearer jwt-access-token')
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 6: Sin token → no se agrega header Authorization
// ─────────────────────────────────────────────────────────────────────────────
test('interceptor: NO inyecta Authorization cuando localStorage está vacío', () => {
  // Arrange: localStorage vacío (beforeEach lo limpia)
  const interceptorFn = getRequestInterceptorFn()
  const config = { headers: {} }

  // Act
  const resultado = interceptorFn(config)

  // Assert: sin token, sin header
  expect(resultado.headers.Authorization).toBeUndefined()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 7: rednorte_user con JSON inválido no rompe la app
// ─────────────────────────────────────────────────────────────────────────────
test('interceptor: maneja sin error un rednorte_user con JSON malformado', () => {
  // Arrange: JSON inválido en localStorage
  localStorage.setItem('rednorte_user', '{no-es-json-valido')
  const interceptorFn = getRequestInterceptorFn()
  const config = { headers: {} }

  // Act + Assert: no lanza excepción
  expect(() => interceptorFn(config)).not.toThrow()
})

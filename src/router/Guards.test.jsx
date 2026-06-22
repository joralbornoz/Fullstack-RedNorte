/**
 * Guards.test.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Patrón AAA en cada test.
 * Mock de AuthContext via Test Double: en lugar de montar un Provider real,
 * mockeamos el módulo completo de AuthContext para controlar exactamente qué
 * devuelve useAuth() en cada escenario, sin efectos secundarios de localStorage.
 *
 * Usamos MemoryRouter + Routes para simular la navegación sin browser real.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { PrivateRoute, PublicOnly } from './Guards'

// ── Mock del módulo AuthContext ───────────────────────────────────────────────
// jest.mock reemplaza el módulo completo por un objeto controlable.
// Cada test sobrescribe el retorno de useAuth con los valores que necesita.
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}))

// Importamos la versión mockeada para poder configurarla en cada test
import { useAuth } from '../context/AuthContext'

// ── Helper Factory: monta el guard dentro de un router mínimo ─────────────────
// Recibe qué guard montar, con qué ruta protegida y qué ruta de destino (Outlet).
function renderPrivateRoute({ allowedRoles = ['ADMIN'], authValue }) {
  useAuth.mockReturnValue(authValue)
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route element={<PrivateRoute allowedRoles={allowedRoles} />}>
          <Route path="/admin" element={<div>Contenido protegido</div>} />
        </Route>
        <Route path="/login"      element={<div>Página de login</div>} />
        <Route path="/sin-acceso" element={<div>Sin acceso</div>} />
      </Routes>
    </MemoryRouter>
  )
}

function renderPublicOnly({ authValue }) {
  useAuth.mockReturnValue(authValue)
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<div>Formulario login</div>} />
        </Route>
        <Route path="/admin"    element={<div>Dashboard admin</div>} />
        <Route path="/medico"   element={<div>Dashboard médico</div>} />
        <Route path="/paciente" element={<div>Portal paciente</div>} />
      </Routes>
    </MemoryRouter>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 1: PrivateRoute — usuario no autenticado es redirigido a /login
// ─────────────────────────────────────────────────────────────────────────────
test('PrivateRoute redirige a /login cuando el usuario no está autenticado', () => {
  // Arrange: usuario sin sesión
  renderPrivateRoute({
    authValue: { isAuthenticated: false, user: null },
  })

  // Assert: no muestra el contenido protegido, sino la página de login
  expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
  expect(screen.getByText('Página de login')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 2: PrivateRoute — usuario autenticado con rol incorrecto va a /sin-acceso
// ─────────────────────────────────────────────────────────────────────────────
test('PrivateRoute redirige a /sin-acceso cuando el rol no está permitido', () => {
  // Arrange: autenticado como PACIENTE, pero la ruta exige ADMIN
  renderPrivateRoute({
    allowedRoles: ['ADMIN'],
    authValue: { isAuthenticated: true, user: { rol: 'PACIENTE' } },
  })

  // Assert: bloqueado con página de sin acceso
  expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
  expect(screen.getByText('Sin acceso')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 3: PrivateRoute — usuario autenticado con rol correcto accede al Outlet
// ─────────────────────────────────────────────────────────────────────────────
test('PrivateRoute muestra el contenido protegido cuando el rol es el correcto', () => {
  // Arrange: autenticado como ADMIN y la ruta permite ADMIN
  renderPrivateRoute({
    allowedRoles: ['ADMIN'],
    authValue: { isAuthenticated: true, user: { rol: 'ADMIN' } },
  })

  // Assert: puede ver el contenido
  expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 4: PublicOnly — usuario no autenticado puede ver la página pública (login)
// ─────────────────────────────────────────────────────────────────────────────
test('PublicOnly muestra el Outlet (login) cuando el usuario no está autenticado', () => {
  // Arrange: sin sesión
  renderPublicOnly({
    authValue: { isAuthenticated: false, user: null },
  })

  // Assert: el formulario de login es visible
  expect(screen.getByText('Formulario login')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 5: PublicOnly — ADMIN autenticado es redirigido a /admin
// ─────────────────────────────────────────────────────────────────────────────
test('PublicOnly redirige a /admin cuando el usuario autenticado tiene rol ADMIN', () => {
  // Arrange: ADMIN logueado intentando acceder a /login
  renderPublicOnly({
    authValue: { isAuthenticated: true, user: { rol: 'ADMIN' } },
  })

  // Assert: no ve el formulario de login, sino su dashboard
  expect(screen.queryByText('Formulario login')).not.toBeInTheDocument()
  expect(screen.getByText('Dashboard admin')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 6: PublicOnly — MEDICO autenticado es redirigido a /medico
// ─────────────────────────────────────────────────────────────────────────────
test('PublicOnly redirige a /medico cuando el usuario autenticado tiene rol MEDICO', () => {
  // Arrange
  renderPublicOnly({
    authValue: { isAuthenticated: true, user: { rol: 'MEDICO' } },
  })

  // Assert
  expect(screen.queryByText('Formulario login')).not.toBeInTheDocument()
  expect(screen.getByText('Dashboard médico')).toBeInTheDocument()
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST 7: PublicOnly — PACIENTE autenticado es redirigido a /paciente
// ─────────────────────────────────────────────────────────────────────────────
test('PublicOnly redirige a /paciente cuando el usuario autenticado tiene rol PACIENTE', () => {
  // Arrange
  renderPublicOnly({
    authValue: { isAuthenticated: true, user: { rol: 'PACIENTE' } },
  })

  // Assert
  expect(screen.queryByText('Formulario login')).not.toBeInTheDocument()
  expect(screen.getByText('Portal paciente')).toBeInTheDocument()
})

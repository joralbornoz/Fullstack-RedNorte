import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, ROLES } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { PrivateRoute, PublicOnly } from './router/Guards'

import LoginPage       from './pages/auth/LoginPage'
import AdminDashboard  from './pages/admin/AdminDashboard'
import AdminUsuarios   from './pages/admin/AdminUsuarios'
import MedicoDashboard from './pages/medico/MedicoDashboard'
import PacientePortal  from './pages/paciente/PacientePortal'

function SinAcceso() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 48, margin: '0 0 12px' }}>🔒</p>
        <h2 style={{ fontFamily: 'Sora, sans-serif', color: 'var(--teal-dark)' }}>Sin acceso</h2>
        <p style={{ color: 'var(--text-secondary)' }}>No tienes permisos para ver esta página.</p>
        <a href="/login" style={{ color: 'var(--teal-primary)' }}>Volver al inicio</a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicOnly />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN]} />}>
              <Route path="/admin"              element={<AdminDashboard />} />
              <Route path="/admin/lista-espera" element={<AdminDashboard />} />
              <Route path="/admin/usuarios"     element={<AdminUsuarios />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={[ROLES.MEDICO]} />}>
              <Route path="/medico"              element={<MedicoDashboard />} />
              <Route path="/medico/lista-espera" element={<MedicoDashboard />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={[ROLES.PACIENTE]} />}>
              <Route path="/paciente"                element={<PacientePortal />} />
              <Route path="/paciente/citas"          element={<PacientePortal />} />
              <Route path="/paciente/notificaciones" element={<PacientePortal />} />
            </Route>

            <Route path="/sin-acceso" element={<SinAcceso />} />
            <Route path="/"  element={<Navigate to="/login" replace />} />
            <Route path="*"  element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  )
}

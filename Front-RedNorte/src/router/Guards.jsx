import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function PrivateRoute({ allowedRoles }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user?.rol)) {
    return <Navigate to="/sin-acceso" replace />
  }

  return <Outlet />
}

export function PublicOnly() {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Outlet />

  const destinos = {
    ADMIN:    '/admin',
    MEDICO:   '/medico',
    PACIENTE: '/paciente',
  }
  return <Navigate to={destinos[user?.rol] || '/login'} replace />
}

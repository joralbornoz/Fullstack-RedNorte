import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth, ROLES } from '../../context/AuthContext'

const NAV_ITEMS = {
  [ROLES.ADMIN]: [
    { to: '/admin',              label: 'Dashboard' },
    { to: '/admin/lista-espera', label: 'Lista de espera' },
    { to: '/admin/usuarios',     label: 'Usuarios' },
  ],
  [ROLES.MEDICO]: [
    { to: '/medico',             label: 'Dashboard' },
    { to: '/medico/lista-espera',label: 'Lista de espera' },
  ],
  [ROLES.PACIENTE]: [
    { to: '/paciente',                  label: 'Mi estado' },
    { to: '/paciente/citas',            label: 'Mis citas' },
    { to: '/paciente/notificaciones',   label: 'Notificaciones' },
  ],
}

export default function Topbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const items = NAV_ITEMS[user?.rol] || []

  const initials = user?.nombreCompleto
    ? user.nombreCompleto.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.nombre
    ? user.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header style={{
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(14,155,132,0.12)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2 mr-2 shrink-0">
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #2dd4bf, #0e9b84)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C6.13 2 3 5.13 3 9c0 2.39 1.19 4.5 3 5.74V16h8v-1.26C15.81 13.5 17 11.39 17 9c0-3.87-3.13-7-7-7z" fill="white" opacity="0.9"/>
              <rect x="7" y="16" width="6" height="2" rx="1" fill="white" opacity="0.7"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 15, color: 'var(--teal-dark)' }}>
            RedNorte
          </span>
        </div>

        {/* Nav pills */}
        <nav className="flex items-center gap-1 flex-1">
          {items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={['admin','medico','paciente'].some(r => item.to === `/${r}`)}
              style={({ isActive }) => ({
                fontSize: 13, fontWeight: isActive ? 500 : 400,
                padding: '5px 14px', borderRadius: 20, textDecoration: 'none',
                background: isActive ? 'var(--teal-primary)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Derecha: badge rol + avatar */}
        <div className="flex items-center gap-3 shrink-0">
          <span style={{
            fontSize: 11, padding: '3px 10px', borderRadius: 10,
            background: 'var(--teal-light)', color: 'var(--teal-dark)', fontWeight: 500,
          }}>
            {user?.rol}
          </span>

          <div className="relative group">
            <button style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #55cfba, #0e9b84)',
              color: '#fff', fontSize: 12, fontWeight: 600,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {initials}
            </button>
            <div className="group-hover:flex hidden" style={{
              position: 'absolute', right: 0, top: '110%',
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: 12, padding: '8px 0', minWidth: 180,
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              flexDirection: 'column', zIndex: 100,
            }}>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                  {user?.nombreCompleto || user?.nombre}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>
              <button onClick={handleLogout} style={{
                padding: '8px 16px', background: 'none', border: 'none',
                textAlign: 'left', fontSize: 13, color: '#ef4444',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

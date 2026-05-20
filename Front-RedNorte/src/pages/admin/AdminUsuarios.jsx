import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, ROLES } from '../../context/AuthContext'
import { authService } from '../../services'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]       = useState({ rut: '', contrasena: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // 🛃 ACTUALIZADO: El API Gateway (8080) procesa esto, valida con MS-Usuarios y nos da { token, rut, rol }
      const { data } = await authService.login(form)

      console.log("✅ DATOS RECIBIDOS DEL API GATEWAY:", data)
      
      // Guarda los datos en el contexto global (localStorage/state)
      login(data)
      
      // Enrutamiento dinámico según el rol retornado por el Gateway
      const destinos = { ADMIN: '/admin', MEDICO: '/medico', PACIENTE: '/paciente' }
      navigate(destinos[data.rol] || '/login')
      
    } catch (err) {
      setError(err.response?.data?.mensaje || 'RUT o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  // Mocks de desarrollo — alineados con el modelo Usuario del backend
  function devLogin(rol) {
    const mock = {
      ADMIN: {
        id: '1', rut: '11.111.111-1', email: 'admin@rednorte.cl',
        nombreCompleto: 'Admin Sistema', numeroTelefono: '+56912345678',
        rol: ROLES.ADMIN, token: 'mock-admin',
      },
      MEDICO: {
        id: '2', rut: '12.345.678-9', email: 'jcarrasco@rednorte.cl',
        nombreCompleto: 'Dr. Juan Carrasco', numeroTelefono: '+56987654321',
        rol: ROLES.MEDICO, token: 'mock-medico',
      },
      PACIENTE: {
        id: '3', rut: '15.432.109-K', email: 'mgonzalez@email.cl',
        nombreCompleto: 'María González', numeroTelefono: '+56911223344',
        rol: ROLES.PACIENTE, token: 'mock-paciente',
      },
    }
    login(mock[rol])
    const destinos = { ADMIN: '/admin', MEDICO: '/medico', PACIENTE: '/paciente' }
    navigate(destinos[rol])
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdfb 0%, #ccfaf2 40%, #f0fdfb 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
    }}>
      {/* Blobs decorativos */}
      <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(45,212,191,0.12)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(14,155,132,0.08)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #2dd4bf, #0e9b84)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(14,155,132,0.25)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C8.13 3 5 6.13 5 10c0 2.74 1.49 5.14 3.7 6.44V18h6.6v-1.56C17.51 15.14 19 12.74 19 10c0-3.87-3.13-7-7-7z" fill="white" opacity="0.95"/>
              <rect x="9" y="18" width="6" height="2" rx="1" fill="white" opacity="0.75"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 24, color: 'var(--teal-dark)', margin: 0 }}>
            RedNorte
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Plataforma de gestión hospitalaria
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(14,155,132,0.15)', borderRadius: '1.25rem',
          padding: '2rem', boxShadow: '0 8px 40px rgba(14,155,132,0.10)',
        }}>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 1.5rem' }}>
            Iniciar sesión
          </h2>

          <form onSubmit={handleSubmit}>
            {/* RUT */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                RUT
              </label>
              <input
                type="text"
                value={form.rut}
                onChange={e => setForm(f => ({ ...f, rut: e.target.value }))}
                required
                placeholder="Ej: 12.345.678-9"
                style={{
                  width: '100%', padding: '10px 14px', fontSize: 14,
                  border: '1px solid var(--border)', borderRadius: 10,
                  background: 'rgba(240,253,251,0.5)', outline: 'none',
                  fontFamily: 'DM Sans, sans-serif', color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Contraseña */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                Contraseña
              </label>
              <input
                type="password"
                value={form.contrasena}
                onChange={e => setForm(f => ({ ...f, contrasena: e.target.value }))}
                required
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '10px 14px', fontSize: 14,
                  border: '1px solid var(--border)', borderRadius: 10,
                  background: 'rgba(240,253,251,0.5)', outline: 'none',
                  fontFamily: 'DM Sans, sans-serif', color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <div style={{
                background: '#fee2e2', border: '1px solid #fca5a5',
                borderRadius: 8, padding: '10px 14px', fontSize: 13,
                color: '#991b1b', marginBottom: '1rem',
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '11px', fontSize: 14, fontWeight: 500,
              background: loading ? 'var(--teal-mid)' : 'var(--teal-primary)',
              color: '#fff', border: 'none', borderRadius: 10,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          {/* Dev shortcuts */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textAlign: 'center' }}>
              Acceso rápido (desarrollo)
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              {['ADMIN','MEDICO','PACIENTE'].map(rol => (
                <button key={rol} onClick={() => devLogin(rol)} style={{
                  flex: 1, padding: '6px', fontSize: 11, fontWeight: 500,
                  background: 'var(--teal-light)', color: 'var(--teal-dark)',
                  border: '1px solid rgba(14,155,132,0.2)', borderRadius: 8,
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                }}>
                  {rol}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
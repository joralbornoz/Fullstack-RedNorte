import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ rut: '', contrasena: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log("🚀 [LoginPage] Enviando credenciales directo al API Gateway (Puerto 8080)...");

      const payloadCredenciales = {
        rut: form.rut,
        contrasena: form.contrasena 
      };

      const response = await authService.login(payloadCredenciales)
      const userData = response.data?.data ? response.data.data : response.data;

      console.log("✅ [LoginPage] Datos de sesión unificados y procesados:", userData)

      if (!userData || !userData.rol) {
        throw new Error("El servicio de autenticación no retornó un rol válido para este usuario.");
      }

      if (userData.token || userData.accessToken) {
        localStorage.setItem('rednorte_token', userData.token || userData.accessToken);
      }

      login(userData)

      const destinos = {
        ADMIN: '/admin',
        MEDICO: '/medico',
        PACIENTE: '/paciente'
      }

      const rutaDestino = destinos[userData.rol.toUpperCase()];
      if (rutaDestino) {
        console.log(`🔀 [LoginPage] Redirigiendo de forma legal a la vista de: ${userData.rol}`);
        navigate(rutaDestino);
      } else {
        console.warn("⚠️ Rol desconocido detectado. Redirigiendo a login por seguridad.");
        navigate('/login');
      }

    } catch (err) {
      console.error("❌ [LoginPage] Error capturado en el flujo de inicio de sesión:", err);
      setError(err.response?.data?.mensaje || err.message || 'RUT o contraseña incorrectos');
    } finally {
      if (loading) setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdfb 0%, #ccfaf2 40%, #f0fdfb 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
    }}>
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
              <path d="M12 3C8.13 3 5 6.13 5 10c0 2.74 1.49 5.14 3.7 6.44V18h6.6v-1.56C17.51 15.14 19 12.74 19 10c0-3.87-3.13-7-7-7z" fill="white" opacity="0.95" />
              <rect x="9" y="18" width="6" height="2" rx="1" fill="white" opacity="0.75" />
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

            {/* Mensajes de error */}
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
        </div>
      </div>
    </div>
  )
}
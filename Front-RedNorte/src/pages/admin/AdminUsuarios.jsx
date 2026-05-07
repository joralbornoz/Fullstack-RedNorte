import { useState } from 'react'
import PageWrapper from '../../components/layout/PageWrapper'
import { Card, PageHeader, EmptyState } from '../../components/ui'
import { useData } from '../../context/DataContext'

const ROLES_OPC = ['ADMIN', 'MEDICO', 'PACIENTE']

const EMPTY_FORM = {
  nombreCompleto: '', rut: '', email: '',
  contrasena: '', numeroTelefono: '', rol: '',
}

function RolBadge({ rol }) {
  const styles = {
    ADMIN:    { bg: '#ede9fe', color: '#5b21b6' },
    MEDICO:   { bg: '#e1f5ee', color: '#076457' },
    PACIENTE: { bg: '#e0f2fe', color: '#0369a1' },
  }
  const s = styles[rol] || { bg: '#f1f5f9', color: '#475569' }
  return (
    <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 10, background: s.bg, color: s.color, fontWeight: 500 }}>
      {rol}
    </span>
  )
}

const inputStyle = (hasError) => ({
  width: '100%', padding: '8px 12px', fontSize: 13,
  border: `1px solid ${hasError ? '#fca5a5' : 'rgba(14,155,132,0.2)'}`,
  borderRadius: 8, background: '#f0fdfb',
  fontFamily: 'DM Sans, sans-serif', color: '#0f2421',
  outline: 'none', boxSizing: 'border-box',
})

export default function AdminUsuarios() {
  const { usuarios, crearUsuario } = useData()
  const [form,      setForm]       = useState(EMPTY_FORM)
  const [errors,    setErrors]     = useState({})
  const [saving,    setSaving]     = useState(false)
  const [success,   setSuccess]    = useState(false)
  const [search,    setSearch]     = useState('')
  const [filtroRol, setFiltroRol]  = useState('TODOS')

  function setField(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.nombreCompleto.trim()) e.nombreCompleto = 'Requerido'
    if (!form.rut.trim())            e.rut            = 'Requerido'
    if (!form.email.trim())          e.email          = 'Requerido'
    if (!form.contrasena.trim())     e.contrasena     = 'Requerido'
    if (!form.rol)                   e.rol            = 'Selecciona un rol'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    crearUsuario(form)   // ← guarda en DataContext (global)
    setForm(EMPTY_FORM)
    setErrors({})
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const filtrados = usuarios.filter(u => {
    const matchRol    = filtroRol === 'TODOS' || u.rol === filtroRol
    const q           = search.toLowerCase()
    const matchSearch = u.nombreCompleto.toLowerCase().includes(q) ||
                        u.email.toLowerCase().includes(q) ||
                        u.rut.includes(q)
    return matchRol && matchSearch
  })

  return (
    <PageWrapper>
      <PageHeader
        title="Gestión de usuarios"
        subtitle="Crea y administra las cuentas del sistema"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 12, alignItems: 'start' }}>

        {/* ── TABLA ─────────────────────────────────────────────── */}
        <Card
          title="Usuarios registrados"
          action={<span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtrados.length} usuarios</span>}
        >
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <input
              type="text"
              placeholder="Buscar por nombre, email o RUT..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle(false), flex: 1 }}
            />
            <select
              value={filtroRol}
              onChange={e => setFiltroRol(e.target.value)}
              style={{ ...inputStyle(false), width: 'auto' }}
            >
              <option value="TODOS">Todos</option>
              {ROLES_OPC.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {filtrados.length === 0 ? (
            <EmptyState icon="👥" title="Sin usuarios" description="No hay usuarios con ese criterio" />
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Usuario', 'RUT', 'Teléfono', 'Rol', 'Estado'].map(h => (
                    <th key={h} style={{
                      fontSize: 11, color: 'var(--text-muted)', textAlign: 'left',
                      padding: '0 0 10px', fontWeight: 400,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map(u => (
                  <tr key={u.id} style={{ borderTop: '1px solid rgba(14,155,132,0.08)' }}>
                    <td style={{ padding: '10px 0' }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{u.nombreCompleto}</p>
                      <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{u.email}</p>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '10px 8px' }}>{u.rut}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '10px 8px' }}>{u.numeroTelefono || '—'}</td>
                    <td style={{ padding: '10px 8px' }}><RolBadge rol={u.rol} /></td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{
                        fontSize: 11, padding: '2px 9px', borderRadius: 10, fontWeight: 500,
                        background: u.activo ? '#dcfce7' : '#fee2e2',
                        color: u.activo ? '#15803d' : '#991b1b',
                      }}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* ── FORMULARIO ────────────────────────────────────────── */}
        <Card title="Crear nuevo usuario">
          {success && (
            <div style={{
              background: '#dcfce7', border: '1px solid #86efac',
              borderRadius: 8, padding: '10px 14px', fontSize: 13,
              color: '#15803d', marginBottom: 14,
            }}>
              ✓ Usuario creado correctamente
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5, fontWeight: 500 }}>Nombre completo</label>
              <input type="text" value={form.nombreCompleto} onChange={e => setField('nombreCompleto', e.target.value)} placeholder="Ej: Juan Carrasco" style={inputStyle(!!errors.nombreCompleto)} />
              {errors.nombreCompleto && <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0' }}>{errors.nombreCompleto}</p>}
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5, fontWeight: 500 }}>RUT</label>
              <input type="text" value={form.rut} onChange={e => setField('rut', e.target.value)} placeholder="Ej: 12.345.678-9" style={inputStyle(!!errors.rut)} />
              {errors.rut && <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0' }}>{errors.rut}</p>}
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5, fontWeight: 500 }}>Correo electrónico</label>
              <input type="email" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="usuario@rednorte.cl" style={inputStyle(!!errors.email)} />
              {errors.email && <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0' }}>{errors.email}</p>}
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5, fontWeight: 500 }}>Número de teléfono</label>
              <input type="tel" value={form.numeroTelefono} onChange={e => setField('numeroTelefono', e.target.value)} placeholder="+56912345678" style={inputStyle(false)} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5, fontWeight: 500 }}>Contraseña temporal</label>
              <input type="password" value={form.contrasena} onChange={e => setField('contrasena', e.target.value)} placeholder="••••••••" style={inputStyle(!!errors.contrasena)} />
              {errors.contrasena && <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0' }}>{errors.contrasena}</p>}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5, fontWeight: 500 }}>Rol del usuario</label>
              <select
                value={form.rol}
                onChange={e => setField('rol', e.target.value)}
                style={{ ...inputStyle(!!errors.rol), cursor: 'pointer' }}
              >
                <option value="">Seleccionar rol...</option>
                <option value="ADMIN">Administrador</option>
                <option value="MEDICO">Médico</option>
                <option value="PACIENTE">Paciente</option>
              </select>
              {errors.rol && <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0' }}>{errors.rol}</p>}
              {form.rol && (
                <div style={{
                  marginTop: 8, padding: '8px 12px', borderRadius: 8,
                  background: '#f0fdfb', border: '1px solid rgba(14,155,132,0.2)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Se asignará:</span>
                  <RolBadge rol={form.rol} />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%', padding: '10px', fontSize: 13, fontWeight: 500,
                background: saving ? '#7fb3ac' : '#0e9b84',
                color: '#fff', border: 'none', borderRadius: 8,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {saving ? 'Creando usuario...' : 'Crear usuario'}
            </button>
          </form>
        </Card>
      </div>
    </PageWrapper>
  )
}

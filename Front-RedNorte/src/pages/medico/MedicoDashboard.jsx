import { useState, useEffect } from 'react'
import PageWrapper from '../../components/layout/PageWrapper'
import {
  MetricCard, Card, StatusPill, PriorityDot,
  Button, FilterPills, PageHeader, EmptyState, LoadingSpinner
} from '../../components/ui'
// 1. Importamos el servicio de la API
import { listaEsperaService } from '../../services'

const FILTROS = [
  { value: 'TODOS',      label: 'Todos'       },
  { value: 'EN_ESPERA',  label: 'En espera'   },
  { value: 'CONFIRMADO', label: 'Confirmados' },
  { value: 'CANCELADO',  label: 'Cancelados'  },
]

const ESPECIALIDADES = [
  'Cardiología','Traumatología','Neurología','Oftalmología',
  'Dermatología','Gastroenterología','Oncología','Pediatría',
  'Ginecología','Urología','Endocrinología','Reumatología',
]

const PRIORIDADES = ['ALTA', 'MEDIA', 'BAJA']

const EMPTY_FORM = {
  rutPaciente: '', especialidadDestino: '',
  patologiaSospecha: '', prioridad: '',
}

// ── Modal Nueva Consulta (Se mantiene igual, solo le pasamos el onCrear) ──
function NuevaConsultaModal({ onClose, onCrear }) {
  const [form,   setForm]   = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.rutPaciente.trim())       e.rutPaciente        = 'El RUT es requerido'
    if (!form.especialidadDestino)      e.especialidadDestino = 'Selecciona una especialidad'
    if (!form.patologiaSospecha.trim()) e.patologiaSospecha  = 'Ingresa la patología de sospecha'
    if (!form.prioridad)                e.prioridad          = 'Selecciona la prioridad'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    
    // Llamamos a la función asíncrona que nos pasaron por props
    await onCrear(form) 
    
    setSaving(false)
    onClose()
  }

  const inputStyle = (hasError) => ({
    width: '100%', padding: '9px 12px', fontSize: 13,
    border: `1px solid ${hasError ? '#fca5a5' : 'rgba(14,155,132,0.2)'}`,
    borderRadius: 8, background: '#f0fdfb',
    fontFamily: 'DM Sans, sans-serif', color: '#0f2421',
    outline: 'none', boxSizing: 'border-box',
  })

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(15,36,33,0.45)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        border: '1px solid rgba(14,155,132,0.12)',
      }}>
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid rgba(14,155,132,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ margin: 0, fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 16, color: '#0f2421' }}>
              Nueva consulta
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#7fb3ac' }}>
              Ingresa al paciente a la lista de espera
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: '50%', border: 'none',
            background: '#f0fdfb', cursor: 'pointer', fontSize: 18,
            color: '#7fb3ac', lineHeight: 1,
          }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }} noValidate>
          {/* ... (Todo el interior del formulario se mantiene idéntico a tu versión anterior) ... */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: '#3d6b64', display: 'block', marginBottom: 5, fontWeight: 500 }}>
              RUT del paciente
            </label>
            <input type="text" value={form.rutPaciente} onChange={e => set('rutPaciente', e.target.value)} placeholder="Ej: 12.345.678-9" style={inputStyle(!!errors.rutPaciente)} />
            {errors.rutPaciente && <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0' }}>{errors.rutPaciente}</p>}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: '#3d6b64', display: 'block', marginBottom: 5, fontWeight: 500 }}>
              Especialidad destino
            </label>
            <select value={form.especialidadDestino} onChange={e => set('especialidadDestino', e.target.value)} style={{ ...inputStyle(!!errors.especialidadDestino), cursor: 'pointer' }}>
              <option value="">Seleccionar especialidad...</option>
              {ESPECIALIDADES.map(esp => <option key={esp} value={esp}>{esp}</option>)}
            </select>
            {errors.especialidadDestino && <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0' }}>{errors.especialidadDestino}</p>}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: '#3d6b64', display: 'block', marginBottom: 5, fontWeight: 500 }}>
              Patología de sospecha
            </label>
            <textarea value={form.patologiaSospecha} onChange={e => set('patologiaSospecha', e.target.value)} placeholder="Describe la patología o motivo de derivación..." rows={3} style={{ ...inputStyle(!!errors.patologiaSospecha), resize: 'vertical', lineHeight: 1.5 }} />
            {errors.patologiaSospecha && <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0' }}>{errors.patologiaSospecha}</p>}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: '#3d6b64', display: 'block', marginBottom: 8, fontWeight: 500 }}>Prioridad</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {PRIORIDADES.map(p => {
                const cols = { ALTA:  { sel: '#fee2e2', border: '#ef4444', text: '#991b1b', dot: '#ef4444' }, MEDIA: { sel: '#fef3c7', border: '#f59e0b', text: '#92400e', dot: '#f59e0b' }, BAJA:  { sel: '#dcfce7', border: '#22c55e', text: '#15803d', dot: '#22c55e' } }
                const c = cols[p]
                const sel = form.prioridad === p
                return (
                  <button key={p} type="button" onClick={() => set('prioridad', p)} style={{ flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${sel ? c.border : 'rgba(14,155,132,0.2)'}`, background: sel ? c.sel : '#f0fdfb', color: sel ? c.text : '#3d6b64', fontSize: 13, fontWeight: sel ? 600 : 400, fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: sel ? c.dot : '#c8f1e8', display: 'inline-block' }} />
                    {p.charAt(0) + p.slice(1).toLowerCase()}
                  </button>
                )
              })}
            </div>
            {errors.prioridad && <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0' }}>{errors.prioridad}</p>}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', fontSize: 13, fontWeight: 500, background: '#f0fdfb', color: '#3d6b64', border: '1px solid rgba(14,155,132,0.2)', borderRadius: 8, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Cancelar</button>
            <button type="submit" disabled={saving} style={{ flex: 2, padding: '10px', fontSize: 13, fontWeight: 500, background: saving ? '#7fb3ac' : '#0e9b84', color: '#fff', border: 'none', borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              {saving ? 'Creando...' : 'Crear consulta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Dashboard Principal ───────────────────────────────────────────────────
export default function MedicoDashboard() {
  // 2. Quitamos el useData y creamos estados locales reales
  const [listaEspera, setListaEspera] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [filtro, setFiltro] = useState('TODOS')
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // 3. Cargamos los datos desde la API al montar el componente
  useEffect(() => {
    cargarCitas()
  }, [])

  const cargarCitas = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await listaEsperaService.getAll()
      // El backend devuelve un array de RegistroEspera
      setListaEspera(response.data || []) 
    } catch (err) {
      console.error("Error al cargar la lista de espera:", err)
      setError("No se pudo conectar con el servidor.")
    } finally {
      setLoading(false)
    }
  }

  // 4. Modificamos los Handlers para que hagan peticiones reales a la API
  const handleCrear = async (datos) => {
    try {
      await listaEsperaService.crear(datos)
      // Si se crea bien, volvemos a pedir la lista completa al backend
      await cargarCitas() 
    } catch (err) {
      console.error("Error al crear la consulta:", err)
      alert("Hubo un error al crear la consulta.")
    }
  }

  const handleConfirmar = async (id) => {
    try {
      // Tu compañero definió que esto es un PUT recibiendo { "estado": "NUEVO_ESTADO" }
      await listaEsperaService.actualizar(id, { estado: 'CONFIRMADO' })
      await cargarCitas()
      setSelected(prev => prev?.id === id ? { ...prev, estado: 'CONFIRMADO' } : prev)
    } catch (err) {
      console.error("Error al confirmar:", err)
      alert("Hubo un error al confirmar la cita.")
    }
  }

  const handleCancelar = async (id) => {
    try {
      // Tu compañero definió la cancelación como un POST en su controlador
      await listaEsperaService.cancelar(id)
      await cargarCitas()
      setSelected(prev => prev?.id === id ? { ...prev, estado: 'CANCELADO' } : prev)
    } catch (err) {
      console.error("Error al cancelar:", err)
      alert("Hubo un error al cancelar la cita.")
    }
  }

  // Lógica de filtrado y métricas (ahora usando listaEspera real)
  const citasFiltradas = listaEspera.filter(c =>
    filtro === 'TODOS' || c.estado === filtro
  )

  const total      = listaEspera.length
  const enEspera   = listaEspera.filter(c => c.estado === 'PENDIENTE' || c.estado === 'EN_ESPERA').length
  const confirmado = listaEspera.filter(c => c.estado === 'CONFIRMADO' || c.estado === 'ASIGNADO').length
  const cancelado  = listaEspera.filter(c => c.estado === 'CANCELADO').length

  return (
    <PageWrapper>
      {showModal && (
        <NuevaConsultaModal
          onClose={() => setShowModal(false)}
          onCrear={handleCrear}
        />
      )}

      <PageHeader
        title="Dashboard"
        subtitle="Dr. Juan Carrasco · Cardiología"
        action={<Button onClick={() => setShowModal(true)}>+ Nueva consulta</Button>}
      />

      {/* Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: '1.25rem' }}>
        <MetricCard label="Total en lista"  value={total}      badge="Histórico"    badgeVariant="default" />
        <MetricCard label="Pendientes"      value={enEspera}   badge="Sin asignar"  badgeVariant="warning" />
        <MetricCard label="Confirmados"     value={confirmado} badge="Listos"       badgeVariant="success" />
        <MetricCard label="Cancelados"      value={cancelado}  badge="Liberados"    badgeVariant="danger"  />
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: 10 }}>

        <Card
          title="Consultas y lista de espera"
          action={<FilterPills options={FILTROS} value={filtro} onChange={setFiltro} />}
        >
          {error ? (
             <EmptyState icon="⚠️" title="Error de conexión" description={error} />
          ) : loading ? (
             // Aquí podrías poner un componente <LoadingSpinner /> si lo tienes
             <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Cargando datos del servidor...</div>
          ) : citasFiltradas.length === 0 ? (
            <EmptyState icon="📅" title="Sin consultas" description="No hay entradas con este filtro" />
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Paciente / RUT', 'Especialidad', 'Patología sospecha', 'Fecha ingreso', 'Prioridad', 'Estado', ''].map(h => (
                    <th key={h} style={{
                      fontSize: 11, color: 'var(--text-muted)', textAlign: 'left',
                      padding: '0 0 10px', fontWeight: 400,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {citasFiltradas.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(selected?.id === c.id ? null : c)}
                    style={{
                      borderTop: '1px solid rgba(14,155,132,0.08)', cursor: 'pointer',
                      background: selected?.id === c.id ? 'rgba(14,155,132,0.04)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '10px 0' }}>
                      {/* Ojo: el backend de tu amigo usa rutPaciente pero no guarda nombrePaciente en la BD */}
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>Paciente</p>
                      <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{c.rutPaciente}</p>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '10px 8px' }}>{c.especialidadDestino}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '10px 8px', maxWidth: 180 }}>
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {c.patologiaSospecha}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', padding: '10px 8px' }}>{c.fechaIngreso}</td>
                    <td style={{ padding: '10px 8px' }}><PriorityDot priority={c.prioridad || 'MEDIA'} /></td>
                    <td style={{ padding: '10px 8px' }}><StatusPill status={c.estado || 'PENDIENTE'} /></td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontSize: 12, color: 'var(--teal-primary)' }}>Ver →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* Panel detalle */}
        {selected && (
          <Card title="Detalle">
            <div style={{ marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'var(--teal-light)', color: 'var(--teal-dark)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, fontSize: 16, marginBottom: 12,
              }}>
                PA
              </div>
              <p style={{ margin: '0 0 2px', fontWeight: 500, fontSize: 15 }}>Paciente</p>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{selected.rutPaciente}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {[
                ['Especialidad destino',  selected.especialidadDestino],
                ['Patología sospecha',    selected.patologiaSospecha],
                ['Fecha ingreso',         selected.fechaIngreso],
                ['Prioridad',             selected.prioridad || 'MEDIA'],
                ['Estado',                selected.estado || 'PENDIENTE'],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'var(--surface-3)', borderRadius: 8, padding: '10px 12px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{v}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="sm" onClick={() => handleConfirmar(selected.id)}>Confirmar</Button>
              <Button variant="danger" size="sm" onClick={() => handleCancelar(selected.id)}>Cancelar</Button>
            </div>
          </Card>
        )}
      </div>
    </PageWrapper>
  )
}
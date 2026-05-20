import { useState, useEffect } from 'react'
import PageWrapper from '../../components/layout/PageWrapper'
import {
  MetricCard, Card, Badge, StatusPill, PriorityDot,
  Button, FilterPills, PageHeader, EmptyState, LoadingSpinner
} from '../../components/ui'

// ✅ CORREGIDO: Importamos las capas de servicio unificadas. Ya no se usa 'api' directo en el componente.
import { listaEsperaService } from '../../services'
import { getResumenDashboard } from '../../services/dashboardService' 

const FILTROS = [
  { value: 'TODOS',       label: 'Todos'        },
  { value: 'PENDIENTE',   label: 'En espera'    }, 
  { value: 'EN_REVISION', label: 'En revisión'  }, 
  { value: 'CONFIRMADO',  label: 'Confirmados'  },
  { value: 'CANCELADO',   label: 'Cancelados'   },
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

// ── Modal Nueva Consulta ──
function NuevaConsultaModal({ onClose, onCrear }) {
  const [form,    setForm]   = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.rutPaciente.trim())       e.rutPaciente         = 'El RUT es requerido'
    if (!form.especialidadDestino)      e.especialidadDestino = 'Selecciona una especialidad'
    if (!form.patologiaSospecha.trim()) e.patologiaSospecha   = 'Ingresa la patología de sospecha'
    if (!form.prioridad)                e.prioridad           = 'Selecciona la prioridad'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
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

// ── Modal para Ingresar Motivo de Cancelación ──
function CancelarConsultaModal({ onClose, onConfirmarCancelar }) {
  const [motivo, setMotivo] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!motivo.trim()) {
      setError('Debes ingresar un motivo para cancelar la consulta.')
      return
    }
    onConfirmarCancelar(motivo)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 250,
      background: 'rgba(15,36,33,0.45)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(14,155,132,0.1)' }}>
          <p style={{ margin: 0, fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 15, color: '#0f2421' }}>
            🚨 Cancelar Consulta Médica
          </p>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#3d6b64', display: 'block', marginBottom: 6, fontWeight: 500 }}>
              Motivo de la Cancelación (Gatillará reasignación)
            </label>
            <textarea
              value={motivo}
              onChange={e => { setMotivo(e.target.value); setError('') }}
              placeholder="Ej: Paciente reagendó por motivos personales / Inasistencia..."
              rows={3}
              style={{
                width: '100%', padding: '9px 12px', fontSize: 13, borderRadius: 8,
                border: `1px solid ${error ? '#fca5a5' : 'rgba(14,155,132,0.2)'}`,
                background: '#fffdfd', outline: 'none', boxSizing: 'border-box',
                fontFamily: 'DM Sans, sans-serif', resize: 'none', lineHeight: 1.4
              }}
            />
            {error && <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0' }}>{error}</p>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '9px', fontSize: 13, background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: 8, cursor: 'pointer' }}>Volver</button>
            <button type="submit" style={{ flex: 2, padding: '9px', fontSize: 13, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 500, cursor: 'pointer' }}>Confirmar Cancelación</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Dashboard Principal ──
export default function MedicoDashboard() {
  const [listaEspera, setListaEspera] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [filtro, setFiltro] = useState('TODOS')
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const [resumen, setResumen] = useState({
    totalPacientes: 0,
    enEspera: 0,
    atencionesHoy: 0,
    tiempoPromedio: "0 min"
  });

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // ✅ CORREGIDO: Consumimos mediante la capa de servicio limpia que ya añade el prefijo '/bff'.
      // De esta forma evitamos usar el cliente Axios directo en la interfaz visual.
      const [resLista, resResumen] = await Promise.all([
        listaEsperaService.getAll(), 
        getResumenDashboard()
      ]);

      if (resLista && resLista.data) {
        setListaEspera(resLista.data);
      } else if (Array.isArray(resLista)) {
        setListaEspera(resLista);
      } else {
        setListaEspera([]);
      }

      if (resResumen) setResumen(resResumen);

    } catch (err) {
      console.error("Error al cargar los datos en la vista médica:", err)
      setError("No se pudo conectar con los servicios de RedNorte.")
    } finally {
      setLoading(false)
    }
  }

  const handleCrear = async (datos) => {
    try {
      await listaEsperaService.crear(datos);
      await cargarDatos(); 
      alert("✅ Registro guardado exitosamente en RedNorte");
    } catch (err) {
      console.error("Error al registrar:", err);
      alert("❌ Error: No se pudo conectar con el servicio de registro.");
    }
  }

  const handleConfirmar = async (id) => {
    try {
      await listaEsperaService.actualizar(id, { estado: 'CONFIRMADO' })
      await cargarDatos()
      setSelected(null)
    } catch (err) {
      console.error("Error al confirmar:", err)
    }
  }

  const handleCancelarConMotivo = async (motivoTexto) => {
    try {
      setLoading(true);
      
      const payload = {
        id: selected.id,
        rutPaciente: selected.rutPaciente,
        especialidadDestino: selected.especialidadDestino,
        motivo: motivoTexto
      };

      // ✅ CORREGIDO: Usamos el método de reasignación orquestada de tu clase de servicio.
      // Así se mapea perfecto de forma interna mediante el API Gateway.
      await listaEsperaService.cancelarYReasignar(payload);
      
      alert("✕ Consulta cancelada. El flujo de reasignación automática ha sido activado.");
      await cargarDatos();
      setSelected(null);
    } catch (err) {
      console.error("Error en flujo de cancelación/reasignación:", err);
      alert("❌ Error de comunicación con el orquestador de reasignación.");
    } finally {
      setLoading(false);
    }
  }

  const citasFiltradas = listaEspera.filter(c =>
    filtro === 'TODOS' || c.estado === filtro
  )

  const formatFechaChilena = (fechaString) => {
    if (!fechaString) return 'No registrada';
    return new Date(fechaString + 'T00:00:00').toLocaleDateString('es-CL');
  }

  return (
    <PageWrapper>
      {showModal && (
        <NuevaConsultaModal
          onClose={() => setShowModal(false)}
          onCrear={handleCrear}
        />
      )}

      {showCancelModal && (
        <CancelarConsultaModal
          onClose={() => setShowCancelModal(false)}
          onConfirmarCancelar={handleCancelarConMotivo}
        />
      )}

      <PageHeader
        title="Dashboard Médico"
        subtitle="Servicio de Salud RedNorte · Gestión de Listas"
        action={<Button onClick={() => setShowModal(true)}>+ Nueva consulta</Button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: '1.25rem' }}>
        <MetricCard label="Total Pacientes" value={resumen.totalPacientes} badge="Histórico" badgeVariant="default" />
        <MetricCard label="Atenciones Hoy" value={resumen.atencionesHoy} badge="Hoy" badgeVariant="success" />
        <MetricCard label="En Espera" value={resumen.enEspera} badge="Pendientes" badgeVariant="warning" />
        <MetricCard label="Tiempo Promedio" value={resumen.tiempoPromedio} badge="Eficiencia" badgeVariant="danger" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: 10 }}>

        <Card title="Consultas y lista de espera" action={<FilterPills options={FILTROS} value={filtro} onChange={setFiltro} />}>
          {error ? (
              <EmptyState icon="⚠️" title="Error de conexión" description={error} />
          ) : loading ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <LoadingSpinner />
                <p style={{ marginTop: 12, color: '#7fb3ac', fontSize: 13 }}>Sincronizando con RedNorte...</p>
              </div>
          ) : citasFiltradas.length === 0 ? (
            <EmptyState icon="📅" title="Sin consultas" description="No hay registros para mostrar." />
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Paciente / RUT', 'Especialidad', 'Patología sospecha', 'Fecha ingreso', 'Prioridad', 'Estado', ''].map(h => (
                    <th key={h} style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'left', padding: '0 0 10px', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {citasFiltradas.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(selected?.id === c.id ? null : c)}
                    style={{ borderTop: '1px solid rgba(14,155,132,0.08)', cursor: 'pointer', background: selected?.id === c.id ? 'rgba(14,155,132,0.04)' : 'transparent' }}
                  >
                    <td style={{ padding: '12px 0' }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#0f2421' }}>{c.nombreCompleto || 'Sin Nombre'}</p>
                      <p style={{ margin: '1px 0 3px', fontSize: 11, color: '#6b7280', fontWeight: 400 }}>{c.email || 'sin-email@rednorte.cl'}</p>
                      <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{c.rutPaciente}</p>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '10px 8px' }}>{c.especialidadDestino}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '10px 8px', maxWidth: 180 }}>
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.patologiaSospecha}</span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', padding: '10px 8px' }}>{formatFechaChilena(c.fechaIngreso)}</td>
                    <td style={{ padding: '10px 8px' }}><PriorityDot priority={c.prioridad || 'MEDIA'} /></td>
                    <td style={{ padding: '10px 8px' }}><StatusPill status={c.estado || 'PENDIENTE'} /></td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontSize: 12, color: 'var(--teal-primary)' }}>Ver →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {selected && (
          <Card title="Detalle del Paciente">
            <div style={{ marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--teal-light)', color: 'var(--teal-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
                {selected.nombreCompleto 
                  ? selected.nombreCompleto.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() 
                  : 'PA'}
              </div>
              <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 15, color: '#0f2421' }}>{selected.nombreCompleto || 'Paciente en Lista'}</p>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{selected.rutPaciente}</p>
              {selected.email && <p style={{ margin: '3px 0 0', fontSize: 11, color: '#6b7280' }}>{selected.email}</p>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {[
                ['Especialidad',  selected.especialidadDestino],
                ['Patología',     selected.patologiaSospecha],
                ['Ingreso',       formatFechaChilena(selected.fechaIngreso)],
                ['Prioridad',     selected.prioridad || 'MEDIA'],
                ['Estado',        selected.estado || 'PENDIENTE'],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'var(--surface-3)', borderRadius: 8, padding: '10px 12px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{k}</p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{v}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="sm" onClick={() => handleConfirmar(selected.id)}>Confirmar</Button>
              <Button variant="danger" size="sm" onClick={() => setShowCancelModal(true)}>Cancelar</Button>
            </div>
          </Card>
        )}
      </div>
    </PageWrapper>
  )         
}
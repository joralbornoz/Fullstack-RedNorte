import { useState, useEffect } from 'react'
import PageWrapper from '../../components/layout/PageWrapper'
import { MetricCard, Card, Badge, StatusPill, PriorityDot, EmptyState, LoadingSpinner, PageHeader, FilterPills } from '../../components/ui'
import { listaEsperaService } from '../../services'

const FILTROS = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'ALTA', label: 'Prioridad alta' },
  { value: 'PENDIENTE', label: 'En espera' },
  { value: 'CONFIRMADO', label: 'Confirmados' },
]

// Mantenemos actividad como mock temporal ya que el backend aún no tiene historial de auditoría
const MOCK_ACTIVIDAD = [
  { id: 1, tipo: 'alerta', texto: 'Sistema conectado correctamente al backend', tiempo: 'Hace 1 min', sub: 'Servicio en línea' },
]

const iconoActividad = { cancelacion: '✕', exito: '✓', alerta: '!' }
const colorActividad = {
  cancelacion: { bg: '#fee2e2', color: '#991b1b' },
  exito:       { bg: '#dcfce7', color: '#15803d' },
  alerta:      { bg: '#fef3c7', color: '#92400e' },
}

export default function AdminDashboard() {
  const [lista, setLista] = useState([])
  const [metricas, setMetricas] = useState({ totalEspera: 0, confirmadas: 0, canceladas: 0 })
  const [filtro, setFiltro] = useState('TODOS')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const response = await listaEsperaService.getAll()
      const data = response.data || []
      setLista(data)
      
      // Calculamos las métricas dinámicamente en base a lo que responde el backend
      setMetricas({
        totalEspera: data.filter(p => p.estado === 'PENDIENTE' || p.estado === 'EN_ESPERA').length,
        confirmadas: data.filter(p => p.estado === 'CONFIRMADO' || p.estado === 'ASIGNADO').length,
        canceladas:  data.filter(p => p.estado === 'CANCELADO').length
      })
    } catch (err) {
      console.error("Error cargando dashboard:", err)
      setError("No se pudo cargar la información del servidor.")
    } finally {
      setLoading(false)
    }
  }

  const listaFiltrada = lista.filter(p =>
    filtro === 'TODOS' ? true :
    filtro === 'ALTA'  ? p.prioridad === 'ALTA' :
    p.estado === filtro
  )

  // Función para calcular días en espera desde la fecha de ingreso
  const calcularDias = (fechaIngreso) => {
    if (!fechaIngreso) return 0;
    const diff = new Date() - new Date(fechaIngreso)
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Dashboard de Administración"
        subtitle="Vista general del sistema — Servicio de Salud RedNorte"
        action={<button onClick={cargarDatos} style={{ background: 'none', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Actualizar ↻</button>}
      />

      {/* Métricas Dinámicas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: '1.25rem' }}>
        <MetricCard label="En espera" value={metricas.totalEspera} badge="Pendientes" badgeVariant="warning" icon="🕐" />
        <MetricCard label="Confirmadas" value={metricas.confirmadas} badge="Asignadas" badgeVariant="success" icon="✓" />
        <MetricCard label="Cancelaciones" value={metricas.canceladas} badge="Liberadas" badgeVariant="danger" icon="✕" />
        <MetricCard label="Total Histórico" value={lista.length} badge="Registros" badgeVariant="default" icon="📊" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 10 }}>
        {/* Tabla lista de espera */}
        <Card
          title="Todos los pacientes registrados"
          action={<FilterPills options={FILTROS} value={filtro} onChange={setFiltro} />}
        >
          {error ? (
            <EmptyState icon="⚠️" title="Error de servidor" description={error} />
          ) : loading ? (
            <LoadingSpinner />
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['RUT Paciente', 'Especialidad', 'Días', 'Prioridad', 'Estado'].map(h => (
                    <th key={h} style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'left', padding: '0 0 10px', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listaFiltrada.length === 0 ? (
                  <tr><td colSpan={5}><EmptyState title="Sin resultados" description="No hay pacientes con este filtro" /></td></tr>
                ) : listaFiltrada.map(p => {
                  const dias = calcularDias(p.fechaIngreso);
                  return (
                    <tr key={p.id} style={{ borderTop: '1px solid rgba(14,155,132,0.08)' }}>
                      <td style={{ padding: '10px 0' }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{p.rutPaciente}</p>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '10px 8px' }}>{p.especialidadDestino}</td>
                      <td style={{ fontSize: 13, padding: '10px 8px', fontWeight: dias > 90 ? 500 : 400, color: dias > 90 ? '#991b1b' : 'var(--text-primary)' }}>
                        {dias}
                      </td>
                      <td style={{ padding: '10px 8px' }}><PriorityDot priority={p.prioridad || 'MEDIA'} /></td>
                      <td style={{ padding: '10px 8px' }}><StatusPill status={p.estado || 'PENDIENTE'} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </Card>

        {/* Panel actividad (Mock) */}
        <Card title="Actividad del Sistema">
          {MOCK_ACTIVIDAD.map(a => {
            const c = colorActividad[a.tipo]
            return (
              <div key={a.id} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                  {iconoActividad[a.tipo]}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{a.texto}</p>
                  {a.sub && <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{a.sub}</p>}
                  <p style={{ margin: '3px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>{a.tiempo}</p>
                </div>
              </div>
            )
          })}
        </Card>
      </div>
    </PageWrapper>
  )
}
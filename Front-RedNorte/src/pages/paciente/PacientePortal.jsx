import { useState } from 'react'
import PageWrapper from '../../components/layout/PageWrapper'
import { Card, StatusPill, PageHeader, EmptyState, LoadingSpinner, Button } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { pacienteService } from '../../services' // Usamos el servicio que acabamos de arreglar

function ProgressBar({ value, max, color = 'var(--teal-primary)' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div style={{ background: 'var(--teal-light)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.5s ease' }} />
    </div>
  )
}

export default function PacientePortal() {
  const { user } = useAuth() 
  const [idBusqueda, setIdBusqueda] = useState('')
  const [cita, setCita] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Esta función hace la llamada real al BFF de tu compañero
  const handleBuscar = async (e) => {
    e.preventDefault()
    if (!idBusqueda.trim()) return

    try {
      setLoading(true)
      setError(null)
      setCita(null) // Limpiamos la búsqueda anterior
      
      const response = await pacienteService.getDetallePaciente(idBusqueda)
      setCita(response.data) // Guardamos el PacienteDetalleDTO que nos manda el BFF
      
    } catch (err) {
      console.error("Error al conectar con el BFF:", err)
      setError("No pudimos encontrar la interconsulta. Verifica el ID o intenta más tarde.")
    } finally {
      setLoading(false)
    }
  }

  // Como el backend no manda fecha de ingreso en este DTO, simulamos el progreso para la demo
  const diasSimulados = 45 
  const diasTotalesEst = 100 

  return (
    <PageWrapper>
      <PageHeader
        title={`Portal del Paciente`}
        subtitle={`RUT asociado: ${user?.rut} — Consulta el estado de tu derivación médica`}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 10, marginBottom: 10 }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* BUSCADOR */}
          <Card title="Consultar Interconsulta">
            <form onSubmit={handleBuscar} style={{ display: 'flex', gap: 10 }}>
              <input 
                type="text" 
                placeholder="Ingresa el ID de tu interconsulta (Ej: 1, 2, 123...)"
                value={idBusqueda}
                onChange={(e) => setIdBusqueda(e.target.value)}
                style={{
                  flex: 1, padding: '10px 14px', fontSize: 14,
                  border: '1px solid var(--border)', borderRadius: 8,
                  outline: 'none', fontFamily: 'DM Sans, sans-serif'
                }}
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
            </form>
          </Card>

          {/* RESULTADO DE LA BÚSQUEDA */}
          {error && (
            <Card><EmptyState icon="⚠️" title="Sin resultados" description={error} /></Card>
          )}

          {loading && (
            <Card><div style={{ padding: '2rem' }}><LoadingSpinner /></div></Card>
          )}

          {!loading && !error && !cita && (
            <Card><EmptyState icon="🏥" title="Ingresa tu ID" description="Escribe el número de tu interconsulta arriba para ver los detalles y el estado." /></Card>
          )}

          {/* TARJETA CON DATOS REALES DEL BFF */}
          {cita && (
            <Card title={`Resultados para ID: #${cita.idInterconsulta}`}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: 500, fontSize: 16, fontFamily: 'Sora, sans-serif' }}>
                    {cita.especialidad}
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
                    Paciente: {cita.nombreCompleto} ({cita.rut})
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
                    Contacto: {cita.email} | {cita.numeroTelefono}
                  </p>
                </div>
                <StatusPill status={cita.estado} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
                <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--border)' }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prioridad</p>
                  <p style={{ margin: '0 0 3px', fontSize: 20, fontWeight: 500, fontFamily: 'Sora, sans-serif', color: 'var(--text-primary)' }}>{cita.prioridad}</p>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Evaluación médica</p>
                </div>
                
                <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--border)' }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado Actual</p>
                  <p style={{ margin: '0 0 3px', fontSize: 20, fontWeight: 500, fontFamily: 'Sora, sans-serif', color: 'var(--text-primary)' }}>{cita.estado}</p>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Sistema central</p>
                </div>
              </div>

              {cita.estado === 'PENDIENTE' || cita.estado === 'EN_ESPERA' ? (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Tiempo estimado de procesamiento</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--teal-dark)' }}>{Math.min(100, Math.round((diasSimulados / diasTotalesEst) * 100))}%</span>
                  </div>
                  <ProgressBar value={diasSimulados} max={diasTotalesEst} />
                </div>
              ) : null}
            </Card>
          )}
        </div>

        {/* Panel lateral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Card title="Notificaciones">
            <EmptyState icon="🔔" title="Sin notificaciones" description="Te avisaremos cuando tu hora sea asignada." />
          </Card>
          <Card>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ fontSize: 24 }}>ℹ️</div>
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 500, fontSize: 13 }}>¿Qué hacer mientras esperas?</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>
                  Si tu situación de salud cambia, contacta a tu médico de cabecera.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
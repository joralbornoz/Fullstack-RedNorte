import { useState, useEffect } from 'react'
import PageWrapper from '../../components/layout/PageWrapper'
import { Card, StatusPill, PageHeader, EmptyState, LoadingSpinner } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { pacienteService } from '../../services'

// Componente visual para el progreso de la espera
function ProgressBar({ value, max, color = 'var(--teal-primary)' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div style={{ background: 'var(--teal-light)', borderRadius: 99, height: 6, overflow: 'hidden', marginTop: 8 }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.5s ease' }} />
    </div>
  )
}

export default function PacientePortal() {
  const { user } = useAuth() 
  const [atenciones, setAtenciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Sincronización automática mediante el RUT del Contexto global
  useEffect(() => {
    if (user?.rut) {
      cargarMisAtenciones(user.rut)
    } else {
      setLoading(false)
    }
  }, [user])

  const cargarMisAtenciones = async (rut) => {
    try {
      setLoading(true)
      setError(null)
      console.log(`🏥 [PacientePortal] Solicitando consultas al BFF para el RUT: ${rut}`)
      
      const resultado = await pacienteService.obtenerMisConsultas(rut)
      console.log("📥 [PacientePortal] Datos recibidos desde la aduana del Gateway:", resultado);
      
      // 🚀 CAPA DE DESEMPAQUE ULTRA-DEFENSIVA: Sincronizada con el Mono<ResponseEntity<Object>> de Spring
      let listadoExtraido = null;

      if (Array.isArray(resultado)) {
        // Caso A: Arreglo directo en la raíz
        listadoExtraido = resultado;
      } else if (resultado && Array.isArray(resultado.body)) {
        // Caso B: Viene dentro de la propiedad 'body' del ResponseEntity de Java
        listadoExtraido = resultado.body;
      } else if (resultado && resultado.data && Array.isArray(resultado.data)) {
        // Caso C: Envoltura clásica de Axios
        listadoExtraido = resultado.data;
      } else if (resultado && resultado.data && Array.isArray(resultado.data.body)) {
        // Caso D: Axios + ResponseEntity combinado
        listadoExtraido = resultado.data.body;
      } else if (resultado && resultado.data && resultado.data.data && Array.isArray(resultado.data.data)) {
        // Caso E: Doble envoltorio de datos operacionales de RedNorte
        listadoExtraido = resultado.data.data;
      }

      if (listadoExtraido) {
        console.log(`✅ [PacientePortal] Sincronización exitosa. Mapeados ${listadoExtraido.length} registros reales.`);
        setAtenciones(listadoExtraido);
      } else {
        console.warn("⚠️ [PacientePortal] El backend respondió pero el formato no contiene un arreglo compatible.");
        setAtenciones([]);
      }

    } catch (err) {
      console.error("❌ [PacientePortal] Error crítico al capturar las interconsultas:", err)
      setError("No pudimos cargar tu historial de interconsultas. Intenta más tarde.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Mis Interconsultas"
        subtitle={`RUT: ${user?.rut || 'No identificado'} — Revisa el estado de tus derivaciones en la RedNorte`}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        
        {/* COLUMNA PRINCIPAL: LISTA DE ATENCIONES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {loading ? (
            <Card><div style={{ padding: '3rem', textAlign: 'center' }}><LoadingSpinner /></div></Card>
          ) : error ? (
            <Card><EmptyState icon="⚠️" title="Error de conexión" description={error} /></Card>
          ) : atenciones.length === 0 ? (
            <Card>
              <EmptyState 
                icon="🏥" 
                title="Sin interconsultas vigentes" 
                description="Actualmente no tienes derivaciones activas en el sistema de lista de espera." 
              />
            </Card>
          ) : (
            atenciones.map((item) => (
              <Card key={item.id} title={`Folio: #${item.id}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: 16, color: 'var(--text-primary)' }}>{item.especialidadDestino}</h3>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <strong>Patología:</strong> {item.patologiaSospecha}
                    </p>
                  </div>
                  <StatusPill status={item.estado || 'PENDIENTE'} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Prioridad Asignada</span>
                    <p style={{ margin: '4px 0 0', fontWeight: 600, color: 'var(--teal-dark)' }}>{item.prioridad || 'MEDIA'}</p>
                  </div>
                  <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Fecha de Ingreso</span>
                    <p style={{ margin: '4px 0 0', fontWeight: 600 }}>
                      {item.fechaIngreso ? new Date(item.fechaIngreso + 'T00:00:00').toLocaleDateString('es-CL') : 'Procesando...'}
                    </p>
                  </div>
                </div>

                {/* Barra de progreso visual si está en espera */}
                {(item.estado === 'PENDIENTE' || item.estado === 'EN_ESPERA') && (
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#64748b' }}>Progreso de la solicitud</span>
                      <span style={{ fontWeight: 500, color: 'var(--teal-primary)' }}>En revisión médica</span>
                    </div>
                    <ProgressBar value={40} max={100} />
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        {/* COLUMNA LATERAL: INFORMACIÓN ADICIONAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="Resumen">
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <p style={{ fontSize: 32, fontWeight: 700, margin: 0, color: 'var(--teal-primary)' }}>
                {atenciones.length}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Atenciones totales</p>
            </div>
          </Card>

          <Card>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 20 }}>💡</span>
              <p style={{ fontSize: 12, margin: 0, lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                <strong>¿Sabías qué?</strong> El estado de tu interconsulta se actualiza en tiempo real según la disponibilidad de especialistas en la RedNorte.
              </p>
            </div>
          </Card>

          <Card title="Ayuda">
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 10px' }}>
              Si los datos de tu interconsulta son incorrectos, acude a tu centro de salud de origen.
            </p>
            <button style={{ 
              width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--teal-primary)',
              background: 'transparent', color: 'var(--teal-primary)', fontSize: 12, fontWeight: 500, cursor: 'pointer'
            }}>
              Ver tutorial de estados
            </button>
          </Card>
        </div>

      </div>
    </PageWrapper>
  )
}
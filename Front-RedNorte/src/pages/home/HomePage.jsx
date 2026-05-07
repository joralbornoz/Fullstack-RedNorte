import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

// ── Datos ──────────────────────────────────────────────────────────────────
const STATS = [
  { value: '48+', label: 'Establecimientos en la red' },
  { value: '1.2M', label: 'Pacientes atendidos' },
  { value: '94%', label: 'Tasa de reasignación exitosa' },
  { value: '< 48h', label: 'Tiempo promedio de notificación' },
]

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <path d="M9 12h6M9 16h4"/>
      </svg>
    ),
    title: 'Lista de espera inteligente',
    desc: 'Gestión centralizada con priorización automática según diagnóstico, urgencia y tiempo de espera.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16v4H4z"/><path d="M4 12h16v4H4z"/>
        <path d="M4 20h8"/><circle cx="18" cy="20" r="2"/>
        <path d="M16 20h-4"/>
      </svg>
    ),
    title: 'Reasignación automática',
    desc: 'Cuando se cancela una cita, el sistema detecta horas disponibles y reasigna al siguiente paciente en lista.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    title: 'Portal del paciente',
    desc: 'Cada paciente puede consultar su posición en lista, fecha estimada de atención y recibir notificaciones en tiempo real.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    title: 'Red de establecimientos',
    desc: 'Integración entre hospitales, clínicas y centros de atención primaria en toda la red RedNorte.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6"/>
      </svg>
    ),
    title: 'Reportes y métricas',
    desc: 'Indicadores de gestión en tiempo real: tiempos de espera, tasas de cancelación, ocupación por especialidad.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Acceso por roles',
    desc: 'Tres perfiles diferenciados: administrador, médico y paciente, cada uno con vistas y permisos propios.',
  },
]

const STEPS = [
  { n: '01', title: 'El paciente ingresa a lista', desc: 'El médico registra la solicitud con diagnóstico y nivel de prioridad.' },
  { n: '02', title: 'El sistema prioriza', desc: 'El algoritmo ordena la lista considerando urgencia, especialidad y tiempo en espera.' },
  { n: '03', title: 'Se asigna una hora', desc: 'Cuando hay disponibilidad, se genera una cita asignada automáticamente.' },
  { n: '04', title: 'El paciente es notificado', desc: 'Llega una notificación con fecha, establecimiento y médico asignado.' },
]

// ── Componente principal ───────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#0f2421', overflowX: 'hidden' }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 2rem', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(14,155,132,0.12)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #2dd4bf, #0e9b84)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C8.13 3 5 6.13 5 10c0 2.74 1.49 5.14 3.7 6.44V18h6.6v-1.56C17.51 15.14 19 12.74 19 10c0-3.87-3.13-7-7-7z" fill="white"/>
              <rect x="9" y="18" width="6" height="2" rx="1" fill="white" opacity="0.75"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 16, color: scrolled ? '#076457' : '#ffffff' }}>
            RedNorte
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '8px 22px', borderRadius: 20, fontSize: 13, fontWeight: 500,
              background: 'rgba(255,255,255,0.15)', color: scrolled ? '#0e9b84' : '#fff',
              border: `1.5px solid ${scrolled ? '#0e9b84' : 'rgba(255,255,255,0.5)'}`,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s ease',
            }}
          >
            Iniciar sesión
          </button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #065f55 0%, #0e9b84 45%, #2dd4bf 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '100px 2rem 4rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Círculos decorativos */}
        <div style={{ position: 'absolute', top: '8%', right: '6%', width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '12%', right: '10%', width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '4%', width: 260, height: 260, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 20, padding: '6px 16px', marginBottom: '1.5rem',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#a7f3d0', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
            Servicio Público de Salud · Región Norte
          </span>
        </div>

        {/* Título */}
        <h1 style={{
          fontFamily: "'Sora', sans-serif", fontWeight: 600,
          fontSize: 'clamp(2.4rem, 5vw, 4rem)',
          color: '#ffffff', textAlign: 'center',
          lineHeight: 1.15, marginBottom: '1.25rem',
          maxWidth: 760,
        }}>
          Gestión inteligente de<br />
          <span style={{ color: '#a7f3d0' }}>listas de espera</span> hospitalarias
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.8)',
          textAlign: 'center', maxWidth: 560, lineHeight: 1.7, marginBottom: '2.5rem',
        }}>
          Una plataforma que conecta pacientes, médicos y administradores para reducir tiempos de espera y mejorar la atención médica en toda la red.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '13px 32px', borderRadius: 20, fontSize: 14, fontWeight: 600,
              background: '#ffffff', color: '#0e9b84', border: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)' }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)' }}
          >
            Acceder al sistema
          </button>
          <a href="#como-funciona" style={{
            padding: '13px 32px', borderRadius: 20, fontSize: 14, fontWeight: 500,
            background: 'rgba(255,255,255,0.1)', color: '#ffffff',
            border: '1.5px solid rgba(255,255,255,0.3)', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", textDecoration: 'none',
            backdropFilter: 'blur(8px)', display: 'inline-block',
          }}>
            Cómo funciona
          </a>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>SCROLL</span>
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.2)' }} />
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────── */}
      <section style={{
        background: '#ffffff',
        padding: '4rem 2rem',
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 0, maxWidth: 900, width: '100%',
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: '2rem 1.5rem', textAlign: 'center',
              borderRight: i < STATS.length - 1 ? '1px solid rgba(14,155,132,0.12)' : 'none',
            }}>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.4rem', fontWeight: 600, color: '#0e9b84', margin: '0 0 6px' }}>
                {s.value}
              </p>
              <p style={{ fontSize: 13, color: '#3d6b64', margin: 0, lineHeight: 1.4 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────── */}
      <section style={{ background: '#f0fdfb', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{
              fontSize: 12, fontWeight: 600, letterSpacing: '0.12em',
              color: '#0e9b84', textTransform: 'uppercase',
            }}>Módulos del sistema</span>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '2rem', fontWeight: 600, color: '#0f2421', margin: '12px 0 0' }}>
              Todo lo que necesitas en un solo lugar
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: '#ffffff', borderRadius: 16,
                border: '1px solid rgba(14,155,132,0.1)',
                padding: '1.75rem', transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(14,155,132,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: '#e1f5ee', color: '#0e9b84',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1rem',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '1rem', fontWeight: 600, color: '#0f2421', margin: '0 0 8px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 13.5, color: '#3d6b64', margin: 0, lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ──────────────────────────────────────────────── */}
      <section id="como-funciona" style={{ background: '#ffffff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', color: '#0e9b84', textTransform: 'uppercase' }}>
              Flujo del proceso
            </span>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '2rem', fontWeight: 600, color: '#0f2421', margin: '12px 0 0' }}>
              ¿Cómo funciona?
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', position: 'relative' }}>
                {/* Línea vertical */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: 'absolute', left: 27, top: 52, width: 1,
                    height: 'calc(100% - 8px)',
                    background: 'linear-gradient(to bottom, #0e9b84, rgba(14,155,132,0.1))',
                  }} />
                )}
                {/* Número */}
                <div style={{
                  width: 54, height: 54, borderRadius: '50%', flexShrink: 0,
                  background: i === 0 ? 'linear-gradient(135deg, #0e9b84, #2dd4bf)' : '#f0fdfb',
                  border: `2px solid ${i === 0 ? 'transparent' : 'rgba(14,155,132,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 14,
                  color: i === 0 ? '#ffffff' : '#0e9b84',
                  zIndex: 1,
                }}>
                  {s.n}
                </div>
                {/* Contenido */}
                <div style={{ paddingBottom: '2.5rem' }}>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.05rem', fontWeight: 600, color: '#0f2421', margin: '12px 0 6px' }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 13.5, color: '#3d6b64', margin: 0, lineHeight: 1.65 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ──────────────────────────────────────────────────────── */}
      <section style={{ background: '#f0fdfb', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', color: '#0e9b84', textTransform: 'uppercase' }}>
              Acceso personalizado
            </span>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '2rem', fontWeight: 600, color: '#0f2421', margin: '12px 0 0' }}>
              Una plataforma, tres experiencias
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { rol: 'Paciente', color: '#2dd4bf', bg: 'linear-gradient(135deg, #0e9b84, #2dd4bf)', desc: 'Consulta tu posición en lista, fecha estimada de atención y recibe notificaciones en tiempo real.' },
              { rol: 'Médico', color: '#0e9b84', bg: 'linear-gradient(135deg, #065f55, #0e9b84)', desc: 'Gestiona tu lista de espera, confirma o cancela citas y visualiza los pacientes que te corresponden.' },
              { rol: 'Administrador', color: '#076457', bg: 'linear-gradient(135deg, #04342c, #076457)', desc: 'Acceso completo a métricas, reasignaciones, gestión de usuarios y reportes del sistema.' },
            ].map((r, i) => (
              <div key={i} style={{
                borderRadius: 20, overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(14,155,132,0.1)',
              }}>
                <div style={{ background: r.bg, padding: '2rem 1.75rem 1.5rem' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
                    Perfil
                  </span>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.5rem', fontWeight: 600, color: '#fff', margin: '6px 0 0' }}>
                    {r.rol}
                  </h3>
                </div>
                <div style={{ background: '#fff', padding: '1.5rem 1.75rem 2rem' }}>
                  <p style={{ fontSize: 13.5, color: '#3d6b64', margin: '0 0 1.25rem', lineHeight: 1.65 }}>
                    {r.desc}
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    style={{
                      fontSize: 13, fontWeight: 500, color: '#0e9b84',
                      background: '#f0fdfb', border: '1px solid rgba(14,155,132,0.2)',
                      borderRadius: 20, padding: '7px 20px', cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Ingresar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #065f55 0%, #0e9b84 100%)',
        padding: '5rem 2rem', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '2rem', fontWeight: 600, color: '#fff', margin: '0 0 1rem' }}>
            ¿Eres parte de la red RedNorte?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
            Accede con tus credenciales institucionales para gestionar listas de espera o consultar el estado de tu atención.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '14px 36px', borderRadius: 20, fontSize: 15, fontWeight: 600,
              background: '#ffffff', color: '#0e9b84', border: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            }}
          >
            Iniciar sesión
          </button>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer style={{ background: '#0f2421', padding: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(45,212,191,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2dd4bf' }} />
          </div>
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 14, color: '#ccfaf2' }}>RedNorte</span>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
          Servicio Público de Salud · DSY1106 Desarrollo Fullstack III
        </p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@400;500;600&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  )
}

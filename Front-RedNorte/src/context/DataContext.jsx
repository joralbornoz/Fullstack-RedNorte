import { createContext, useContext, useState } from 'react'

const DataContext = createContext(null)

// ── Estado inicial mock ────────────────────────────────────────────────────
const USUARIOS_INICIAL = [
  { id: '1', nombreCompleto: 'Juan Carrasco',  email: 'jcarrasco@rednorte.cl', rut: '12.345.678-9', numeroTelefono: '+56987654321', rol: 'MEDICO',   activo: true  },
  { id: '2', nombreCompleto: 'Patricia Soto',  email: 'psoto@rednorte.cl',     rut: '9.876.543-2',  numeroTelefono: '+56912345678', rol: 'MEDICO',   activo: true  },
  { id: '3', nombreCompleto: 'María González', email: 'mgonzalez@email.cl',    rut: '15.432.109-K', numeroTelefono: '+56911223344', rol: 'PACIENTE', activo: true  },
  { id: '4', nombreCompleto: 'Roberto Díaz',   email: 'rdiaz@rednorte.cl',     rut: '8.123.456-7',  numeroTelefono: '+56900000001', rol: 'ADMIN',    activo: false },
]

const LISTA_ESPERA_INICIAL = [
  { id: 'le1', rutPaciente: '12.345.678-9', nombrePaciente: 'María González',  hora: '09:30', especialidadDestino: 'Cardiología',  patologiaSospecha: 'Arritmia severa',    estado: 'EN_ESPERA',  prioridad: 'ALTA',  fechaIngreso: '2025-01-15' },
  { id: 'le2', rutPaciente: '9.876.543-2',  nombrePaciente: 'Carlos Pérez',    hora: '10:00', especialidadDestino: 'Cardiología',  patologiaSospecha: 'Control post-op',    estado: 'CONFIRMADO', prioridad: 'MEDIA', fechaIngreso: '2025-02-20' },
  { id: 'le3', rutPaciente: '15.432.109-K', nombrePaciente: 'Ana Rojas',       hora: '11:15', especialidadDestino: 'Cardiología',  patologiaSospecha: 'Evaluación general', estado: 'EN_ESPERA',  prioridad: 'ALTA',  fechaIngreso: '2025-01-10' },
  { id: 'le4', rutPaciente: '7.654.321-8',  nombrePaciente: 'Pedro Saavedra',  hora: '12:00', especialidadDestino: 'Cardiología',  patologiaSospecha: 'Chequeo rutinario',  estado: 'CONFIRMADO', prioridad: 'BAJA',  fechaIngreso: '2025-03-01' },
  { id: 'le5', rutPaciente: '11.222.333-4', nombrePaciente: 'Rosa Vidal',      hora: '14:30', especialidadDestino: 'Cardiología',  patologiaSospecha: 'Hipertensión',       estado: 'CANCELADO',  prioridad: 'MEDIA', fechaIngreso: '2025-02-10' },
]

export function DataProvider({ children }) {
  const [usuarios,     setUsuarios]     = useState(USUARIOS_INICIAL)
  const [listaEspera,  setListaEspera]  = useState(LISTA_ESPERA_INICIAL)

  // ── Usuarios ───────────────────────────────────────────────────────────
  function crearUsuario(datos) {
    const nuevo = {
      ...datos,
      id: `u${Date.now()}`,
      activo: true,
    }
    setUsuarios(prev => [nuevo, ...prev])
    return nuevo
  }

  // ── Lista de espera / consultas ────────────────────────────────────────
  function crearConsulta(datos) {
    const nueva = {
      ...datos,
      id: `le${Date.now()}`,
      estado: 'EN_ESPERA',
      fechaIngreso: new Date().toISOString().split('T')[0],
      hora: '—',
      nombrePaciente: datos.nombrePaciente || `Paciente (${datos.rutPaciente})`,
    }
    setListaEspera(prev => [nueva, ...prev])
    return nueva
  }

  function actualizarEstadoConsulta(id, nuevoEstado) {
    setListaEspera(prev =>
      prev.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c)
    )
  }

  return (
    <DataContext.Provider value={{
      usuarios,
      listaEspera,
      crearUsuario,
      crearConsulta,
      actualizarEstadoConsulta,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}

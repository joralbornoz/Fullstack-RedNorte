import { createContext, useContext, useState } from 'react'

const DataContext = createContext(null)

// ── CORREGIDO: Inicialización limpia sin datos quemados de prueba ───────────────────────────────────────────
const USUARIOS_INICIAL = []
const LISTA_ESPERA_INICIAL = []

export function DataProvider({ children }) {
  const [usuarios,     setUsuarios]     = useState(USUARIOS_INICIAL)
  const [listaEspera,  setListaEspera]  = useState(LISTA_ESPERA_INICIAL)

  function crearUsuario(datos) {
    const nuevo = {
      ...datos,
      id: `u${Date.now()}`,
      activo: true,
    }
    setUsuarios(prev => [nuevo, ...prev])
    return nuevo
  }

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
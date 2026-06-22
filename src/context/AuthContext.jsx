import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export const ROLES = {
  ADMIN:    'ADMIN',
  MEDICO:   'MEDICO',
  PACIENTE: 'PACIENTE',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('rednorte_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback((userData) => {
    localStorage.setItem('rednorte_user', JSON.stringify(userData))
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('rednorte_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      rolActivo: user?.rol ?? null,
      login,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

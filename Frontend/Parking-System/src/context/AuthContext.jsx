import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as auth from '../services/authApi.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const me = await auth.me()
        setAdmin(me)
      } catch (_) {
        setAdmin(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const value = useMemo(() => ({ admin, setAdmin, loading, error, setError }), [admin, loading, error])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }



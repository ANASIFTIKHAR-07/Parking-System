import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as auth from '../services/authApi.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const me = await auth.me()
        console.log('Auth check successful:', me)
        setAdmin(me)
      } catch (error) {
        console.log('No existing session:', error.message)
        setAdmin(null)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      setError('')
      console.log('AuthContext: Starting login process')
      const data = await auth.login(credentials)
      console.log('AuthContext: Login API response:', data)
      setAdmin(data?.loggedInAdmin || null)
      console.log('AuthContext: Admin state set to:', data?.loggedInAdmin)
      return data
    } catch (error) {
      console.error('AuthContext: Login error:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await auth.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setAdmin(null)
    }
  }

  const value = useMemo(() => ({ 
    admin, 
    setAdmin, 
    loading, 
    error, 
    setError, 
    login, 
    logout 
  }), [admin, loading, error])
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Export as default to avoid Fast Refresh issues
export default function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}



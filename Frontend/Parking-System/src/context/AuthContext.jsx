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
        const response = await auth.me()
        console.log('Auth check successful:', response.data)
        // Assuming your me endpoint returns similar structure
        setAdmin(response.data?.message?.loggedInAdmin || response.data?.data || null)
      } catch (error) {
        console.log('No existing session:', error.message)
        setAdmin(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth();
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      setError('')
      console.log('AuthContext: Starting login process')
      const response = await auth.login(credentials)
      console.log('AuthContext: Login API response:', response.data)
      
      // Extract the admin data from the response structure
      const adminData = response.data?.message?.loggedInAdmin
      const accessToken = response.data?.message?.accessToken
      const refreshToken = response.data?.message?.refreshToken
      
      setAdmin(adminData || null)
      
      if (accessToken) {
        localStorage.setItem('token', accessToken)
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      
      console.log('AuthContext: Admin state set to:', adminData)
      return response.data
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
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
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
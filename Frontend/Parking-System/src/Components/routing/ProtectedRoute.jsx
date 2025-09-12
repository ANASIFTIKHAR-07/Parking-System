import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ProtectedRoute() {
  const { admin, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className='p-6'>Loading...</div>
  if (!admin) return <Navigate to='/login' replace state={{ from: location }} />
  // RBAC: require role admin where available
  if (admin?.role && admin.role !== 'ADMIN') {
    return <Navigate to='/' replace />
  }
  return <Outlet />
}



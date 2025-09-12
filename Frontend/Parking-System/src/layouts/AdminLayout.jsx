import React from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../services/authApi.js'
import { useAuth } from '../context/AuthContext.jsx'

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`

export default function AdminLayout() {
  const navigate = useNavigate()
  const { setAdmin } = useAuth()

  const onLogout = async () => {
    try { await logout() } catch (_) {}
    setAdmin(null)
    navigate('/login', { replace: true })
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='border-b bg-white'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-4'>
          <Link to='/' className='text-lg font-bold text-gray-900'>Parking Admin</Link>
          <nav className='flex items-center gap-2'>
            <NavLink to='/admin/companies' className={navLinkClass}>Companies</NavLink>
            <NavLink to='/admin/floors' className={navLinkClass}>Floors</NavLink>
            <NavLink to='/admin/slots' className={navLinkClass}>Slots</NavLink>
            <NavLink to='/admin/logs' className={navLinkClass}>Logs</NavLink>
            <button onClick={onLogout} className='ml-2 rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300'>Logout</button>
          </nav>
        </div>
      </header>
      <main className='mx-auto max-w-6xl px-4 py-6'>
        <Outlet />
      </main>
    </div>
  )
}



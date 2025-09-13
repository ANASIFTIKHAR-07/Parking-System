import React, { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../context/AuthContext.jsx'

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive 
      ? 'bg-blue-600 text-white' 
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`

export default function AdminLayout() {
  const navigate = useNavigate()
  const { logout, admin } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const onLogout = async () => {
    try { 
      await logout() 
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
      navigate('/login', { replace: true })
    }
  }

  const navItems = [
    { to: '/admin/companies', label: 'Companies' },
    { to: '/admin/floors', label: 'Floors' },
    { to: '/admin/slots', label: 'Slots' },
    { to: '/admin/logs', label: 'Reports' },
  ]

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo */}
            <Link to='/' className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>P</span>
              </div>
              <h1 className='text-xl font-semibold text-gray-900'>Parking Management</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className='hidden md:flex items-center space-x-1'>
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={navLinkClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* User Menu */}
            <div className='flex items-center space-x-4'>
              {/* User Info */}
              <div className='hidden sm:flex items-center space-x-3 text-sm text-gray-600'>
                <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                  <span className='text-blue-600 font-semibold text-xs'>
                    {admin?.email?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <span className='font-medium'>{admin?.email || 'Admin'}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className='flex items-center space-x-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md text-sm'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                </svg>
                <span className='hidden sm:inline'>Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className='md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className='md:hidden py-4 border-t border-gray-200'>
              <nav className='space-y-1'>
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={navLinkClass}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-white rounded-lg shadow-sm border p-6'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}



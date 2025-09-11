import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`

export default function AdminLayout() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='border-b bg-white'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-4'>
          <Link to='/' className='text-lg font-bold text-gray-900'>Parking Admin</Link>
          <nav className='flex gap-2'>
            <NavLink to='/admin/companies' className={navLinkClass}>Companies</NavLink>
            <NavLink to='/admin/floors' className={navLinkClass}>Floors</NavLink>
            <NavLink to='/admin/slots' className={navLinkClass}>Slots</NavLink>
            <NavLink to='/admin/logs' className={navLinkClass}>Logs</NavLink>
          </nav>
        </div>
      </header>
      <main className='mx-auto max-w-6xl px-4 py-6'>
        <Outlet />
      </main>
    </div>
  )
}



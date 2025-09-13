import React, { useState } from 'react'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import useAuth from '../../context/AuthContext.jsx'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading } = useAuth()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      console.log('Attempting login with:', form.email)
      await login(form)
      console.log('Login successful, navigating to admin dashboard')
      const to = location.state?.from?.pathname || '/admin'
      console.log('Navigating to:', to)
      navigate(to, { replace: true })
    } catch (e) {
      console.error('Login error:', e)
      setError(e.message)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <Link to='/' className='inline-flex items-center space-x-3 mb-6'>
            <div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-lg'>P</span>
            </div>
            <h1 className='text-2xl font-semibold text-gray-900'>Parking Management</h1>
          </Link>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>Admin Login</h2>
          <p className='text-gray-600'>Sign in to your admin account</p>
        </div>

        {/* Login Form */}
        <div className='bg-white rounded-lg shadow-sm border p-8'>
          {error && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3'>
              <svg className='w-5 h-5 text-red-500 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <span className='text-red-700 text-sm'>{error}</span>
            </div>
          )}

          <form className='space-y-6' onSubmit={onSubmit}>
            <div className='space-y-4'>
              <Input 
                label='Email Address' 
                type='email' 
                value={form.email} 
                onChange={e => setForm(v => ({ ...v, email: e.target.value }))} 
                required 
                placeholder='admin@example.com'
              />
              <Input 
                label='Password' 
                type='password' 
                value={form.password} 
                onChange={e => setForm(v => ({ ...v, password: e.target.value }))} 
                required 
                placeholder='Enter your password'
              />
            </div>

            <Button 
              type='submit' 
              disabled={loading}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3'
            >
              {loading ? (
                <div className='flex items-center justify-center space-x-2'>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className='mt-6 text-center'>
            <Link 
              to='/' 
              className='text-sm text-gray-600 hover:text-blue-600'
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}



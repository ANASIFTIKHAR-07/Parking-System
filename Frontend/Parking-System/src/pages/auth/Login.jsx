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
    <div className='min-h-screen bg-gray-50'>
      {/* Header - matching homepage header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <Link to='/' className='flex items-center space-x-3 hover:opacity-80 transition-opacity'>
              <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>P</span>
              </div>
              <h1 className='text-xl font-semibold text-gray-900'>Parking Management</h1>
            </Link>
            <Link to='/' className='text-gray-600 hover:text-gray-900 transition-colors'>
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Login Form Section */}
      <div className='flex items-center justify-center px-4 py-16'>
        <div className='w-full max-w-md'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>Welcome Back</h2>
            <p className='text-gray-600'>Sign in to access your admin dashboard</p>
          </div>

          {/* Login Form Card */}
          <div className='bg-white rounded-lg shadow-sm border p-8'>
            {/* Error Message */}
            {error && (
              <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3'>
                <svg className='w-5 h-5 text-red-500 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                <span className='text-red-700 text-sm'>{error}</span>
              </div>
            )}

            {/* Form */}
            <form className='space-y-6' onSubmit={onSubmit}>
              <div className='space-y-5'>
                <div>
                  <Input 
                    label='Email Address' 
                    type='email' 
                    value={form.email} 
                    onChange={e => setForm(v => ({ ...v, email: e.target.value }))} 
                    required 
                    placeholder='admin@example.com'
                    className="[&>input]:border-gray-300 [&>input]:rounded-lg [&>input]:focus:border-blue-500 [&>input]:focus:ring-blue-500 [&>label]:text-gray-700 [&>label]:font-medium [&>label]:text-sm"
                  />
                </div>
                <div>
                  <Input 
                    label='Password' 
                    type='password' 
                    value={form.password} 
                    onChange={e => setForm(v => ({ ...v, password: e.target.value }))} 
                    required 
                    placeholder='Enter your password'
                    className="[&>input]:border-gray-300 [&>input]:rounded-lg [&>input]:focus:border-blue-500 [&>input]:focus:ring-blue-500 [&>label]:text-gray-700 [&>label]:font-medium [&>label]:text-sm"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type='submit' 
                disabled={loading}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 border-0'
                size="large"
              >
                {loading ? (
                  <div className='flex items-center justify-center space-x-3'>
                    <div className='w-5 h-5 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin'></div>
                    <span>Signing you in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Sign In</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </Button>
            </form>

            {/* Additional Options */}
            <div className='mt-6 text-center'>
              <p className='text-sm text-gray-500'>
                Need help? Contact your system administrator
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Your connection is secure and encrypted
            </p>
          </div>
        </div>
      </div>

      {/* Footer - matching homepage footer */}
      <footer className='bg-gray-900 text-white py-8 mt-auto'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <p className='text-gray-400'>
            © 2024 Parking Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
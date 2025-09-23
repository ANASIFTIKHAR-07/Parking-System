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
          <div className='text-center mb-10'>
            <div className='w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg'>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
              </svg>
            </div>
            <h2 className='text-3xl font-bold text-gray-900 mb-3'>Welcome Back</h2>
            <p className='text-gray-600 text-lg'>Sign in to access your admin dashboard</p>
          </div>

          {/* Login Form Card */}
          <div className='bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300'>
            {/* Error Message */}
            {error && (
              <div className='mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-in fade-in duration-300'>
                <div className='flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5'>
                  <svg className='w-4 h-4 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </div>
                <div>
                  <p className='text-red-800 text-sm font-medium'>Authentication Failed</p>
                  <p className='text-red-600 text-sm mt-1'>{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form className='space-y-7' onSubmit={onSubmit}>
              <div className='space-y-6'>
                <div className='group'>
                  <Input 
                    label='Email Address' 
                    type='email' 
                    value={form.email} 
                    onChange={e => setForm(v => ({ ...v, email: e.target.value }))} 
                    required 
                    placeholder='admin@example.com'
                    className="[&>input]:border-gray-200 [&>input]:rounded-xl [&>input]:py-3 [&>input]:px-4 [&>input]:text-base [&>input]:transition-all [&>input]:duration-200 [&>input]:focus:border-blue-500 [&>input]:focus:ring-2 [&>input]:focus:ring-blue-500/20 [&>input]:focus:ring-offset-0 [&>input]:hover:border-gray-300 [&>label]:text-gray-700 [&>label]:font-semibold [&>label]:text-sm [&>label]:mb-2"
                  />
                </div>
                <div className='group'>
                  <Input 
                    label='Password' 
                    type='password' 
                    value={form.password} 
                    onChange={e => setForm(v => ({ ...v, password: e.target.value }))} 
                    required 
                    placeholder='Enter your password'
                    className="[&>input]:border-gray-200 [&>input]:rounded-xl [&>input]:py-3 [&>input]:px-4 [&>input]:text-base [&>input]:transition-all [&>input]:duration-200 [&>input]:focus:border-blue-500 [&>input]:focus:ring-2 [&>input]:focus:ring-blue-500/20 [&>input]:focus:ring-offset-0 [&>input]:hover:border-gray-300 [&>label]:text-gray-700 [&>label]:font-semibold [&>label]:text-sm [&>label]:mb-2"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className='flex items-center justify-between text-sm'>
                <label className='flex items-center space-x-2 cursor-pointer group'>
                  <input type='checkbox' className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200' />
                  <span className='text-gray-600 group-hover:text-gray-800 transition-colors'>Remember me</span>
                </label>
                <button type='button' className='text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200'>
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button 
                type='submit' 
                disabled={loading}
                className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl disabled:shadow-md transform hover:scale-[1.02] disabled:scale-100 transition-all duration-200 border-0 focus:ring-4 focus:ring-blue-500/25'
                size="large"
              >
                {loading ? (
                  <div className='flex items-center justify-center space-x-3'>
                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                    <span>Signing you in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Sign In to Dashboard</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className='relative my-8'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-200'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-white text-gray-500 font-medium'>Secure Access</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className='text-center space-y-4'>
              <div className='flex items-center justify-center space-x-6 text-xs text-gray-500'>
                <div className='flex items-center space-x-1'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                  </svg>
                  <span>SSL Encrypted</span>
                </div>
                <div className='flex items-center space-x-1'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  <span>Secure Login</span>
                </div>
              </div>
              
              <p className='text-sm text-gray-600'>
                Having trouble? Contact your system administrator for assistance.
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 text-xs font-medium">System Online & Secure</span>
            </div>
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
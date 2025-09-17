import React, { useState } from 'react'

// Mock components for demonstration
const Input = ({ label, type, value, onChange, required, placeholder, className = '' }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white backdrop-blur-sm ${className}`}
    />
  </div>
)

const Button = ({ children, type, disabled, className, onClick }) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={`relative overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 ${className}`}
  >
    {children}
  </button>
)

const Link = ({ to, children, className }) => (
  <a href={to} className={className}>{children}</a>
)

// Mock hooks for demo
const useNavigate = () => (path, options) => console.log('Navigate to:', path)
const useLocation = () => ({ state: null })
const useAuth = () => ({ 
  login: async (form) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Login successful')
  }, 
  loading: false 
})

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      console.log('Attempting login with:', form.email)
      await login(form)
      console.log('Login successful, navigating to admin dashboard')
      const to = location.state?.from?.pathname || '/admin'
      console.log('Navigating to:', to)
      navigate(to, { replace: true })
    } catch (e) {
      console.error('Login error:', e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900'>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white bg-opacity-20 rounded-full animate-bounce"></div>
        <div className="absolute top-3/4 left-1/3 w-3 h-3 bg-blue-400 bg-opacity-30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-purple-400 bg-opacity-40 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-indigo-400 bg-opacity-30 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className='relative z-10 min-h-screen flex items-center justify-center px-4 py-8'>
        <div className='w-full max-w-md'>
          {/* Header with staggered animation */}
          <div className='text-center mb-8 animate-pulse'>
            <Link to='/' className='inline-flex items-center space-x-3 mb-8 group transition-all duration-300'>
              <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300'>
                <span className='text-white font-bold text-xl'>🅿️</span>
              </div>
              <h1 className='text-3xl font-bold text-white'>
                Parking Management
              </h1>
            </Link>
            <div className="space-y-2">
              <h2 className='text-2xl font-bold text-white mb-2'>Welcome Back</h2>
              <p className='text-blue-100 opacity-80'>Sign in to access your admin dashboard</p>
            </div>
          </div>

          {/* Login Form Card */}
          <div className='backdrop-blur-xl bg-white bg-opacity-10 rounded-3xl shadow-2xl border border-white border-opacity-20 p-8 transform transition-all duration-500 hover:bg-opacity-20'>
            {/* Error Message */}
            {error && (
              <div className='mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-400 border-opacity-50 rounded-2xl flex items-center space-x-3 animate-pulse'>
                <svg className='w-5 h-5 text-red-300 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                <span className='text-red-200 text-sm'>{error}</span>
              </div>
            )}

            {/* Form */}
            <div className='space-y-6'>
              <div className='space-y-5'>
                <div className="transform hover:scale-105 transition-all duration-200">
                  <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(v => ({ ...v, email: e.target.value }))}
                    required
                    placeholder="admin@example.com"
                    className="w-full px-4 py-3 border border-gray-300 border-opacity-30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white bg-opacity-80 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div className="transform hover:scale-105 transition-all duration-200">
                  <label className="block text-sm font-medium text-white mb-2">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm(v => ({ ...v, password: e.target.value }))}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 border-opacity-30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white bg-opacity-80 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type='submit' 
                disabled={loading}
                onClick={onSubmit}
                className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed group'
              >
                {loading ? (
                  <div className='flex items-center justify-center space-x-3'>
                    <div className='w-5 h-5 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin'></div>
                    <span>Signing you in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Sign In</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </Button>
            </div>

            {/* Back to Home Link */}
            <div className='mt-8 text-center'>
              <Link 
                to='/' 
                className='inline-flex items-center space-x-2 text-sm text-blue-100 opacity-80 hover:text-white hover:opacity-100 transition-all duration-200 group'
              >
                <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
              </Link>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60 animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-40 animate-pulse"></div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center opacity-0 animate-pulse" style={{ animationDelay: '0.4s' }}>
            <p className="text-blue-100 opacity-60 text-xs">
              Secure • Fast • Reliable
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
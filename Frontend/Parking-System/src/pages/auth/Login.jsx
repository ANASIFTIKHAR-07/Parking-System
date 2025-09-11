import React, { useState } from 'react'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import { login as loginApi } from '../../services/authApi.js'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { setAdmin } = useAuth()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const data = await loginApi(form)
      // backend returns { accessToken, refreshToken, loggedInAdmin }
      setAdmin(data?.loggedInAdmin || null)
      const to = location.state?.from?.pathname || '/admin'
      navigate(to, { replace: true })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-md rounded-lg border bg-white p-6 shadow-sm'>
        <h1 className='mb-6 text-center text-2xl font-bold'>Admin Login</h1>
        {error && <div className='mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700'>{error}</div>}
        <form className='space-y-4' onSubmit={onSubmit}>
          <Input label='Email' type='email' value={form.email} onChange={e => setForm(v => ({ ...v, email: e.target.value }))} required />
          <Input label='Password' type='password' value={form.password} onChange={e => setForm(v => ({ ...v, password: e.target.value }))} required />
          <Button type='submit' disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
        </form>
      </div>
    </div>
  )
}



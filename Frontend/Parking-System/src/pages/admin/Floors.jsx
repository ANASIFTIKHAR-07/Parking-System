import React, { useEffect, useState } from 'react'
import { createFloor, deleteFloor, fetchFloors } from '../../services/adminApi.js'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'

export default function Floors() {
  const [floors, setFloors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ floorNumber: '', totalSlots: '' })

  const load = async () => {
    try {
      setLoading(true)
      const response = await fetchFloors()
      
      console.log('Floors API response:', response)
      console.log('Response type:', typeof response)
      console.log('Response keys:', Object.keys(response || {}))
      
      // Handle different possible response structures
      const floorsData = Array.isArray(response) 
        ? response 
        : response?.data || response?.floors || response?.message || []
      
      console.log('Processed floors data:', floorsData)
      console.log('Is array:', Array.isArray(floorsData))
      
      setFloors(floorsData)
    } catch (e) {
      console.error('Load floors error:', e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      await createFloor({ floorNumber: Number(form.floorNumber), totalSlots: Number(form.totalSlots) })
      setForm({ floorNumber: '', totalSlots: '' })
      await load()
    } catch (e) { setError(e.message) }
  }

  const remove = async (id) => { 
    if (!confirm('Delete floor?')) return; 
    try { await deleteFloor(id); await load() } catch (e) { setError(e.message) } 
  }

  // Add safety check to ensure floors is always an array
  const floorsArray = Array.isArray(floors) ? floors : []
  
  const totalSlots = floorsArray.reduce((sum, floor) => sum + (floor.totalSlots || 0), 0)
  const availableSlots = floorsArray.reduce((sum, floor) => sum + (floor.availableSlots || 0), 0)
  const occupiedSlots = totalSlots - availableSlots

  console.log('Render state - floors array:', floorsArray)
  console.log('Stats:', { totalSlots, availableSlots, occupiedSlots })

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden'>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 bg-opacity-20 rounded-full animate-bounce"></div>
        <div className="absolute top-3/4 left-1/3 w-3 h-3 bg-purple-400 bg-opacity-30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-indigo-400 bg-opacity-40 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200 to-purple-200 opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-200 to-indigo-200 opacity-20 rounded-full blur-3xl"></div>
      </div>

      <div className='relative z-10 p-8 space-y-8'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className="space-y-2">
            <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent'>
              Parking Floors
            </h1>
            <p className='text-slate-600 text-lg'>Manage parking floors and slot capacities</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='backdrop-blur-xl bg-gradient-to-br from-blue-500/90 to-blue-600/90 rounded-3xl p-8 text-white shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300'>
            <div className='flex items-center justify-between'>
              <div className="space-y-2">
                <p className='text-blue-100 text-sm font-medium uppercase tracking-wider'>Total Floors</p>
                <p className='text-4xl font-bold'>{floorsArray.length}</p>
              </div>
              <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center'>
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' />
                </svg>
              </div>
            </div>
          </div>
          
          <div className='backdrop-blur-xl bg-gradient-to-br from-green-500/90 to-emerald-600/90 rounded-3xl p-8 text-white shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300'>
            <div className='flex items-center justify-between'>
              <div className="space-y-2">
                <p className='text-green-100 text-sm font-medium uppercase tracking-wider'>Total Slots</p>
                <p className='text-4xl font-bold'>{totalSlots}</p>
              </div>
              <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center'>
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                </svg>
              </div>
            </div>
          </div>
          
          <div className='backdrop-blur-xl bg-gradient-to-br from-purple-500/90 to-indigo-600/90 rounded-3xl p-8 text-white shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300'>
            <div className='flex items-center justify-between'>
              <div className="space-y-2">
                <p className='text-purple-100 text-sm font-medium uppercase tracking-wider'>Available</p>
                <p className='text-4xl font-bold'>{availableSlots}</p>
              </div>
              <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center'>
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
            </div>
          </div>
          
          <div className='backdrop-blur-xl bg-gradient-to-br from-orange-500/90 to-red-600/90 rounded-3xl p-8 text-white shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300'>
            <div className='flex items-center justify-between'>
              <div className="space-y-2">
                <p className='text-orange-100 text-sm font-medium uppercase tracking-wider'>Occupied</p>
                <p className='text-4xl font-bold'>{occupiedSlots}</p>
              </div>
              <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center'>
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Create Floor Form */}
        <div className='backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/20 p-8'>
          <h3 className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6'>
            Create New Floor
          </h3>
          <form onSubmit={submit} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <Input 
                label='Floor Number' 
                type='number'
                value={form.floorNumber} 
                onChange={e => setForm(v => ({ ...v, floorNumber: e.target.value }))} 
                required 
                placeholder='e.g., 1, 2, 3...'
                variant="soft"
              />
              <Input 
                label='Total Slots' 
                type='number'
                value={form.totalSlots} 
                onChange={e => setForm(v => ({ ...v, totalSlots: e.target.value }))} 
                required 
                placeholder='e.g., 50, 100...'
                variant="soft"
              />
              <div className='flex items-end'>
                <Button 
                  type='submit'
                  variant="gradient"
                  className='w-full px-6 py-3 text-lg'
                  size="large"
                >
                  Create Floor
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className='backdrop-blur-xl bg-red-500/20 border border-red-400/30 rounded-3xl p-6 flex items-center space-x-4 shadow-xl'>
            <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg className='w-6 h-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <span className='text-red-800 font-medium'>{error}</span>
          </div>
        )}

        {/* Floors Table */}
        {loading ? (
          <div className='backdrop-blur-xl bg-white/40 rounded-3xl p-16 flex items-center justify-center shadow-2xl border border-white/20'>
            <div className='flex items-center space-x-4'>
              <div className='w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin'></div>
              <span className='text-slate-700 text-lg font-medium'>Loading floors...</span>
            </div>
          </div>
        ) : (
          <div className='backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/20 overflow-hidden'>
            <div className='px-8 py-6 border-b border-white/20 bg-gradient-to-r from-slate-50/50 to-blue-50/50'>
              <h3 className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent'>
                Floor Directory ({floorsArray.length} floors)
              </h3>
            </div>
            
            {floorsArray.length === 0 ? (
              <div className='text-center py-16'>
                <div className="w-20 h-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <svg className='w-10 h-10 text-slate-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-slate-900 mb-2'>No floors found</h3>
                <p className='text-slate-600 text-lg'>Get started by creating your first parking floor.</p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full'>
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50/50 to-blue-50/50">
                      <th className='px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider'>Floor</th>
                      <th className='px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider'>Total Slots</th>
                      <th className='px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider'>Available</th>
                      <th className='px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider'>Occupied</th>
                      <th className='px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider'>Assigned Company</th>
                      <th className='px-8 py-4 text-right text-sm font-bold text-slate-700 uppercase tracking-wider'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {floorsArray.map((floor, index) => (
                      <tr 
                        key={floor._id} 
                        className={`transition-all duration-200 hover:bg-white/60 border-b border-white/10 ${index % 2 === 0 ? 'bg-white/20' : 'bg-white/10'}`}
                      >
                        <td className='px-8 py-6'>
                          <div className='flex items-center space-x-4'>
                            <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg'>
                              <span className='text-white font-bold text-lg'>{floor.floorNumber}</span>
                            </div>
                            <div className="space-y-1">
                              <div className='text-lg font-bold text-slate-900'>Floor {floor.floorNumber}</div>
                              <div className='text-sm text-slate-500 font-medium'>ID: {floor._id?.slice(-8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className='px-8 py-6'>
                          <span className='text-lg font-bold text-slate-900'>{floor.totalSlots || 0}</span>
                        </td>
                        <td className='px-8 py-6'>
                          <span className='inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'>
                            {floor.availableSlots || 0}
                          </span>
                        </td>
                        <td className='px-8 py-6'>
                          <span className='inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'>
                            {(floor.totalSlots || 0) - (floor.availableSlots || 0)}
                          </span>
                        </td>
                        <td className='px-8 py-6'>
                          {floor.assignedCompany ? (
                            <div className="space-y-1">
                              <div className='text-lg font-bold text-slate-900'>{floor.assignedCompany.name}</div>
                              <div className='text-sm text-slate-500'>{floor.assignedCompany.email}</div>
                            </div>
                          ) : (
                            <span className='inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-lg'>
                              Not Assigned
                            </span>
                          )}
                        </td>
                        <td className='px-8 py-6'>
                          <div className='flex items-center justify-end'>
                            <Button
                              variant="danger"
                              size="small"
                              onClick={() => remove(floor._id)}
                              className='px-4 py-2 text-sm font-semibold'
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
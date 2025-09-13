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
    try { setLoading(true); setFloors(await fetchFloors()) } catch (e) { setError(e.message) } finally { setLoading(false) }
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

  const remove = async (id) => { if (!confirm('Delete floor?')) return; try { await deleteFloor(id); await load() } catch (e) { setError(e.message) } }

  const totalSlots = floors.reduce((sum, floor) => sum + floor.totalSlots, 0)
  const availableSlots = floors.reduce((sum, floor) => sum + (floor.availableSlots || 0), 0)
  const occupiedSlots = totalSlots - availableSlots

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Parking Floors</h1>
          <p className='text-gray-600 mt-1'>Manage parking floors and slot capacities</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-blue-100 text-sm font-medium'>Total Floors</p>
              <p className='text-3xl font-bold'>{floors.length}</p>
            </div>
            <div className='w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' />
              </svg>
            </div>
          </div>
        </div>
        
        <div className='bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-green-100 text-sm font-medium'>Total Slots</p>
              <p className='text-3xl font-bold'>{totalSlots}</p>
            </div>
            <div className='w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
              </svg>
            </div>
          </div>
        </div>
        
        <div className='bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-purple-100 text-sm font-medium'>Available</p>
              <p className='text-3xl font-bold'>{availableSlots}</p>
            </div>
            <div className='w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
          </div>
        </div>
        
        <div className='bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-orange-100 text-sm font-medium'>Occupied</p>
              <p className='text-3xl font-bold'>{occupiedSlots}</p>
            </div>
            <div className='w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Create Floor Form */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Create New Floor</h3>
        <form onSubmit={submit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Input 
              label='Floor Number' 
              type='number'
              value={form.floorNumber} 
              onChange={e => setForm(v => ({ ...v, floorNumber: e.target.value }))} 
              required 
              placeholder='e.g., 1, 2, 3...'
            />
            <Input 
              label='Total Slots' 
              type='number'
              value={form.totalSlots} 
              onChange={e => setForm(v => ({ ...v, totalSlots: e.target.value }))} 
              required 
              placeholder='e.g., 50, 100...'
            />
            <div className='flex items-end'>
              <Button 
                type='submit'
                className='w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3'
              >
                Create Floor
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3'>
          <svg className='w-5 h-5 text-red-500 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
          <span className='text-red-700 text-sm'>{error}</span>
        </div>
      )}

      {/* Floors Table */}
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='flex items-center space-x-3'>
            <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
            <span className='text-gray-600'>Loading floors...</span>
          </div>
        </div>
      ) : (
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
            <h3 className='text-lg font-semibold text-gray-900'>Floor Directory</h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Floor</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Total Slots</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Available</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Occupied</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Company</th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {floors.map((floor, index) => (
                  <tr key={floor._id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3'>
                          <span className='text-blue-600 font-semibold text-sm'>{floor.floorNumber}</span>
                        </div>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>Floor {floor.floorNumber}</div>
                          <div className='text-sm text-gray-500'>ID: {floor._id.slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='text-sm font-medium text-gray-900'>{floor.totalSlots}</span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        {floor.availableSlots || 0}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800'>
                        {(floor.totalSlots || 0) - (floor.availableSlots || 0)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {floor.assignedCompany ? (
                        <span className='text-sm text-gray-900'>{floor.assignedCompany.name}</span>
                      ) : (
                        <span className='text-sm text-gray-500'>Not Assigned</span>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <button
                        onClick={() => remove(floor._id)}
                        className='text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}



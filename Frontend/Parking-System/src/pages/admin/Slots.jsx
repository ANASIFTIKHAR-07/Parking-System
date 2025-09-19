import React, { useEffect, useState } from 'react'
import { createParkingSlots, deleteParkingSlot, fetchCompanies, fetchFloors, fetchParkingSlots, updateParkingSlot } from '../../services/adminApi.js'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'

export default function Slots() {
  const [floors, setFloors] = useState([])
  const [companies, setCompanies] = useState([])
  const [slots, setSlots] = useState([])
  const [filters, setFilters] = useState({ floorId: '', companyId: '', assigned: '' })
  const [bulk, setBulk] = useState({ floorId: '', start: 1, end: 10 })
  const [assign, setAssign] = useState({ id: '', employee: { name: '', vehicleNumber: '', rfid: '' } })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [assignLoading, setAssignLoading] = useState(false)

  const loadMeta = async () => {
    try {
      const [floorsResponse, companiesResponse] = await Promise.all([fetchFloors(), fetchCompanies()])
      
      console.log('Floors response:', floorsResponse)
      console.log('Companies response:', companiesResponse)
      
      // Handle different possible response structures
      const floorsData = Array.isArray(floorsResponse) 
        ? floorsResponse 
        : floorsResponse?.data || floorsResponse?.floors || floorsResponse?.message || []
        
      const companiesData = Array.isArray(companiesResponse) 
        ? companiesResponse 
        : companiesResponse?.data || companiesResponse?.companies || companiesResponse?.message || []
      
      setFloors(floorsData)
      setCompanies(companiesData)
    } catch (e) { 
      console.error('Load meta error:', e)
      setError(e.message) 
    }
  }

  const loadSlots = async () => {
    try { 
      setLoading(true)
      setError('') // Clear previous errors
      
      const response = await fetchParkingSlots(filters)
      
      console.log('Slots API response:', response)
      
      // Handle different possible response structures
      const slotsData = Array.isArray(response) 
        ? response 
        : response?.data || response?.slots || response?.message || []
      
      console.log('Processed slots data:', slotsData)
      
      setSlots(slotsData)
    } catch (e) { 
      console.error('Load slots error:', e)
      setError(e.message) 
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadMeta() }, [])
  useEffect(() => { loadSlots() }, [filters.floorId, filters.companyId, filters.assigned])

  const createBulk = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!bulk.floorId) {
      setError('Please select a floor')
      return
    }
    
    const list = []
    for (let i = Number(bulk.start); i <= Number(bulk.end); i++) list.push({ slotNumber: String(i) })
    
    try { 
      await createParkingSlots({ floorId: bulk.floorId, slots: list })
      setBulk({ floorId: '', start: 1, end: 10 })
      await loadSlots() 
      setError('') // Clear error on success
    } catch (e) { 
      console.error('Bulk create error:', e)
      setError(e.message) 
    }
  }

  const assignSlot = async (e) => {
    e.preventDefault()
    setError('')
    setAssignLoading(true)
    
    try { 
      // Prepare the employee data - if any field is empty, set employee to null to unassign
      const hasEmployeeData = assign.employee.name.trim() || assign.employee.vehicleNumber.trim() || assign.employee.rfid.trim()
      
      const employeeData = hasEmployeeData ? {
        name: assign.employee.name.trim(),
        vehicleNumber: assign.employee.vehicleNumber.trim(),
        rfid: assign.employee.rfid.trim()
      } : null
      
      console.log('Updating slot with data:', { 
        slotId: assign.id, 
        employee: employeeData 
      })
      
      const response = await updateParkingSlot(assign.id, { employee: employeeData })
      console.log('Update response:', response)
      
      // Reset the assignment form
      setAssign({ id: '', employee: { name: '', vehicleNumber: '', rfid: '' } })
      
      // Reload slots to get updated data
      await loadSlots()
      
      setError('') // Clear any previous errors
    } catch (e) { 
      console.error('Assign slot error:', e)
      setError(e.response?.data?.message || e.message || 'Failed to update slot assignment') 
    } finally {
      setAssignLoading(false)
    }
  }

  const remove = async (id) => { 
    if (!confirm('Delete slot?')) return
    setError('')
    
    try { 
      await deleteParkingSlot(id)
      await loadSlots()
      setError('') // Clear error on success
    } catch (e) { 
      console.error('Delete slot error:', e)
      setError(e.message) 
    } 
  }

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Add safety checks to ensure arrays
  const slotsArray = Array.isArray(slots) ? slots : []
  const floorsArray = Array.isArray(floors) ? floors : []
  const companiesArray = Array.isArray(companies) ? companies : []

  const assignedSlots = slotsArray.filter(s => s.employee && s.employee !== null).length
  const availableSlots = slotsArray.filter(s => !s.employee || s.employee === null).length

  console.log('Render state:', { 
    slotsCount: slotsArray.length, 
    assignedSlots, 
    availableSlots, 
    loading,
    assignLoading
  })

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
              Parking Slots
            </h1>
            <p className='text-slate-600 text-lg'>Manage individual parking slots and employee assignments</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='backdrop-blur-xl bg-gradient-to-br from-blue-500/90 to-blue-600/90 rounded-3xl p-8 text-white shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300'>
            <div className='flex items-center justify-between'>
              <div className="space-y-2">
                <p className='text-blue-100 text-sm font-medium uppercase tracking-wider'>Total Slots</p>
                <p className='text-4xl font-bold'>{slotsArray.length}</p>
              </div>
              <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center'>
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                </svg>
              </div>
            </div>
          </div>
          
          <div className='backdrop-blur-xl bg-gradient-to-br from-green-500/90 to-emerald-600/90 rounded-3xl p-8 text-white shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300'>
            <div className='flex items-center justify-between'>
              <div className="space-y-2">
                <p className='text-green-100 text-sm font-medium uppercase tracking-wider'>Available</p>
                <p className='text-4xl font-bold'>{availableSlots}</p>
              </div>
              <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center'>
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
            </div>
          </div>
          
          <div className='backdrop-blur-xl bg-gradient-to-br from-purple-500/90 to-indigo-600/90 rounded-3xl p-8 text-white shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300'>
            <div className='flex items-center justify-between'>
              <div className="space-y-2">
                <p className='text-purple-100 text-sm font-medium uppercase tracking-wider'>Assigned</p>
                <p className='text-4xl font-bold'>{assignedSlots}</p>
              </div>
              <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center'>
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                </svg>
              </div>
            </div>
          </div>
          
          <div className='backdrop-blur-xl bg-gradient-to-br from-orange-500/90 to-red-600/90 rounded-3xl p-8 text-white shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300'>
            <div className='flex items-center justify-between'>
              <div className="space-y-2">
                <p className='text-orange-100 text-sm font-medium uppercase tracking-wider'>Utilization</p>
                <p className='text-4xl font-bold'>{slotsArray.length > 0 ? Math.round((assignedSlots / slotsArray.length) * 100) : 0}%</p>
              </div>
              <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center'>
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/20 p-8'>
          <h3 className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6'>
            Filter Slots
          </h3>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
            <div>
              <label className='block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2'>Floor</label>
              <select 
                className='w-full rounded-2xl border-0 bg-white/60 backdrop-blur-sm px-4 py-3 text-slate-900 shadow-lg focus:ring-4 focus:ring-blue-500/30 transition-all duration-200' 
                value={filters.floorId} 
                onChange={e => setFilters(v => ({ ...v, floorId: e.target.value }))}
              >
                <option value=''>All Floors</option>
                {floorsArray.map(f => <option key={f._id} value={f._id}>Floor {f.floorNumber}</option>)}
              </select>
            </div>
            <div>
              <label className='block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2'>Company</label>
              <select 
                className='w-full rounded-2xl border-0 bg-white/60 backdrop-blur-sm px-4 py-3 text-slate-900 shadow-lg focus:ring-4 focus:ring-blue-500/30 transition-all duration-200' 
                value={filters.companyId} 
                onChange={e => setFilters(v => ({ ...v, companyId: e.target.value }))}
              >
                <option value=''>All Companies</option>
                {companiesArray.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className='block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2'>Status</label>
              <select 
                className='w-full rounded-2xl border-0 bg-white/60 backdrop-blur-sm px-4 py-3 text-slate-900 shadow-lg focus:ring-4 focus:ring-blue-500/30 transition-all duration-200' 
                value={filters.assigned} 
                onChange={e => setFilters(v => ({ ...v, assigned: e.target.value }))}
              >
                <option value=''>All</option>
                <option value='true'>Assigned</option>
                <option value='false'>Unassigned</option>
              </select>
            </div>
            <div className='flex items-end'>
              <Button 
                variant="gradient"
                onClick={loadSlots}
                disabled={loading}
                className='w-full px-6 py-3'
              >
                {loading ? 'Loading...' : 'Apply Filters'}
              </Button>
            </div>
          </div>
        </div>

        {/* Bulk Create */}
        <div className='backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/20 p-8'>
          <h3 className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6'>
            Bulk Create Slots
          </h3>
          <form onSubmit={createBulk} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
              <div>
                <label className='block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2'>Floor</label>
                <select 
                  className='w-full rounded-2xl border-0 bg-white/60 backdrop-blur-sm px-4 py-3 text-slate-900 shadow-lg focus:ring-4 focus:ring-blue-500/30 transition-all duration-200' 
                  value={bulk.floorId} 
                  onChange={e => setBulk(v => ({ ...v, floorId: e.target.value }))} 
                  required
                >
                  <option value=''>Select Floor</option>
                  {floorsArray.map(f => <option key={f._id} value={f._id}>Floor {f.floorNumber}</option>)}
                </select>
              </div>
              <Input 
                label='Start Number' 
                type='number'
                value={bulk.start} 
                onChange={e => setBulk(v => ({ ...v, start: e.target.value }))} 
                placeholder='1'
                variant="soft"
              />
              <Input 
                label='End Number' 
                type='number'
                value={bulk.end} 
                onChange={e => setBulk(v => ({ ...v, end: e.target.value }))} 
                placeholder='10'
                variant="soft"
              />
              <div className='flex items-end'>
                <Button 
                  type='submit'
                  variant="premium"
                  className='w-full px-6 py-3'
                >
                  Create Slots
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

        {/* Slots Table */}
        {loading ? (
          <div className='backdrop-blur-xl bg-white/40 rounded-3xl p-16 flex items-center justify-center shadow-2xl border border-white/20'>
            <div className='flex items-center space-x-4'>
              <div className='w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin'></div>
              <span className='text-slate-700 text-lg font-medium'>Loading slots...</span>
            </div>
          </div>
        ) : (
          <div className='backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/20 overflow-hidden'>
            <div className='px-8 py-6 border-b border-white/20 bg-gradient-to-r from-slate-50/50 to-blue-50/50'>
              <h3 className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent'>
                Parking Slots Directory ({slotsArray.length} slots)
              </h3>
            </div>
            
            {slotsArray.length === 0 ? (
              <div className='text-center py-16'>
                <div className="w-20 h-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <svg className='w-10 h-10 text-slate-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-slate-900 mb-2'>No parking slots found</h3>
                <p className='text-slate-600 text-lg'>Create your first parking slots using bulk creation above.</p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full'>
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50/50 to-blue-50/50">
                      <th className='px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider'>Slot</th>
                      <th className='px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider'>Floor</th>
                      <th className='px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider'>Company</th>
                      <th className='px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider'>Employee</th>
                      <th className='px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider'>Vehicle</th>
                      <th className='px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider'>RFID</th>
                      <th className='px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider'>Status</th>
                      <th className='px-8 py-4 text-right text-sm font-bold text-slate-700 uppercase tracking-wider'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slotsArray.map((slot, index) => (
                      <tr 
                        key={slot._id} 
                        className={`transition-all duration-200 hover:bg-white/60 border-b border-white/10 ${index % 2 === 0 ? 'bg-white/20' : 'bg-white/10'}`}
                      >
                        <td className='px-8 py-6'>
                          <div className='flex items-center space-x-4'>
                            <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg'>
                              <span className='text-white font-bold text-lg'>{slot.slotNumber}</span>
                            </div>
                            <div className="space-y-1">
                              <div className='text-lg font-bold text-slate-900'>Slot {slot.slotNumber}</div>
                              <div className='text-sm text-slate-500 font-medium'>ID: {slot._id?.slice(-8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className='px-8 py-6'>
                          <span className='text-lg font-medium text-slate-900'>Floor {slot.floor?.floorNumber || 'N/A'}</span>
                        </td>
                        <td className='px-8 py-6'>
                          <span className='text-lg font-medium text-slate-900'>{slot.company?.name || 'Not Assigned'}</span>
                        </td>
                        <td className='px-8 py-6'>
                          <span className='text-lg font-medium text-slate-900'>{slot.employee?.name || 'Not Assigned'}</span>
                        </td>
                        <td className='px-8 py-6'>
                          <span className='text-lg font-medium text-slate-900'>{slot.employee?.vehicleNumber || 'N/A'}</span>
                        </td>
                        <td className='px-8 py-6'>
                          <span className='text-lg font-medium text-slate-900'>{slot.employee?.rfid || 'N/A'}</span>
                        </td>
                        <td className='px-8 py-6'>
                          {slot.employee ? (
                            <span className='inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'>
                              Assigned
                            </span>
                          ) : (
                            <span className='inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'>
                              Available
                            </span>
                          )}
                        </td>
                        <td className='px-8 py-6'>
                          <div className='flex items-center justify-end space-x-3'>
                            <Button
                              variant="soft"
                              size="small"
                              onClick={() => setAssign({ 
                                id: slot._id, 
                                employee: slot.employee ? {
                                  name: slot.employee.name || '',
                                  vehicleNumber: slot.employee.vehicleNumber || '',
                                  rfid: slot.employee.rfid || ''
                                } : { name: '', vehicleNumber: '', rfid: '' } 
                              })}
                              className='px-4 py-2 text-sm font-semibold'
                            >
                              {slot.employee ? 'Edit' : 'Assign'}
                            </Button>
                            <Button
                              variant="danger"
                              size="small"
                              onClick={() => remove(slot._id)}
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

        {/* Assignment Form */}
        {assign.id && (
          <div className='backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/20 p-8'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent'>
                {assign.employee.name ? 'Edit Assignment' : 'Assign Employee'}
              </h3>
              <button
                onClick={() => setAssign({ id: '', employee: { name: '', vehicleNumber: '', rfid: '' } })}
                className='w-10 h-10 rounded-2xl bg-slate-200/50 hover:bg-slate-300/50 flex items-center justify-center transition-all duration-200 text-slate-600 hover:text-slate-800'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            
            <div className='mb-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-200/50'>
              <p className='text-sm text-slate-600'>
                <strong>Tip:</strong> Leave all fields empty to unassign the slot. Fill in at least one field to assign/update employee information.
              </p>
            </div>
            
            <form onSubmit={assignSlot} className='space-y-6'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
                <Input 
                  label='Employee Name' 
                  value={assign.employee.name} 
                  onChange={e => setAssign(v => ({ ...v, employee: { ...v.employee, name: e.target.value } }))} 
                  placeholder='John Doe'
                  variant="soft"
                />
                <Input 
                  label='Vehicle Number' 
                  value={assign.employee.vehicleNumber} 
                  onChange={e => setAssign(v => ({ ...v, employee: { ...v.employee, vehicleNumber: e.target.value } }))} 
                  placeholder='ABC-1234'
                  variant="soft"
                />
                <Input 
                  label='RFID Tag' 
                  value={assign.employee.rfid} 
                  onChange={e => setAssign(v => ({ ...v, employee: { ...v.employee, rfid: e.target.value } }))} 
                  placeholder='RFID123456'
                  variant="soft"
                />
                <div className='flex items-end space-x-3'>
                  <Button 
                    type='submit'
                    variant="gradient"
                    disabled={assignLoading}
                    className='flex-1 px-4 py-3'
                  >
                    {assignLoading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button 
                    variant='soft' 
                    type='button' 
                    onClick={() => setAssign({ id: '', employee: { name: '', vehicleNumber: '', rfid: '' } })}
                    disabled={assignLoading}
                    className='flex-1 px-4 py-3'
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
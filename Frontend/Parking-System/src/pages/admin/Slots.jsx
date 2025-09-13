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

  const loadMeta = async () => {
    try {
      const [f, c] = await Promise.all([fetchFloors(), fetchCompanies()])
      setFloors(f); setCompanies(c)
    } catch (e) { setError(e.message) }
  }

  const loadSlots = async () => {
    try { 
      setLoading(true)
      setSlots(await fetchParkingSlots(filters)) 
    } catch (e) { setError(e.message) } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadMeta() }, [])
  useEffect(() => { loadSlots() }, [filters.floorId, filters.companyId, filters.assigned])

  const createBulk = async (e) => {
    e.preventDefault()
    const list = []
    for (let i = Number(bulk.start); i <= Number(bulk.end); i++) list.push({ slotNumber: String(i) })
    try { await createParkingSlots({ floorId: bulk.floorId, slots: list }); await loadSlots() } catch (e) { setError(e.message) }
  }

  const assignSlot = async (e) => {
    e.preventDefault()
    try { 
      const employeeData = assign.employee.name && assign.employee.vehicleNumber && assign.employee.rfid 
        ? assign.employee 
        : null
      await updateParkingSlot(assign.id, { employee: employeeData }); 
      setAssign({ id: '', employee: { name: '', vehicleNumber: '', rfid: '' } }); 
      await loadSlots() 
    } catch (e) { setError(e.message) }
  }

  const remove = async (id) => { if (!confirm('Delete slot?')) return; try { await deleteParkingSlot(id); await loadSlots() } catch (e) { setError(e.message) } }

  const assignedSlots = slots.filter(s => s.employee).length
  const availableSlots = slots.filter(s => !s.employee).length

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Parking Slots</h1>
          <p className='text-gray-600 mt-1'>Manage individual parking slots and employee assignments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-blue-100 text-sm font-medium'>Total Slots</p>
              <p className='text-3xl font-bold'>{slots.length}</p>
            </div>
            <div className='w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
              </svg>
            </div>
          </div>
        </div>
        
        <div className='bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-green-100 text-sm font-medium'>Available</p>
              <p className='text-3xl font-bold'>{availableSlots}</p>
            </div>
            <div className='w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
          </div>
        </div>
        
        <div className='bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-purple-100 text-sm font-medium'>Assigned</p>
              <p className='text-3xl font-bold'>{assignedSlots}</p>
            </div>
            <div className='w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
              </svg>
            </div>
          </div>
        </div>
        
        <div className='bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-orange-100 text-sm font-medium'>Utilization</p>
              <p className='text-3xl font-bold'>{slots.length > 0 ? Math.round((assignedSlots / slots.length) * 100) : 0}%</p>
            </div>
            <div className='w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Filter Slots</h3>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Floor</label>
            <select 
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
              value={filters.floorId} 
              onChange={e => setFilters(v => ({ ...v, floorId: e.target.value }))}
            >
              <option value=''>All Floors</option>
              {floors.map(f => <option key={f._id} value={f._id}>Floor {f.floorNumber}</option>)}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Company</label>
            <select 
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
              value={filters.companyId} 
              onChange={e => setFilters(v => ({ ...v, companyId: e.target.value }))}
            >
              <option value=''>All Companies</option>
              {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Status</label>
            <select 
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
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
              onClick={loadSlots}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white'
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Create */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Bulk Create Slots</h3>
        <form onSubmit={createBulk} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Floor</label>
              <select 
                className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                value={bulk.floorId} 
                onChange={e => setBulk(v => ({ ...v, floorId: e.target.value }))} 
                required
              >
                <option value=''>Select Floor</option>
                {floors.map(f => <option key={f._id} value={f._id}>Floor {f.floorNumber}</option>)}
              </select>
            </div>
            <Input 
              label='Start Number' 
              type='number'
              value={bulk.start} 
              onChange={e => setBulk(v => ({ ...v, start: e.target.value }))} 
              placeholder='1'
            />
            <Input 
              label='End Number' 
              type='number'
              value={bulk.end} 
              onChange={e => setBulk(v => ({ ...v, end: e.target.value }))} 
              placeholder='10'
            />
            <div className='flex items-end'>
              <Button 
                type='submit'
                className='w-full bg-green-600 hover:bg-green-700 text-white'
              >
                Create Slots
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

      {/* Slots Table */}
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='flex items-center space-x-3'>
            <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
            <span className='text-gray-600'>Loading slots...</span>
          </div>
        </div>
      ) : (
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
            <h3 className='text-lg font-semibold text-gray-900'>Parking Slots Directory</h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Slot</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Floor</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Company</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Employee</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Vehicle</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {slots.map((slot, index) => (
                  <tr key={slot._id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3'>
                          <span className='text-blue-600 font-semibold text-sm'>{slot.slotNumber}</span>
                        </div>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>Slot {slot.slotNumber}</div>
                          <div className='text-sm text-gray-500'>ID: {slot._id.slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='text-sm text-gray-900'>Floor {slot.floor?.floorNumber}</span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='text-sm text-gray-900'>{slot.company?.name || '-'}</span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='text-sm text-gray-900'>{slot.employee?.name || '-'}</span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='text-sm text-gray-900'>{slot.employee?.vehicleNumber || '-'}</span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {slot.employee ? (
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
                          Assigned
                        </span>
                      ) : (
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                          Available
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <div className='flex items-center justify-end space-x-2'>
                        <button
                          onClick={() => setAssign({ id: slot._id, employee: slot.employee || { name: '', vehicleNumber: '', rfid: '' } })}
                          className='text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150'
                        >
                          {slot.employee ? 'Edit' : 'Assign'}
                        </button>
                        <button
                          onClick={() => remove(slot._id)}
                          className='text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assignment Form */}
      {assign.id && (
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              {assign.employee.name ? 'Edit Assignment' : 'Assign Employee'}
            </h3>
            <button
              onClick={() => setAssign({ id: '', employee: { name: '', vehicleNumber: '', rfid: '' } })}
              className='text-gray-400 hover:text-gray-600'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
          <form onSubmit={assignSlot} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
              <Input 
                label='Employee Name' 
                value={assign.employee.name} 
                onChange={e => setAssign(v => ({ ...v, employee: { ...v.employee, name: e.target.value } }))} 
                placeholder='John Doe'
              />
              <Input 
                label='Vehicle Number' 
                value={assign.employee.vehicleNumber} 
                onChange={e => setAssign(v => ({ ...v, employee: { ...v.employee, vehicleNumber: e.target.value } }))} 
                placeholder='ABC-1234'
              />
              <Input 
                label='RFID Tag' 
                value={assign.employee.rfid} 
                onChange={e => setAssign(v => ({ ...v, employee: { ...v.employee, rfid: e.target.value } }))} 
                placeholder='RFID123456'
              />
              <div className='flex items-end space-x-2'>
                <Button 
                  type='submit'
                  className='flex-1 bg-blue-600 hover:bg-blue-700 text-white'
                >
                  Save
                </Button>
                <Button 
                  variant='outline' 
                  type='button' 
                  onClick={() => setAssign({ id: '', employee: { name: '', vehicleNumber: '', rfid: '' } })}
                  className='flex-1'
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}



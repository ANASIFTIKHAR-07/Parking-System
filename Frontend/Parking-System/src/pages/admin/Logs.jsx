import React, { useEffect, useState } from 'react'
import { fetchCompanies, fetchFloors, fetchParkingSlots } from '../../services/adminApi.js'
import Button from '../../components/common/Button.jsx'
import { API_BASE_URL } from '../../services/http.js'

export default function Logs() {
  const [companies, setCompanies] = useState([])
  const [floors, setFloors] = useState([])
  const [slots, setSlots] = useState([])
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ companyId: '', floorId: '', assigned: '' })

  const loadMeta = async () => {
    try { const [c, f] = await Promise.all([fetchCompanies(), fetchFloors()]); setCompanies(c); setFloors(f) } catch (e) { setError(e.message) }
  }
  const load = async () => {
    try { setSlots(await fetchParkingSlots(filters)) } catch (e) { setError(e.message) }
  }
  useEffect(() => { loadMeta() }, [])
  useEffect(() => { load() }, [filters.companyId, filters.floorId, filters.assigned])
  const exportCsv = () => {
    const url = new URL(`${API_BASE_URL}/csv/parking-logs/export`)
    Object.entries(filters).forEach(([k, v]) => { 
      if (v && v !== '') url.searchParams.set(k, v) 
    })
    // Open in same tab to trigger download with credentials
    window.location.href = url.toString()
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-semibold'>Parking Assignments</h2>

      <div className='rounded-lg border bg-white p-4'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
          <select className='rounded-md border border-gray-300 px-3 py-2' value={filters.companyId} onChange={e => setFilters(v => ({ ...v, companyId: e.target.value }))}>
            <option value=''>All Companies</option>
            {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select className='rounded-md border border-gray-300 px-3 py-2' value={filters.floorId} onChange={e => setFilters(v => ({ ...v, floorId: e.target.value }))}>
            <option value=''>All Floors</option>
            {floors.map(f => <option key={f._id} value={f._id}>Floor {f.floorNumber}</option>)}
          </select>
          <select className='rounded-md border border-gray-300 px-3 py-2' value={filters.assigned} onChange={e => setFilters(v => ({ ...v, assigned: e.target.value }))}>
            <option value=''>All</option>
            <option value='true'>Assigned</option>
            <option value='false'>Unassigned</option>
          </select>
        </div>
        <div className='mt-3 flex gap-2'>
          <Button onClick={load}>Search</Button>
          <Button variant='outline' onClick={exportCsv}>Export CSV</Button>
        </div>
      </div>

      {error && <div className='rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700'>{error}</div>}

      <div className='overflow-hidden rounded-lg border'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Slot</th>
              <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Floor</th>
              <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Company</th>
              <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Employee</th>
              <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Vehicle</th>
              <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>RFID</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {slots.map(s => (
              <tr key={s._id}>
                <td className='px-4 py-2'>{s.slotNumber}</td>
                <td className='px-4 py-2'>Floor {s.floor?.floorNumber}</td>
                <td className='px-4 py-2'>{s.company?.name || 'Unassigned'}</td>
                <td className='px-4 py-2'>{s.employee?.name || 'Available'}</td>
                <td className='px-4 py-2'>{s.employee?.vehicleNumber || '-'}</td>
                <td className='px-4 py-2'>{s.employee?.rfid || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}



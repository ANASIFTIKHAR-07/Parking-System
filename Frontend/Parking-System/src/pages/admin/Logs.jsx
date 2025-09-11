import React, { useEffect, useState } from 'react'
import { fetchCompanies, fetchFloors, fetchParkingLogs } from '../../services/adminApi.js'
import Button from '../../components/common/Button.jsx'

export default function Logs() {
  const [companies, setCompanies] = useState([])
  const [floors, setFloors] = useState([])
  const [logs, setLogs] = useState([])
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ company: '', vehicleNumber: '', floor: '', slotNumber: '', employeeName: '', rfid: '', startDate: '', endDate: '' })

  const loadMeta = async () => {
    try { const [c, f] = await Promise.all([fetchCompanies(), fetchFloors()]); setCompanies(c); setFloors(f) } catch (e) { setError(e.message) }
  }
  const load = async () => {
    try { setLogs(await fetchParkingLogs(filters)) } catch (e) { setError(e.message) }
  }
  useEffect(() => { loadMeta() }, [])

  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-semibold'>Parking Logs</h2>

      <div className='rounded-lg border bg-white p-4'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-4'>
          <select className='rounded-md border border-gray-300 px-3 py-2' value={filters.company} onChange={e => setFilters(v => ({ ...v, company: e.target.value }))}>
            <option value=''>All Companies</option>
            {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select className='rounded-md border border-gray-300 px-3 py-2' value={filters.floor} onChange={e => setFilters(v => ({ ...v, floor: e.target.value }))}>
            <option value=''>All Floors</option>
            {floors.map(f => <option key={f._id} value={f._id}>Floor {f.floorNumber}</option>)}
          </select>
          <input className='rounded-md border border-gray-300 px-3 py-2' placeholder='Vehicle Number' value={filters.vehicleNumber} onChange={e => setFilters(v => ({ ...v, vehicleNumber: e.target.value }))} />
          <input className='rounded-md border border-gray-300 px-3 py-2' placeholder='Slot Number' value={filters.slotNumber} onChange={e => setFilters(v => ({ ...v, slotNumber: e.target.value }))} />
          <input className='rounded-md border border-gray-300 px-3 py-2' placeholder='Employee Name' value={filters.employeeName} onChange={e => setFilters(v => ({ ...v, employeeName: e.target.value }))} />
          <input className='rounded-md border border-gray-300 px-3 py-2' placeholder='RFID' value={filters.rfid} onChange={e => setFilters(v => ({ ...v, rfid: e.target.value }))} />
          <input type='date' className='rounded-md border border-gray-300 px-3 py-2' value={filters.startDate} onChange={e => setFilters(v => ({ ...v, startDate: e.target.value }))} />
          <input type='date' className='rounded-md border border-gray-300 px-3 py-2' value={filters.endDate} onChange={e => setFilters(v => ({ ...v, endDate: e.target.value }))} />
        </div>
        <div className='mt-3'>
          <Button onClick={load}>Search</Button>
        </div>
      </div>

      {error && <div className='rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700'>{error}</div>}

      <div className='overflow-hidden rounded-lg border'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Vehicle</th>
              <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Company</th>
              <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Floor</th>
              <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Slot</th>
              <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Time</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {logs.map(l => (
              <tr key={l._id}>
                <td className='px-4 py-2'>{l.vehicleNumber}</td>
                <td className='px-4 py-2'>{l.company?.name || '-'}</td>
                <td className='px-4 py-2'>Floor {l.floor?.floorNumber}</td>
                <td className='px-4 py-2'>{l.slotNumber}</td>
                <td className='px-4 py-2'>{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}



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
  const [assign, setAssign] = useState({ id: '', employee: '' })
  const [error, setError] = useState('')

  const loadMeta = async () => {
    try {
      const [f, c] = await Promise.all([fetchFloors(), fetchCompanies()])
      setFloors(f); setCompanies(c)
    } catch (e) { setError(e.message) }
  }

  const loadSlots = async () => {
    try { setSlots(await fetchParkingSlots(filters)) } catch (e) { setError(e.message) }
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
    try { await updateParkingSlot(assign.id, { employee: assign.employee || null }); setAssign({ id: '', employee: '' }); await loadSlots() } catch (e) { setError(e.message) }
  }

  const remove = async (id) => { if (!confirm('Delete slot?')) return; try { await deleteParkingSlot(id); await loadSlots() } catch (e) { setError(e.message) } }

  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-semibold'>Parking Slots</h2>

      {/* Filters */}
      <div className='rounded-lg border bg-white p-4'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-4'>
          <select className='rounded-md border border-gray-300 px-3 py-2' value={filters.floorId} onChange={e => setFilters(v => ({ ...v, floorId: e.target.value }))}>
            <option value=''>All Floors</option>
            {floors.map(f => <option key={f._id} value={f._id}>Floor {f.floorNumber}</option>)}
          </select>
          <select className='rounded-md border border-gray-300 px-3 py-2' value={filters.companyId} onChange={e => setFilters(v => ({ ...v, companyId: e.target.value }))}>
            <option value=''>All Companies</option>
            {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select className='rounded-md border border-gray-300 px-3 py-2' value={filters.assigned} onChange={e => setFilters(v => ({ ...v, assigned: e.target.value }))}>
            <option value=''>All</option>
            <option value='true'>Assigned</option>
            <option value='false'>Unassigned</option>
          </select>
        </div>
      </div>

      {/* Bulk create */}
      <form onSubmit={createBulk} className='rounded-lg border bg-white p-4'>
        <div className='mb-2 text-sm font-medium text-gray-700'>Bulk create slots</div>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-5'>
          <select className='rounded-md border border-gray-300 px-3 py-2' value={bulk.floorId} onChange={e => setBulk(v => ({ ...v, floorId: e.target.value }))} required>
            <option value=''>Select Floor</option>
            {floors.map(f => <option key={f._id} value={f._id}>Floor {f.floorNumber}</option>)}
          </select>
          <Input label='Start' value={bulk.start} onChange={e => setBulk(v => ({ ...v, start: e.target.value }))} />
          <Input label='End' value={bulk.end} onChange={e => setBulk(v => ({ ...v, end: e.target.value }))} />
          <div className='flex items-end'>
            <Button type='submit'>Create</Button>
          </div>
        </div>
      </form>

      {/* Slots table */}
      <div className='overflow-hidden rounded-lg border'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Slot</th>
              <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Floor</th>
              <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Company</th>
              <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Employee</th>
              <th className='px-4 py-2'></th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {slots.map(s => (
              <tr key={s._id}>
                <td className='px-4 py-2'>{s.slotNumber}</td>
                <td className='px-4 py-2'>Floor {s.floor?.floorNumber}</td>
                <td className='px-4 py-2'>{s.company?.name || '-'}</td>
                <td className='px-4 py-2'>{s.employee || '-'}</td>
                <td className='px-4 py-2 text-right'>
                  <Button variant='outline' className='mr-2' onClick={() => setAssign({ id: s._id, employee: s.employee || '' })}>Assign</Button>
                  <Button variant='danger' onClick={() => remove(s._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign form */}
      {assign.id && (
        <form onSubmit={assignSlot} className='rounded-lg border bg-white p-4'>
          <div className='mb-2 text-sm font-medium text-gray-700'>Assign/Unassign Employee</div>
          <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
            <Input label='Employee ID (blank to unassign)' value={assign.employee} onChange={e => setAssign(v => ({ ...v, employee: e.target.value }))} />
            <div className='flex items-end'>
              <Button type='submit'>Save</Button>
            </div>
            <div className='flex items-end'>
              <Button variant='outline' type='button' onClick={() => setAssign({ id: '', employee: '' })}>Cancel</Button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}



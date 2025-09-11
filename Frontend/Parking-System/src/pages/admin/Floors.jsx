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

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Floors</h2>
      </div>

      <form onSubmit={submit} className='rounded-lg border bg-white p-4'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
          <Input label='Floor Number' value={form.floorNumber} onChange={e => setForm(v => ({ ...v, floorNumber: e.target.value }))} required />
          <Input label='Total Slots' value={form.totalSlots} onChange={e => setForm(v => ({ ...v, totalSlots: e.target.value }))} required />
          <div className='flex items-end'>
            <Button type='submit'>Create Floor</Button>
          </div>
        </div>
      </form>

      {error && <div className='rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700'>{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div className='overflow-hidden rounded-lg border'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Floor</th>
                <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Total Slots</th>
                <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Available</th>
                <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Company</th>
                <th className='px-4 py-2'></th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {floors.map(f => (
                <tr key={f._id}>
                  <td className='px-4 py-2'>Floor {f.floorNumber}</td>
                  <td className='px-4 py-2'>{f.totalSlots}</td>
                  <td className='px-4 py-2'>{f.availableSlots}</td>
                  <td className='px-4 py-2'>{f.assignedCompany?.name || '-'}</td>
                  <td className='px-4 py-2 text-right'>
                    <Button variant='danger' onClick={() => remove(f._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}



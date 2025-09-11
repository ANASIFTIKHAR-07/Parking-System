import React, { useEffect, useState } from 'react'
import { createCompany, deleteCompany, fetchCompanies, updateCompany, assignCompanyToFloor, fetchFloors } from '../../services/adminApi.js'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import Modal from '../../components/common/Modal.jsx'

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [floors, setFloors] = useState([])
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [assignForm, setAssignForm] = useState({ companyId: '', floorId: '' })

  const load = async () => {
    try {
      setLoading(true)
      const [c, f] = await Promise.all([fetchCompanies(), fetchFloors()])
      setCompanies(c)
      setFloors(f)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createCompany(form)
      setForm({ name: '', email: '', phone: '' })
      setIsOpen(false)
      await load()
    } catch (e) { setError(e.message) }
  }

  const assign = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await assignCompanyToFloor(assignForm)
      setAssignForm({ companyId: '', floorId: '' })
      await load()
    } catch (e) { setError(e.message) }
  }

  const remove = async (id) => {
    if (!confirm('Delete this company?')) return
    try { await deleteCompany(id); await load() } catch (e) { setError(e.message) }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Companies</h2>
        <Button onClick={() => setIsOpen(true)}>Add Company</Button>
      </div>

      {error && <div className='rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700'>{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div className='overflow-hidden rounded-lg border'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Name</th>
                <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Email</th>
                <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>Phone</th>
                <th className='px-4 py-2'></th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {companies.map(c => (
                <tr key={c._id}>
                  <td className='px-4 py-2'>{c.name}</td>
                  <td className='px-4 py-2'>{c.email}</td>
                  <td className='px-4 py-2'>{c.phone}</td>
                  <td className='px-4 py-2 text-right'>
                    <Button variant='outline' className='mr-2' onClick={() => setAssignForm({ companyId: c._id, floorId: '' })}>Assign Floor</Button>
                    <Button variant='danger' onClick={() => remove(c._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign floor */}
      {assignForm.companyId && (
        <form onSubmit={assign} className='rounded-lg border bg-white p-4'>
          <div className='mb-3 text-sm font-medium text-gray-700'>Assign company to a floor</div>
          <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
            <select value={assignForm.companyId} onChange={e => setAssignForm(v => ({ ...v, companyId: e.target.value }))} className='rounded-md border border-gray-300 px-3 py-2'>
              {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <select value={assignForm.floorId} onChange={e => setAssignForm(v => ({ ...v, floorId: e.target.value }))} className='rounded-md border border-gray-300 px-3 py-2'>
              <option value=''>Select floor</option>
              {floors.map(f => <option key={f._id} value={f._id}>Floor {f.floorNumber}</option>)}
            </select>
            <Button type='submit'>Assign</Button>
          </div>
        </form>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title='Add Company'>
        <form onSubmit={submit} className='space-y-4'>
          <Input label='Name' value={form.name} required onChange={e => setForm(v => ({ ...v, name: e.target.value }))} />
          <Input label='Email' type='email' value={form.email} required onChange={e => setForm(v => ({ ...v, email: e.target.value }))} />
          <Input label='Phone' value={form.phone} required onChange={e => setForm(v => ({ ...v, phone: e.target.value }))} />
          <div className='flex justify-end gap-2'>
            <Button variant='outline' type='button' onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type='submit'>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}



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
      const [companiesResponse, floorsResponse] = await Promise.all([fetchCompanies(), fetchFloors()])
      
      console.log('Companies response:', companiesResponse)
      console.log('Floors response:', floorsResponse)
      
      // Handle different possible response structures
      const companiesData = Array.isArray(companiesResponse) 
        ? companiesResponse 
        : companiesResponse?.data || companiesResponse?.message || []
        
      const floorsData = Array.isArray(floorsResponse) 
        ? floorsResponse 
        : floorsResponse?.data || floorsResponse?.message || []
      
      setCompanies(companiesData)
      setFloors(floorsData)
      
      console.log('Set companies:', companiesData)
      console.log('Set floors:', floorsData)
    } catch (e) {
      console.error('Load error:', e)
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

  // Add safety checks for arrays
  const companiesArray = Array.isArray(companies) ? companies : []
  const floorsArray = Array.isArray(floors) ? floors : []

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Companies</h1>
          <p className='text-gray-600 mt-1'>Manage company information and floor assignments</p>
        </div>
        <Button 
          onClick={() => setIsOpen(true)}
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
          </svg>
          <span>Add Company</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-blue-100 text-sm font-medium'>Total Companies</p>
              <p className='text-3xl font-bold'>{companiesArray.length}</p>
            </div>
            <div className='w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
              </svg>
            </div>
          </div>
        </div>
        
        <div className='bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-green-100 text-sm font-medium'>Available Floors</p>
              <p className='text-3xl font-bold'>{floorsArray.length}</p>
            </div>
            <div className='w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' />
              </svg>
            </div>
          </div>
        </div>
        
        <div className='bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-purple-100 text-sm font-medium'>Assignments</p>
              <p className='text-3xl font-bold'>{companiesArray.filter(c => c.floor).length}</p>
            </div>
            <div className='w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' />
              </svg>
            </div>
          </div>
        </div>
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

      {/* Companies Table */}
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='flex items-center space-x-3'>
            <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
            <span className='text-gray-600'>Loading companies...</span>
          </div>
        </div>
      ) : (
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
            <h3 className='text-lg font-semibold text-gray-900'>Company Directory</h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Company</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Contact</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Floor Assignment</th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {companiesArray.map((company, index) => (
                  <tr key={company._id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3'>
                          <span className='text-blue-600 font-semibold text-sm'>{company.name?.charAt(0) || 'C'}</span>
                        </div>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>{company.name}</div>
                          <div className='text-sm text-gray-500'>ID: {company._id?.slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{company.email}</div>
                      <div className='text-sm text-gray-500'>{company.phone}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {company.floor ? (
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                          Floor {company.floor.floorNumber}
                        </span>
                      ) : (
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                          Not Assigned
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <div className='flex items-center justify-end space-x-2'>
                        <button
                          onClick={() => setAssignForm({ companyId: company._id, floorId: company.floor?._id || '' })}
                          className='text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150'
                        >
                          Assign Floor
                        </button>
                        <button
                          onClick={() => remove(company._id)}
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
            
            {companiesArray.length === 0 && !loading && (
              <div className='text-center py-12'>
                <svg className='w-12 h-12 text-gray-400 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                </svg>
                <h3 className='text-lg font-medium text-gray-900 mb-1'>No companies found</h3>
                <p className='text-gray-500'>Get started by adding your first company.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floor Assignment Form */}
      {assignForm.companyId && (
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>Assign Company to Floor</h3>
            <button
              onClick={() => setAssignForm({ companyId: '', floorId: '' })}
              className='text-gray-400 hover:text-gray-600'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
          <form onSubmit={assign} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Company</label>
                <select 
                  value={assignForm.companyId} 
                  onChange={e => setAssignForm(v => ({ ...v, companyId: e.target.value }))} 
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                >
                  {companiesArray.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Floor</label>
                <select 
                  value={assignForm.floorId} 
                  onChange={e => setAssignForm(v => ({ ...v, floorId: e.target.value }))} 
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                >
                  <option value=''>Select floor</option>
                  {floorsArray.map(f => <option key={f._id} value={f._id}>Floor {f.floorNumber}</option>)}
                </select>
              </div>
            </div>
            <div className='flex justify-end space-x-3'>
              <Button 
                type='button' 
                variant='outline' 
                onClick={() => setAssignForm({ companyId: '', floorId: '' })}
                className='px-4 py-2'
              >
                Cancel
              </Button>
              <Button 
                type='submit'
                className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2'
              >
                Assign Floor
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Add Company Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title='Add New Company'>
        <form onSubmit={submit} className='space-y-6'>
          <div className='space-y-4'>
            <Input 
              label='Company Name' 
              value={form.name} 
              required 
              onChange={e => setForm(v => ({ ...v, name: e.target.value }))}
              placeholder='Enter company name'
            />
            <Input 
              label='Email Address' 
              type='email' 
              value={form.email} 
              required 
              onChange={e => setForm(v => ({ ...v, email: e.target.value }))}
              placeholder='company@example.com'
            />
            <Input 
              label='Phone Number' 
              value={form.phone} 
              required 
              onChange={e => setForm(v => ({ ...v, phone: e.target.value }))}
              placeholder='+1 (555) 123-4567'
            />
          </div>
          <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200'>
            <Button 
              variant='outline' 
              type='button' 
              onClick={() => setIsOpen(false)}
              className='px-6 py-2'
            >
              Cancel
            </Button>
            <Button 
              type='submit'
              className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2'
            >
              Create Company
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
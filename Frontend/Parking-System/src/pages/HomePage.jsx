import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button.jsx'

const HomePage = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>P</span>
              </div>
              <h1 className='text-xl font-semibold text-gray-900'>Parking Management</h1>
            </div>
            <Link to='/admin'>
              <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
            Parking Management System
          </h1>
          <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto'>
            Efficiently manage companies, floors, and parking slot assignments for your organization.
          </p>
          
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link to='/admin'>
              <Button size='large' className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3'>
                Get Started
              </Button>
            </Link>
            <Button variant='outline' size='large' className='border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3'>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Features</h2>
            <p className='text-lg text-gray-600'>
              Everything you need to manage parking operations
            </p>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='bg-white rounded-lg p-6 shadow-sm border'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Company Management</h3>
              <p className='text-gray-600 text-sm'>
                Manage company information and floor assignments
              </p>
            </div>
            
            <div className='bg-white rounded-lg p-6 shadow-sm border'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4'>
                <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Floor Management</h3>
              <p className='text-gray-600 text-sm'>
                Create and manage parking floors with slot capacity
              </p>
            </div>
            
            <div className='bg-white rounded-lg p-6 shadow-sm border'>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4'>
                <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Smart Assignments</h3>
              <p className='text-gray-600 text-sm'>
                Assign employees to parking slots with RFID tracking
              </p>
            </div>
            
            <div className='bg-white rounded-lg p-6 shadow-sm border'>
              <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4'>
                <svg className='w-6 h-6 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Reports & Analytics</h3>
              <p className='text-gray-600 text-sm'>
                Generate reports and export data to CSV
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-blue-600'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold text-white mb-4'>
            Ready to Get Started?
          </h2>
          <p className='text-xl text-blue-100 mb-8'>
            Start managing your parking operations efficiently today.
          </p>
          <Link to='/admin'>
            <Button size='large' className='bg-white text-blue-600 hover:bg-gray-50 px-8 py-3'>
              Start Managing Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <p className='text-gray-400'>
            © 2024 Parking Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
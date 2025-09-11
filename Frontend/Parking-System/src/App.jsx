import './index.css'
import HomePage from './pages/HomePage'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout.jsx'
import Companies from './pages/admin/Companies.jsx'
import Floors from './pages/admin/Floors.jsx'
import Slots from './pages/admin/Slots.jsx'
import Logs from './pages/admin/Logs.jsx'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/admin' element={<AdminLayout/>}>
          <Route index element={<Navigate to='companies' replace />} />
          <Route path='companies' element={<Companies/>} />
          <Route path='floors' element={<Floors/>} />
          <Route path='slots' element={<Slots/>} />
          <Route path='logs' element={<Logs/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

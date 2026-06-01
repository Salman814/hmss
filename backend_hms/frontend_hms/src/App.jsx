import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageDoctors from './pages/admin/ManageDoctors'
import ManagePatients from './pages/admin/ManagePatients'
import ManageWards from './pages/admin/ManageWards'
import ManageAppointments from './pages/admin/ManageAppointments'

import DoctorDashboard from './pages/doctor/DoctorDashboard'
import PatientDashboard from './pages/patient/PatientDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        
        {/* Admin Routes */}
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/admin/doctors' element={<ManageDoctors />} />
        <Route path='/admin/patients' element={<ManagePatients />} />
        <Route path='/admin/wards' element={<ManageWards />} />
        <Route path='/admin/appointments' element={<ManageAppointments />} />

        {/* Other Roles */}
        <Route path='/doctor' element={<DoctorDashboard />} />
        <Route path='/patient' element={<PatientDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

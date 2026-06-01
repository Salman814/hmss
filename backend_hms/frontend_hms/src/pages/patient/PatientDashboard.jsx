import { useState, useEffect } from 'react'
import API from '../../api/axios'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'

function PatientDashboard() {
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    API.get('dashboard/patient/')
      .then(res => setAppointments(res.data.appointments))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <Sidebar />

      <div className='ml-64 w-full'>
        <Navbar />

        <div className='p-8'>
          <h1 className='text-3xl font-bold mb-6'>Patient Dashboard</h1>

          <div className='bg-white p-6 rounded-xl shadow mb-6'>
            <div className="flex justify-between items-center mb-4">
              <h2 className='text-xl font-bold'>Your Appointments</h2>
              <button className='bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition'>
                Book Appointment
              </button>
            </div>
            
            <table className='w-full'>
              <thead>
                <tr>
                  <th className='text-left pb-4 border-b'>Doctor</th>
                  <th className='text-left pb-4 border-b'>Time</th>
                  <th className='text-left pb-4 border-b'>Status</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map(appt => (
                  <tr key={appt.id} className="border-b">
                    <td className="py-3">Dr. {appt.doctor_name}</td>
                    <td className="py-3">{new Date(appt.time).toLocaleString()}</td>
                    <td className="py-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">No appointments scheduled</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard

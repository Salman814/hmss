import { useState, useEffect } from 'react'
import API from '../../api/axios'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([])

  const fetchAppointments = () => {
    API.get('dashboard/doctor/')
      .then(res => setAppointments(res.data.appointments))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`appointments/${id}/`, { status: newStatus })
      fetchAppointments()
    } catch (err) {
      alert('Failed to update status')
    }
  }

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <Sidebar />

      <div className='ml-64 w-full'>
        <Navbar />

        <div className='p-8'>
          <h1 className='text-3xl font-bold mb-6'>Doctor Dashboard</h1>

          <div className='bg-white rounded-xl shadow p-5'>
            <table className='w-full'>
              <thead>
                <tr>
                  <th className='text-left pb-4 border-b'>Patient</th>
                  <th className='text-left pb-4 border-b'>Time</th>
                  <th className='text-left pb-4 border-b'>Status</th>
                  <th className='text-left pb-4 border-b'>Action</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map(appt => (
                  <tr key={appt.id} className="border-b">
                    <td className="py-3">{appt.patient_name}</td>
                    <td className="py-3">{new Date(appt.time).toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold
                        ${appt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                          appt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' : 
                          appt.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <select 
                        className="border p-1 rounded text-sm bg-gray-50"
                        value={appt.status}
                        onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">No appointments scheduled</td>
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

export default DoctorDashboard

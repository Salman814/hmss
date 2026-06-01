import { useState, useEffect } from 'react'
import API from '../../api/axios'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'

function ManageAppointments() {
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [formData, setFormData] = useState({ patient_id: '', doctor_id: '', time: '', status: 'PENDING' })
  const [editingId, setEditingId] = useState(null)

  const fetchData = async () => {
    try {
      const appts = await API.get('appointments/')
      setAppointments(appts.data)
      
      const docs = await API.get('auth/users/?role=DOCTOR')
      setDoctors(docs.data)
      
      const pats = await API.get('auth/users/?role=PATIENT')
      setPatients(pats.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await API.put(`appointments/${editingId}/`, formData)
        alert('Appointment updated successfully!')
      } else {
        await API.post('appointments/', formData)
        alert('Appointment assigned successfully!')
      }
      fetchData()
      setFormData({ patient_id: '', doctor_id: '', time: '', status: 'PENDING' })
      setEditingId(null)
    } catch (err) {
      alert('Failed to save appointment')
    }
  }

  const handleEdit = (appt) => {
    setEditingId(appt.id)
    // Extract format YYYY-MM-DDTHH:MM from the ISO string to fit the input
    const formattedTime = new Date(appt.time).toISOString().slice(0, 16)
    setFormData({ patient_id: appt.patient, doctor_id: appt.doctor, time: formattedTime, status: appt.status })
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await API.delete(`appointments/${id}/`)
        fetchData()
      } catch (err) {
        alert('Failed to delete appointment.')
      }
    }
  }

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <Sidebar />
      <div className='ml-64 w-full'>
        <Navbar />
        <div className='p-8'>
          <h1 className='text-3xl font-bold mb-6'>Manage Appointments</h1>

          <div className='bg-white p-6 rounded-xl shadow mb-8'>
            <div className="flex justify-between items-center mb-4">
              <h2 className='text-xl font-bold'>{editingId ? 'Edit Appointment' : 'Assign Doctor to Patient'}</h2>
              {editingId && (
                <button onClick={() => { setEditingId(null); setFormData({ patient_id: '', doctor_id: '', time: '', status: 'PENDING' }) }} className="text-gray-500 hover:underline">
                  Cancel Edit
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="flex gap-4">
              <select className="border p-2 rounded flex-1" required value={formData.patient_id} onChange={e => setFormData({...formData, patient_id: e.target.value})}>
                <option value="">Select Patient...</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name || p.username}</option>)}
              </select>
              
              <select className="border p-2 rounded flex-1" required value={formData.doctor_id} onChange={e => setFormData({...formData, doctor_id: e.target.value})}>
                <option value="">Select Doctor...</option>
                {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.name || d.username}</option>)}
              </select>

              <input type="datetime-local" required className="border p-2 rounded flex-1" 
                value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />

              {editingId && (
                <select className="border p-2 rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              )}

              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                {editingId ? 'Update' : 'Assign'}
              </button>
            </form>
          </div>

          <div className='bg-white p-6 rounded-xl shadow'>
            <h2 className='text-xl font-bold mb-4'>All Appointments</h2>
            <table className='w-full'>
              <thead>
                <tr>
                  <th className='text-left pb-4 border-b'>Patient</th>
                  <th className='text-left pb-4 border-b'>Doctor</th>
                  <th className='text-left pb-4 border-b'>Time</th>
                  <th className='text-left pb-4 border-b'>Status</th>
                  <th className='text-right pb-4 border-b'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appt => (
                  <tr key={appt.id} className="border-b">
                    <td className="py-3">{appt.patient_name}</td>
                    <td className="py-3">Dr. {appt.doctor_name}</td>
                    <td className="py-3">{new Date(appt.time).toLocaleString()}</td>
                    <td className="py-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button onClick={() => handleEdit(appt)} className="text-blue-500 hover:text-blue-700 mr-4 font-medium">Edit</button>
                      <button onClick={() => handleDelete(appt.id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageAppointments

import { useState, useEffect } from 'react'
import API from '../../api/axios'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'

function ManageDoctors() {
  const [doctors, setDoctors] = useState([])
  const [formData, setFormData] = useState({ username: '', name: '', email: '', password: '' })
  const [editingId, setEditingId] = useState(null)

  const fetchDoctors = () => {
    API.get('auth/users/?role=DOCTOR')
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const buildPayload = () => {
    const payload = {
      username: formData.username,
      name: formData.name,
      email: formData.email,
      role: 'DOCTOR'
    }

    if (formData.password) {
      payload.password = formData.password
    }

    return payload
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = buildPayload()
      if (editingId) {
        await API.put(`auth/users/${editingId}/`, payload)
        alert('Doctor updated successfully!')
      } else {
        await API.post('auth/users/', payload)
        alert('Doctor created successfully!')
      }
      fetchDoctors()
      setFormData({ username: '', name: '', email: '', password: '' })
      setEditingId(null)
    } catch (err) {
      alert('Failed to save doctor')
    }
  }

  const handleEdit = (doctor) => {
    setEditingId(doctor.id)
    setFormData({
      username: doctor.username || '',
      name: doctor.name || '',
      email: doctor.email || '',
      password: ''
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await API.delete(`auth/users/${id}/`)
        fetchDoctors()
      } catch (err) {
        alert('Failed to delete doctor. You cannot delete yourself.')
      }
    }
  }

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <Sidebar />
      <div className='ml-64 w-full'>
        <Navbar />
        <div className='p-8'>
          <h1 className='text-3xl font-bold mb-6'>Manage Doctors</h1>

          <div className='bg-white p-6 rounded-xl shadow mb-8'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold'>{editingId ? 'Edit Doctor' : 'Create New Doctor'}</h2>
              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null)
                    setFormData({ username: '', name: '', email: '', password: '' })
                  }}
                  className='text-gray-500 hover:underline'
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className='flex gap-4'>
              <input
                type='text'
                placeholder='Username'
                required
                className='border p-2 rounded'
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
              <input
                type='text'
                placeholder='Full Name'
                required
                className='border p-2 rounded'
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type='email'
                placeholder='Email'
                required
                className='border p-2 rounded'
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type='password'
                placeholder={editingId ? 'Leave blank to keep current' : 'Password'}
                required={!editingId}
                className='border p-2 rounded'
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
              <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded'>
                {editingId ? 'Update Doctor' : 'Create Doctor'}
              </button>
            </form>
          </div>

          <div className='bg-white p-6 rounded-xl shadow'>
            <h2 className='text-xl font-bold mb-4'>All Doctors</h2>
            <table className='w-full'>
              <thead>
                <tr>
                  <th className='text-left pb-4 border-b'>Name</th>
                  <th className='text-left pb-4 border-b'>Username</th>
                  <th className='text-left pb-4 border-b'>Email</th>
                  <th className='text-right pb-4 border-b'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map(doctor => (
                  <tr key={doctor.id} className='border-b'>
                    <td className='py-3'>{doctor.name || '-'}</td>
                    <td className='py-3'>{doctor.username}</td>
                    <td className='py-3'>{doctor.email}</td>
                    <td className='py-3 text-right'>
                      <button onClick={() => handleEdit(doctor)} className='text-blue-500 hover:text-blue-700 mr-4 font-medium'>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(doctor.id)} className='text-red-500 hover:text-red-700 font-medium'>
                        Delete
                      </button>
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

export default ManageDoctors

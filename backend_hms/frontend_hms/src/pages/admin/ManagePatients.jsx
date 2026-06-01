import { useState, useEffect, useMemo } from 'react'
import API from '../../api/axios'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'

function ManagePatients() {
  const [patients, setPatients] = useState([])
  const [wards, setWards] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    ward_id: '',
    bed_number: '',
    password: ''
  })
  const [editingId, setEditingId] = useState(null)

  const wardMap = useMemo(() => {
    return wards.reduce((acc, ward) => {
      acc[ward.id] = ward
      return acc
    }, {})
  }, [wards])

  const fetchData = async () => {
    try {
      const patientsRes = await API.get('auth/users/?role=PATIENT')
      setPatients(patientsRes.data)

      const wardsRes = await API.get('wards/')
      setWards(wardsRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const buildPayload = () => {
    const payload = {
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone_number,
      role: 'PATIENT'
    }

    if (formData.ward_id) {
      payload.ward_id = formData.ward_id
    }

    if (formData.bed_number) {
      payload.bed_number = Number(formData.bed_number)
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
        alert('Patient updated successfully!')
      } else {
        await API.post('auth/users/', payload)
        alert('Patient created successfully!')
      }
      fetchData()
      setFormData({ name: '', email: '', phone_number: '', ward_id: '', bed_number: '', password: '' })
      setEditingId(null)
    } catch (err) {
      alert('Failed to save patient')
    }
  }

  const handleEdit = (patient) => {
    setEditingId(patient.id)
    setFormData({
      name: patient.name || '',
      email: patient.email || '',
      phone_number: patient.phone_number || '',
      ward_id: patient.assigned_ward || '',
      bed_number: patient.bed_number || '',
      password: ''
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await API.delete(`auth/users/${id}/`)
        fetchData()
      } catch (err) {
        alert('Failed to delete patient. You cannot delete yourself.')
      }
    }
  }

  const selectedWard = wardMap[Number(formData.ward_id)]

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <Sidebar />
      <div className='ml-64 w-full'>
        <Navbar />
        <div className='p-8'>
          <h1 className='text-3xl font-bold mb-6'>Manage Patients</h1>

          <div className='bg-white p-6 rounded-xl shadow mb-8'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold'>{editingId ? 'Edit Patient' : 'Create New Patient'}</h2>
              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null)
                    setFormData({ name: '', email: '', phone_number: '', ward_id: '', bed_number: '', password: '' })
                  }}
                  className='text-gray-500 hover:underline'
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className='flex flex-wrap gap-4'>
              <input
                type='text'
                placeholder='Full Name'
                required
                className='border p-2 rounded flex-1 min-w-[200px]'
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type='email'
                placeholder='Email'
                required
                className='border p-2 rounded flex-1 min-w-[200px]'
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type='text'
                placeholder='Phone Number'
                required
                className='border p-2 rounded flex-1 min-w-[180px]'
                value={formData.phone_number}
                onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
              />
              <select
                className='border p-2 rounded flex-1 min-w-[200px]'
                value={formData.ward_id}
                onChange={e => setFormData({ ...formData, ward_id: e.target.value, bed_number: '' })}
              >
                <option value=''>Assign Ward (optional)</option>
                {wards.map(ward => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name} (Available: {ward.available_beds})
                  </option>
                ))}
              </select>
              <input
                type='number'
                placeholder='Bed Number'
                min='1'
                max={selectedWard ? selectedWard.total_beds : undefined}
                className='border p-2 rounded w-36'
                value={formData.bed_number}
                onChange={e => setFormData({ ...formData, bed_number: e.target.value })}
                disabled={!formData.ward_id}
              />
              <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded'>
                {editingId ? 'Update Patient' : 'Create Patient'}
              </button>
            </form>
          </div>

          <div className='bg-white p-6 rounded-xl shadow'>
            <h2 className='text-xl font-bold mb-4'>All Patients</h2>
            <table className='w-full'>
              <thead>
                <tr>
                  <th className='text-left pb-4 border-b'>Name</th>
                  <th className='text-left pb-4 border-b'>Email</th>
                  <th className='text-left pb-4 border-b'>Phone</th>
                  <th className='text-left pb-4 border-b'>Ward</th>
                  <th className='text-left pb-4 border-b'>Bed</th>
                  <th className='text-right pb-4 border-b'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(patient => (
                  <tr key={patient.id} className='border-b'>
                    <td className='py-3'>{patient.name || '-'}</td>
                    <td className='py-3'>{patient.email}</td>
                    <td className='py-3'>{patient.phone_number || '-'}</td>
                    <td className='py-3'>{wardMap[patient.assigned_ward]?.name || '-'}</td>
                    <td className='py-3'>{patient.bed_number || '-'}</td>
                    <td className='py-3 text-right'>
                      <button onClick={() => handleEdit(patient)} className='text-blue-500 hover:text-blue-700 mr-4 font-medium'>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(patient.id)} className='text-red-500 hover:text-red-700 font-medium'>
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

export default ManagePatients

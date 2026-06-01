import { useState, useEffect } from 'react'
import API from '../../api/axios'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'

function ManageWards() {
  const [wards, setWards] = useState([])
  const [formData, setFormData] = useState({ name: '', total_beds: '', occupied_beds: '' })
  const [editingId, setEditingId] = useState(null)

  const fetchWards = () => {
    API.get('wards/')
      .then(res => setWards(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchWards()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await API.put(`wards/${editingId}/`, formData)
        alert('Ward updated successfully!')
      } else {
        await API.post('wards/', formData)
        alert('Ward created successfully!')
      }
      fetchWards()
      setFormData({ name: '', total_beds: '', occupied_beds: '' })
      setEditingId(null)
    } catch (err) {
      alert('Failed to save ward')
    }
  }

  const handleEdit = (ward) => {
    setEditingId(ward.id)
    setFormData({ name: ward.name, total_beds: ward.total_beds, occupied_beds: ward.occupied_beds })
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ward?")) {
      try {
        await API.delete(`wards/${id}/`)
        fetchWards()
      } catch (err) {
        alert('Failed to delete ward.')
      }
    }
  }

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <Sidebar />
      <div className='ml-64 w-full'>
        <Navbar />
        <div className='p-8'>
          <h1 className='text-3xl font-bold mb-6'>Manage Wards</h1>

          <div className='bg-white p-6 rounded-xl shadow mb-8'>
            <div className="flex justify-between items-center mb-4">
              <h2 className='text-xl font-bold'>{editingId ? 'Edit Ward' : 'Create New Ward'}</h2>
              {editingId && (
                <button onClick={() => { setEditingId(null); setFormData({ name: '', total_beds: '', occupied_beds: '' }) }} className="text-gray-500 hover:underline">
                  Cancel Edit
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input type="text" placeholder="Ward Name" required className="border p-2 rounded flex-1" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="number" placeholder="Total Beds" required className="border p-2 rounded w-32" 
                value={formData.total_beds} onChange={e => setFormData({...formData, total_beds: e.target.value})} />
              <input type="number" placeholder="Occupied Beds" required className="border p-2 rounded w-32" 
                value={formData.occupied_beds} onChange={e => setFormData({...formData, occupied_beds: e.target.value})} />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                {editingId ? 'Update Ward' : 'Create Ward'}
              </button>
            </form>
          </div>

          <div className='bg-white p-6 rounded-xl shadow'>
            <h2 className='text-xl font-bold mb-4'>All Wards</h2>
            <table className='w-full'>
              <thead>
                <tr>
                  <th className='text-left pb-4 border-b'>Ward Name</th>
                  <th className='text-left pb-4 border-b'>Total Beds</th>
                  <th className='text-left pb-4 border-b'>Occupied Beds</th>
                  <th className='text-left pb-4 border-b'>Available Beds</th>
                  <th className='text-right pb-4 border-b'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {wards.map(ward => (
                  <tr key={ward.id} className="border-b">
                    <td className="py-3 font-semibold">{ward.name}</td>
                    <td className="py-3">{ward.total_beds}</td>
                    <td className="py-3">{ward.occupied_beds}</td>
                    <td className="py-3 text-green-600 font-bold">{ward.available_beds}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => handleEdit(ward)} className="text-blue-500 hover:text-blue-700 mr-4 font-medium">Edit</button>
                      <button onClick={() => handleDelete(ward.id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
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

export default ManageWards

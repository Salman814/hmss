import { useState, useEffect } from 'react'
import API from '../../api/axios'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'

function ManageUsers() {
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'DOCTOR' })
  const [editingId, setEditingId] = useState(null)

  const fetchUsers = () => {
    API.get('auth/users/')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await API.put(`auth/users/${editingId}/`, formData)
        alert('User updated successfully!')
      } else {
        await API.post('auth/users/', formData)
        alert('User created successfully!')
      }
      fetchUsers()
      setFormData({ username: '', email: '', password: '', role: 'DOCTOR' })
      setEditingId(null)
    } catch (err) {
      alert('Failed to save user')
    }
  }

  const handleEdit = (user) => {
    setEditingId(user.id)
    setFormData({ username: user.username, email: user.email, password: '', role: user.role })
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await API.delete(`auth/users/${id}/`)
        fetchUsers()
      } catch (err) {
        alert('Failed to delete user. You cannot delete yourself.')
      }
    }
  }

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <Sidebar />
      <div className='ml-64 w-full'>
        <Navbar />
        <div className='p-8'>
          <h1 className='text-3xl font-bold mb-6'>Manage Users</h1>

          <div className='bg-white p-6 rounded-xl shadow mb-8'>
            <div className="flex justify-between items-center mb-4">
              <h2 className='text-xl font-bold'>{editingId ? 'Edit User' : 'Create New User'}</h2>
              {editingId && (
                <button onClick={() => { setEditingId(null); setFormData({ username: '', email: '', password: '', role: 'DOCTOR' }) }} className="text-gray-500 hover:underline">
                  Cancel Edit
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input type="text" placeholder="Username" required className="border p-2 rounded" 
                value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              <input type="email" placeholder="Email" required className="border p-2 rounded" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              {formData.role !== 'PATIENT' && (
                <input type="password" placeholder={editingId ? "Leave blank to keep current" : "Password"} required={!editingId} className="border p-2 rounded" 
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              )}
              <select className="border p-2 rounded" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="DOCTOR">Doctor</option>
                <option value="PATIENT">Patient</option>
                <option value="WARD">Ward Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                {editingId ? 'Update User' : 'Create User'}
              </button>
            </form>
          </div>

          <div className='bg-white p-6 rounded-xl shadow'>
            <h2 className='text-xl font-bold mb-4'>All Users</h2>
            <table className='w-full'>
              <thead>
                <tr>
                  <th className='text-left pb-4 border-b'>Username</th>
                  <th className='text-left pb-4 border-b'>Email</th>
                  <th className='text-left pb-4 border-b'>Role</th>
                  <th className='text-right pb-4 border-b'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3">{user.username}</td>
                    <td className="py-3">{user.email}</td>
                    <td className="py-3 font-semibold">{user.role}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => handleEdit(user)} className="text-blue-500 hover:text-blue-700 mr-4 font-medium">Edit</button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
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

export default ManageUsers

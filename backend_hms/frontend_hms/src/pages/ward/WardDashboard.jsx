import { useState, useEffect } from 'react'
import API from '../../api/axios'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'

function WardDashboard() {
  const [data, setData] = useState({ wards: [], total_available_beds: 0, total_occupied_beds: 0 })

  const fetchWards = () => {
    API.get('dashboard/ward/')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchWards()
  }, [])

  const handleOccupancyChange = async (id, newOccupancy, totalBeds) => {
    const val = parseInt(newOccupancy)
    if (val < 0 || val > totalBeds) {
      alert(`Occupied beds must be between 0 and ${totalBeds}`)
      return
    }
    
    try {
      await API.put(`wards/${id}/`, { occupied_beds: val })
      fetchWards()
    } catch (err) {
      alert('Failed to update occupancy')
    }
  }

  return (
    <div className='flex bg-gray-100 min-h-screen'>
      <Sidebar />

      <div className='ml-64 w-full'>
        <Navbar />

        <div className='p-8'>
          <h1 className='text-3xl font-bold mb-6'>Ward Dashboard</h1>

          <div className='grid grid-cols-2 gap-5 mb-8'>
            <div className='bg-green-500 text-white p-6 rounded-xl shadow'>
              <h2 className='text-lg mb-1'>Available Beds</h2>
              <h1 className='text-4xl font-bold'>{data.total_available_beds}</h1>
            </div>

            <div className='bg-red-500 text-white p-6 rounded-xl shadow'>
              <h2 className='text-lg mb-1'>Occupied Beds</h2>
              <h1 className='text-4xl font-bold'>{data.total_occupied_beds}</h1>
            </div>
          </div>

          <div className='bg-white p-6 rounded-xl shadow'>
            <h2 className='text-xl font-bold mb-4'>All Wards</h2>
            <table className='w-full'>
              <thead>
                <tr>
                  <th className='text-left pb-4 border-b'>Ward Name</th>
                  <th className='text-left pb-4 border-b'>Total Beds</th>
                  <th className='text-left pb-4 border-b'>Occupied</th>
                  <th className='text-left pb-4 border-b'>Available</th>
                  <th className='text-left pb-4 border-b'>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.wards.map(ward => (
                  <tr key={ward.id} className="border-b">
                    <td className="py-3 font-semibold">{ward.name}</td>
                    <td className="py-3">{ward.total_beds}</td>
                    <td className="py-3">{ward.occupied_beds}</td>
                    <td className="py-3 text-green-600 font-bold">{ward.available_beds}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <input 
                          id={`ward-input-${ward.id}`}
                          type="number" 
                          min="0"
                          max={ward.total_beds}
                          className="border p-1 rounded w-20 text-sm"
                          defaultValue={ward.occupied_beds}
                        />
                        <button 
                          onClick={() => {
                            const val = document.getElementById(`ward-input-${ward.id}`).value
                            handleOccupancyChange(ward.id, val, ward.total_beds)
                          }}
                          className="bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-1 rounded text-sm font-medium"
                        >
                          Update
                        </button>
                      </div>
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

export default WardDashboard

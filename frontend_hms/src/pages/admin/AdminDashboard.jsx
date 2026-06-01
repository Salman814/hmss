import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import API from '../../api/axios'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import DashboardCard from '../../components/DashboardCard'

function AdminDashboard() {
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, wards: 0 })

  useEffect(() => {
    API.get('dashboard/admin/')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
  }, [])

  const barData = [
    { name: 'Doctors', count: stats.doctors },
    { name: 'Patients', count: stats.patients },
    { name: 'Appointments', count: stats.appointments },
    { name: 'Wards', count: stats.wards }
  ]

  const pieData = [
    { name: 'Doctors', value: stats.doctors },
    { name: 'Patients', value: stats.patients }
  ]

  const COLORS = ['#2563eb', '#0d9488', '#0284c7', '#0891b2']

  return (
    <div className='flex bg-slate-50 min-h-screen'>
      <Sidebar />

      <div className='ml-64 w-full flex flex-col'>
        <Navbar />

        <div className='p-8 flex-1'>
          <div className='grid grid-cols-4 gap-6 mb-8'>
            <DashboardCard title='Doctors' value={stats.doctors} />
            <DashboardCard title='Patients' value={stats.patients} />
            <DashboardCard title='Appointments' value={stats.appointments} />
            <DashboardCard title='Wards' value={stats.wards} />
          </div>

          <div className='grid grid-cols-2 gap-6'>
            {/* Bar Chart */}
            <div className='bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow'>
              <h2 className='text-lg font-bold text-slate-800 mb-6'>System Overview</h2>
              <div className='h-72'>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className='bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow'>
              <h2 className='text-lg font-bold text-slate-800 mb-6'>Staff vs Patients Ratio</h2>
              <div className='h-72'>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

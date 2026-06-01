import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Bell } from 'lucide-react'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const role = localStorage.getItem('role') || 'User'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/')
  }

  // Get a readable title for the current page
  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/admin') return 'Dashboard Overview'
    if (path.includes('/doctors')) return 'Doctors'
    if (path.includes('/patients')) return 'Patients'
    if (path.includes('/wards')) return 'Ward Management'
    if (path.includes('/appointments')) return 'Appointments'
    if (path === '/doctor') return 'Doctor Schedule'
    if (path === '/patient') return 'My Appointments'
    return 'Dashboard Overview'
  }

  return (
    <div className='bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10 px-8 py-5 flex justify-between items-center'>
      <div>
        <h1 className='text-2xl font-bold text-slate-800 tracking-tight'>{getPageTitle()}</h1>
        <p className='text-sm text-slate-500 mt-1'>Welcome back, {role.charAt(0) + role.slice(1).toLowerCase()}</p>
      </div>

      <div className='flex items-center gap-6'>
        <button className='text-slate-400 hover:text-indigo-600 transition-colors relative'>
          <Bell size={20} />
          <span className='absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full'></span>
        </button>

        <div className='h-8 w-px bg-gray-200'></div>

        <button 
          onClick={handleLogout}
          className='flex items-center gap-2 text-slate-500 hover:text-red-600 font-medium transition-colors bg-white hover:bg-red-50 px-4 py-2 rounded-lg border border-transparent hover:border-red-100'
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Navbar

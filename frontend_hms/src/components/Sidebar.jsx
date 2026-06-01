import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, BedDouble, CalendarHeart, Stethoscope } from 'lucide-react'

function Sidebar() {
  const location = useLocation()
  const role = localStorage.getItem('role')
  const isAdmin = role === 'ADMIN'

  const NavItem = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
      >
        <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
        <span className='font-medium whitespace-nowrap'>{children}</span>
      </Link>
    )
  }

  return (
    <div className='w-64 h-screen bg-slate-900 border-r border-slate-800 text-white p-4 fixed flex flex-col'>
      <div className='flex items-center gap-3 px-1 py-4 mb-4'>
        <img src="/logo-transparent.png" alt="SMC Logo" className="w-10 h-10 object-contain drop-shadow-md shrink-0" />
        <div className='flex flex-col overflow-hidden'>
          <h1 className='text-xl font-bold tracking-tight leading-tight'>SMC</h1>
          <p className='text-[9px] text-teal-400 font-bold tracking-[0.15em] uppercase mt-0.5 whitespace-nowrap'>Medical Centre</p>
        </div>
      </div>

      <div className='flex flex-col gap-2 overflow-y-auto'>
        {isAdmin && (
          <>
            <div className='text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mt-4 mb-2'>Overview</div>
            <NavItem to='/admin' icon={LayoutDashboard}>Dashboard</NavItem>
            
            <div className='text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mt-6 mb-2'>Management</div>
            <NavItem to='/admin/doctors' icon={Users}>Doctors</NavItem>
            <NavItem to='/admin/patients' icon={Users}>Patients</NavItem>
            <NavItem to='/admin/wards' icon={BedDouble}>Ward Management</NavItem>
            <NavItem to='/admin/appointments' icon={CalendarHeart}>Appointments</NavItem>
          </>
        )}

        {!isAdmin && role === 'DOCTOR' && (
           <NavItem to='/doctor' icon={Stethoscope}>My Schedule</NavItem>
        )}

        {!isAdmin && role === 'PATIENT' && (
           <NavItem to='/patient' icon={CalendarHeart}>My Appointments</NavItem>
        )}

      </div>
    </div>
  )
}

export default Sidebar

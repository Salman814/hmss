import { Users, BedDouble, CalendarHeart, Activity } from 'lucide-react'

function DashboardCard({ title, value }) {
  const getIcon = () => {
    switch (title.toLowerCase()) {
      case 'doctors': return <Activity size={24} className="text-blue-600" />;
      case 'patients': return <Users size={24} className="text-teal-600" />;
      case 'appointments': return <CalendarHeart size={24} className="text-sky-600" />;
      case 'wards': return <BedDouble size={24} className="text-cyan-600" />;
      default: return <Activity size={24} className="text-blue-600" />;
    }
  }

  const getGradient = () => {
    switch (title.toLowerCase()) {
      case 'doctors': return 'from-blue-50 to-blue-100/50 border-blue-100';
      case 'patients': return 'from-teal-50 to-teal-100/50 border-teal-100';
      case 'appointments': return 'from-sky-50 to-sky-100/50 border-sky-100';
      case 'wards': return 'from-cyan-50 to-cyan-100/50 border-cyan-100';
      default: return 'from-blue-50 to-blue-100/50 border-blue-100';
    }
  }

  return (
    <div className={`bg-gradient-to-br ${getGradient()} p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}>
      <div className="flex justify-between items-start">
        <div className="z-10">
          <h2 className='text-slate-500 font-semibold text-sm uppercase tracking-wider'>{title}</h2>
          <h1 className='text-4xl font-bold mt-2 text-slate-800 tracking-tight'>{value}</h1>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm z-10">
          {getIcon()}
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-5 transform scale-[3] group-hover:scale-[3.5] transition-transform duration-500">
         {getIcon()}
      </div>
    </div>
  )
}

export default DashboardCard

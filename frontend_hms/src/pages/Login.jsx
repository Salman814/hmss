import { useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const res = await API.post('auth/login/', {
        username,
        password
      })

      localStorage.setItem('token', res.data.access)
      localStorage.setItem('role', res.data.role)

      const role = res.data.role
      if (role === 'ADMIN') navigate('/admin')
      else if (role === 'DOCTOR') navigate('/doctor')
      else {
        alert('Login is allowed only for admin and doctor')
        navigate('/')
      }
      
    } catch (error) {
      alert('Login Failed: Check username and password')
    }
  }

  return (
    <div className='h-screen flex justify-center items-center bg-gradient-to-br from-cyan-900 via-teal-900 to-blue-900'>
      <div className='bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl w-[400px] text-white'>
        <div className='flex justify-center mb-6'>
          <img src="/logo-transparent.png" alt="SMC Logo" className="w-28 h-28 object-contain drop-shadow-2xl hover:scale-105 transition-transform" />
        </div>
        <h1 className='text-3xl font-bold mb-2 text-center tracking-tight'>Welcome Back</h1>
        <p className='text-gray-300 text-center mb-8'>Sign in to your account</p>

        <div className='space-y-4'>
          <input
            type='text'
            placeholder='Username'
            className='w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/10 transition-all'
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type='password'
            placeholder='Password'
            className='w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/10 transition-all'
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className='w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium p-3 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 mt-2'
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login

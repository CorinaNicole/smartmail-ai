import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/auth'
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-green-700 p-4 rounded-2xl shadow-lg shadow-green-200 mb-4 transition-transform hover:scale-105">
            <ShieldCheck size={40} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-gray-950 tracking-tight">SmartMail AI</h1>
          <p className="text-gray-500 mt-2 font-medium text-center">Protegiendo tu bandeja de entrada con IA</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>
            <p className="text-sm text-gray-500 mt-1">Bienvenido de nuevo, te extrañamos.</p>
          </div>
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl px-4 py-3 mb-6 text-sm font-medium animate-shake">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <input
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-600 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Contraseña</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-600 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-2xl text-sm transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Ingresar al sistema
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          <div className="mt-10 pt-6 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-500 font-medium">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-green-700 font-bold hover:text-green-800 transition-colors">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
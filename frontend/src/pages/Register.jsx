import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/auth'
import { ShieldCheck, User, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.nombre, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        
        {/* Branding Superior */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-green-700 p-4 rounded-2xl shadow-lg shadow-green-200 mb-4 transition-transform hover:scale-105">
            <ShieldCheck size={40} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-gray-950 tracking-tight">SmartMail AI</h1>
        </div>

        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
              <Sparkles size={12} /> Unirse a la comunidad
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Crear cuenta</h2>
            <p className="text-sm text-gray-500 mt-1">Empieza a detectar mensajes maliciosos hoy mismo.</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl px-4 py-3 mb-6 text-sm font-medium animate-shake">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Nombre Completo</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={form.nombre}
                  onChange={e => setForm({...form, nombre: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-600 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <input
                  type="email"
                  placeholder="tu@correo.com"
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
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-600 focus:bg-white transition-all"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-2xl text-sm transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Crear mi cuenta ahora'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-500 font-medium">
              ¿Ya eres miembro?{' '}
              <Link to="/login" className="text-green-700 font-bold hover:text-green-800 transition-colors">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
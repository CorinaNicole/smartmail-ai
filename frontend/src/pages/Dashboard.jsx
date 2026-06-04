import { useEffect, useState } from "react"
import { obtenerStats, obtenerHistorial } from "../services/api"
import { getUsuario } from "../services/auth"
import StatCard from "../components/StatCard"
import HistorialItem from "../components/HistorialItem"
import { Mail, Zap, ShieldCheck, TrendingUp, Loader2, ArrowUpRight, Search } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [historial, setHistorial] = useState([])
  const [cargando, setCargando] = useState(true)
  const usuario = getUsuario()

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [resStats, resHistorial] = await Promise.all([
          obtenerStats(),
          obtenerHistorial(8)
        ])
        setStats(resStats.data)
        setHistorial(resHistorial.data)
      } catch (e) {
        console.error("Error al cargar dashboard:", e)
      } finally {
        setCargando(false)
      }
    }
    cargarDatos()
  }, [])

  if (cargando) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-slate-500 dark:text-slate-400">
      <Loader2 className="animate-spin mb-4 text-primary" size={40} />
      <p className="font-bold text-lg tracking-tight">Sincronizando datos...</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-950 dark:text-white tracking-tighter">
            Hola, {usuario?.nombre || 'Desarrollador'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Esto es lo que ha detectado tu motor de IA hoy.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <TrendingUp size={24} />
          </div>
          <div className="pr-4">
            <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Estado Global</p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Sistema Optimizado</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          label="Total Analizados" 
          value={stats?.total ?? 0} 
          icon={Mail} 
          trend="+12%" 
          variant="indigo" 
        />
        <StatCard 
          label="Amenazas Spam" 
          value={stats?.total_spam ?? 0} 
          icon={Zap} 
          trend="Crítico" 
          variant="danger" 
        />
        <StatCard 
          label="Mensajes Seguros" 
          value={stats?.total_ham ?? 0} 
          icon={ShieldCheck} 
          trend="Seguro" 
          variant="success" 
        />
        <StatCard 
          label="Tasa de Precisión" 
          value={stats?.accuracy ? `${stats.accuracy.toFixed(1)}%` : "98.2%"} 
          icon={TrendingUp} 
          trend="Alta" 
          variant="primary" 
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tabla de Historial */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Actividad Reciente</h3>
            <a href="/historial" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all">
              Ver reporte completo <ArrowUpRight size={16} />
            </a>
          </div>
          
          <div className="space-y-1">
            {historial.length > 0 ? (
              historial.map((item, index) => (
                <div key={item.id} className="animate-in fade-in slide-in-from-bottom-2 transition-all" style={{ animationDelay: `${index * 50}ms` }}>
                  <HistorialItem item={item} />
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-slate-400">
                Aún no hay datos para mostrar. Comienza analizando un mensaje.
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-slate-900 dark:bg-primary rounded-[2rem] p-8 text-white shadow-lg shadow-slate-200 dark:shadow-primary/20 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-xl font-bold mb-2">Escaneo Rápido</h4>
              <p className="text-slate-300 dark:text-white/80 text-sm mb-6 leading-relaxed">
                ¿Recibiste un correo extraño? Nuestro motor de IA lo procesará en milisegundos.
              </p>
              <a href="/analizar" className="inline-block bg-white text-slate-900 dark:text-primary px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform active:scale-95">
                Analizar ahora
              </a>
            </div>
            <Search size={120} className="absolute -bottom-4 -right-4 text-white/5 group-hover:text-white/10 transition-colors rotate-12" />
          </div>
        </div>

      </div>
    </div>
  )
}
import { useEffect, useState } from "react"
import { obtenerStats, obtenerHistorial } from "../services/api"
import { getUsuario } from "../services/auth"
import StatCard from "../components/StatCard"
import HistorialItem from "../components/HistorialItem"
import {
  Mail, Zap, ShieldCheck, TrendingUp, Loader2,
  ArrowUpRight, Search, MessageCircle, Send, Inbox
} from 'lucide-react'

// Icono y color por canal
const CANAL_CONFIG = {
  web:      { label: "Web",      color: "bg-indigo-500",  emoji: "🌐" },
  telegram: { label: "Telegram", color: "bg-sky-500",     emoji: "✈️" },
  discord:  { label: "Discord",  color: "bg-violet-500",  emoji: "🎮" },
  gmail:    { label: "Gmail",    color: "bg-red-500",      emoji: "📧" },
}

function BarraCanal({ canal, total, spam, totalGeneral }) {
  const cfg = CANAL_CONFIG[canal] || { label: canal, color: "bg-slate-500", emoji: "📨" }
  const pct = totalGeneral > 0 ? Math.round((total / totalGeneral) * 100) : 0
  const spamPct = total > 0 ? Math.round((spam / total) * 100) : 0

  return (
    <div className="flex items-center gap-4">
      <div className="w-8 text-center text-lg">{cfg.emoji}</div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{cfg.label}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {spam} spam de {total} ({spamPct}%)
          </span>
        </div>
        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${cfg.color} transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className="text-sm font-black text-slate-900 dark:text-white w-8 text-right">{pct}%</span>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats]     = useState(null)
  const [historial, setHistorial] = useState([])
  const [cargando, setCargando]   = useState(true)
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

  const porCanal = stats?.por_canal ?? []
  const totalGeneral = stats?.total ?? 0

  // Asegurar que siempre aparezcan los 4 canales aunque estén en 0
  const CANALES = ["web", "telegram", "discord", "gmail"]
  const canalMap = Object.fromEntries(porCanal.map(c => [c.canal, c]))
  const canalesCompletos = CANALES.map(c => ({
    canal: c,
    total: canalMap[c]?.total ?? 0,
    spam:  canalMap[c]?.spam  ?? 0,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-950 dark:text-white tracking-tighter">
            Hola, {usuario?.nombre || 'Usuario'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Esto es lo que ha detectado tu motor de IA en todos tus canales.
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

      {/* Stats Cards */}
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Historial reciente */}
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
                Aún no hay datos. Comienza analizando un mensaje.
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">

          {/* ── STATS POR CANAL ── */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none p-7">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Spam por Canal
            </h4>

            {/* Tarjetas rápidas de cada canal */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {canalesCompletos.map(({ canal, total, spam }) => {
                const cfg = CANAL_CONFIG[canal] || { emoji: "📨", label: canal, color: "bg-slate-500" }
                return (
                  <div key={canal} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 flex flex-col gap-1">
                    <span className="text-xl">{cfg.emoji}</span>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{cfg.label}</p>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{spam}</p>
                    <p className="text-xs text-slate-400">de {total} mens.</p>
                  </div>
                )
              })}
            </div>

            {/* Barras de distribución */}
            <div className="space-y-4">
              {canalesCompletos.map(({ canal, total, spam }) => (
                <BarraCanal
                  key={canal}
                  canal={canal}
                  total={total}
                  spam={spam}
                  totalGeneral={totalGeneral}
                />
              ))}
            </div>
          </div>

          {/* CTA Escaneo rápido */}
          <div className="bg-slate-900 dark:bg-primary rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden group">
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

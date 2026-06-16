import { useEffect, useState } from "react"
import { obtenerHistorial } from "../services/api"
import HistorialItem from "../components/HistorialItem"
import { History, Inbox, ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react'

const CANALES = [
  { id: "todos",    label: "Todos",    emoji: null },
  { id: "web",      label: "Web",      emoji: "🌐" },
  { id: "telegram", label: "Telegram", emoji: "✈️" },
  { id: "discord",  label: "Discord",  emoji: "🎮" },
  { id: "gmail",    label: "Gmail",    emoji: "📧" },
]

const FILTROS = [
  { id: "todos", label: "Todos",          icon: Inbox },
  { id: "spam",  label: "Spam",           icon: ShieldAlert },
  { id: "ham",   label: "Seguros",        icon: ShieldCheck },
]

export default function Historial() {
  const [items, setItems]       = useState([])
  const [canal, setCanal]       = useState("todos")
  const [filtro, setFiltro]     = useState("todos")
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    obtenerHistorial(100)
      .then(r => setItems(r.data))
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [])

  // Filtrar por canal y por spam/ham
  const visibles = items
    .filter(i => canal === "todos" || i.canal === canal)
    .filter(i => filtro === "todos" || (filtro === "spam" ? i.is_spam : !i.is_spam))

  // Conteo por canal para las pestañas
  const conteo = (c) => c === "todos"
    ? items.length
    : items.filter(i => i.canal === c).length

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-transparent py-12 px-4 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-2">
              <History size={16} /> Registro de actividad
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              Historial de Análisis
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
              Revisa los mensajes procesados por canal.
            </p>
          </div>

          {/* Filtro spam/ham */}
          <div className="flex p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm w-fit">
            {FILTROS.map(f => (
              <button
                key={f.id}
                onClick={() => setFiltro(f.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  filtro === f.id
                    ? "bg-slate-900 dark:bg-primary text-white shadow-md scale-105"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <f.icon size={16} strokeWidth={2.5} />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pestañas por canal */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {CANALES.map(c => (
            <button
              key={c.id}
              onClick={() => setCanal(c.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border ${
                canal === c.id
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                  : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary"
              }`}
            >
              {c.emoji && <span>{c.emoji}</span>}
              {c.label}
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                canal === c.id
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}>
                {conteo(c.id)}
              </span>
            </button>
          ))}
        </div>

        {/* Tabla */}
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="animate-spin mb-4 text-primary" size={48} />
            <p className="font-bold text-lg tracking-tight">Sincronizando historial...</p>
          </div>
        ) : visibles.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Inbox size={40} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">No hay mensajes</p>
            <p className="text-slate-500 mt-2">
              {canal !== "todos"
                ? `No hay mensajes de ${CANALES.find(c => c.id === canal)?.label} aún.`
                : "Aún no has analizado ningún mensaje."}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <div className="col-span-2">Canal</div>
              <div className="col-span-6">Contenido del mensaje</div>
              <div className="col-span-4 text-right">Resultado y Confianza</div>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {visibles.map((item, index) => (
                <div
                  key={item.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <HistorialItem item={item} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between items-center px-6">
          <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
            Mostrando {visibles.length} de {items.length} registros
          </p>
          <button className="text-primary text-xs font-black hover:underline tracking-widest uppercase">
            Descargar reporte (.csv)
          </button>
        </div>

      </div>
    </div>
  )
}
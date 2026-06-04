import { useState } from "react"
import { predecir } from "../services/api"
import AlertaSpam from "../components/AlertaSpam"
import { Search, Sparkles, AlertCircle, Loader2, MessageSquare } from 'lucide-react'

export default function Analizar() {
  const [texto, setTexto] = useState("")
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")

  async function analizar() {
    if (!texto.trim()) { 
      setError("Por favor, escribe un mensaje para comenzar el diagnóstico.")
      return 
    }
    setError("")
    setCargando(true)
    try {
      const { data } = await predecir(texto, "web")
      setResultado(data)
    } catch (e) {
      setError("No pudimos conectar con el motor de IA. Verifica tu conexión.")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 transition-colors duration-500">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-primary/20">
          <Sparkles size={14} /> Smart Engine v3.0
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
          Analizador de Mensajes
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
          Nuestra IA procesa patrones de lenguaje natural para detectar fraudes y spam en milisegundos.
        </p>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none p-2 md:p-10 transition-all duration-300">
        
        <div className="relative group">
          <div className="absolute top-6 left-6 text-slate-300 dark:text-slate-700 group-focus-within:text-primary transition-colors">
            <MessageSquare size={24} strokeWidth={2.5} />
          </div>
          
          <textarea
            rows={7}
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Pega el contenido del correo o mensaje sospechoso aquí..."
            className="w-full pl-16 pr-8 py-8 bg-slate-50 dark:bg-slate-950 border-2 border-transparent rounded-[2.5rem] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-primary/30 focus:bg-white dark:focus:bg-black transition-all resize-none text-lg shadow-inner"
          />
        </div>
        <div className="min-h-[40px] mt-4 flex items-center px-6">
          {error && (
            <div className="flex items-center gap-2 text-danger font-bold text-sm animate-shake">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
        </div>
        <button 
          onClick={analizar} 
          disabled={cargando}
          className="w-full bg-slate-950 dark:bg-primary hover:bg-primary dark:hover:bg-primary-dark text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-primary/10 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group overflow-hidden relative"
        >
          {cargando ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              <span className="tracking-tight uppercase text-xs">Procesando con SmartMail AI...</span>
            </>
          ) : (
            <>
              <Search size={22} className="group-hover:scale-110 transition-transform" strokeWidth={3} />
              <span className="tracking-tight uppercase text-xs">Iniciar Escaneo Inteligente</span>
            </>
          )}
        </button>
        {resultado && (
          <div className="mt-12 animate-slide-in duration-700">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
              <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.4em]">Diagnóstico Final</span>
              <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
            </div>
            
            <AlertaSpam resultado={resultado} />
          </div>
        )}
      </div>
      <div className="mt-12 text-center">
        <p className="text-slate-400 dark:text-slate-600 text-[10px] font-medium uppercase tracking-widest leading-relaxed px-12">
          SmartMail AI utiliza modelos de procesamiento de lenguaje para evaluar la seguridad de la información. No compartas datos sensibles.
        </p>
      </div>
    </div>
  )
}
import { AlertTriangle, CheckCircle, Trash2, ShieldAlert, ShieldCheck } from 'lucide-react'

export default function AlertaSpam({ resultado }) {
  if (!resultado) return null

  const { is_spam, confidence, spam_probability, ham_probability, prediction } = resultado

  if (is_spam) {
    return (
      <div className="animate-slide-in animate-shake border-2 border-red-400 bg-red-50 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="animate-pulse-red">
            <ShieldAlert size={24} className="text-red-600" />
          </div>
          <h3 className="text-red-700 font-semibold text-lg">SPAM DETECTADO</h3>
          <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {confidence}% confianza
          </span>
        </div>

        <div className="bg-red-100 rounded-lg px-4 py-2 mb-4">
          <p className="text-red-800 text-sm italic">"{resultado.text?.substring(0, 100)}{resultado.text?.length > 100 ? '...' : ''}"</p>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-xs text-red-600 mb-1">
            <span>Spam: {spam_probability}%</span>
            <span>Legítimo: {ham_probability}%</span>
          </div>
          <div className="h-2.5 bg-red-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-700"
              style={{ width: `${spam_probability}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mt-4">
          <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">
            <AlertTriangle size={12} /> Posible estafa
          </span>
          <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">
            <ShieldAlert size={12} /> No compartas datos
          </span>
          <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">
            <Trash2 size={12} /> Eliminar mensaje
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-slide-in border-2 border-green-400 bg-green-50 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <ShieldCheck size={24} className="text-green-600" />
        <h3 className="text-green-700 font-semibold text-lg">Mensaje legítimo</h3>
        <span className="ml-auto bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {confidence}% confianza
        </span>
      </div>

      <div className="bg-green-100 rounded-lg px-4 py-2 mb-4">
        <p className="text-green-800 text-sm italic">"{resultado.text?.substring(0, 100)}{resultado.text?.length > 100 ? '...' : ''}"</p>
      </div>

      <div>
        <div className="flex justify-between text-xs text-green-600 mb-1">
          <span>Legítimo: {ham_probability}%</span>
          <span>Spam: {spam_probability}%</span>
        </div>
        <div className="h-2.5 bg-green-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-700"
            style={{ width: `${ham_probability}%` }}
          />
        </div>
      </div>
    </div>
  )
}
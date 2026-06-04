import React from 'react';

const CANAL_ICONS = {
  telegram: '✈️',
  whatsapp: '💬',
  discord:  '🎮',
  gmail:    '📧',
  sms:      '📱',
  web:      '🌐',
};

export default function HistorialItem({ item }) {
  const fecha = new Date(item.created_at).toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="flex items-center gap-4 py-4 px-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 group border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
      <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl flex-shrink-0 shadow-inner transition-colors">
        {CANAL_ICONS[item.canal] || '📧'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-primary transition-colors leading-tight">
          {item.text}
        </p>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter mt-1">
          {fecha}
        </p>
      </div>
      <div className="text-right flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className={`inline-flex items-center text-[10px] font-black px-3 py-1 rounded-full border transition-all ${
          item.is_spam 
            ? 'bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400' 
            : 'bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900/50 text-green-600 dark:text-green-400'
        }`}>
          {item.is_spam ? 'SPAM' : 'SEGURO'}
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
            <div 
              className={`h-full ${item.is_spam ? 'bg-red-500' : 'bg-green-500'}`} 
              style={{ width: `${item.confidence}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 italic">
            {item.confidence}% confianza
          </span>
        </div>
      </div>
    </div>
  );
}
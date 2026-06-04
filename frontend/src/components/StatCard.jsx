import React from 'react';

/**
 * StatCard Component
 * @param {string} label 
 * @param {string|number} value 
 * @param {lucide-react icon} icon
 * @param {string} trend 
 * @param {string} variant 
 */
export default function StatCard({ label, value, icon: Icon, trend, variant = 'primary' }) {
  const variantStyles = {
    primary: 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:border-primary/30',
    success: 'bg-green-50 text-green-600 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
    danger:  'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
    indigo:  'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
    gray:    'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
  };

  return (
    <div className="group bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300">
      
      <div className="flex justify-between items-start mb-4">
        {Icon && (
          <div className={`p-3 rounded-xl border ${variantStyles[variant] || variantStyles.primary} transition-transform group-hover:scale-110 duration-300`}>
            <Icon size={24} strokeWidth={2.5} />
          </div>
        )}
        {trend && (
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border ${variantStyles[variant] || variantStyles.primary}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] mb-1">
          {label}
        </p>
        <p className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter">
          {value}
        </p>
      </div>
    </div>
  );
}
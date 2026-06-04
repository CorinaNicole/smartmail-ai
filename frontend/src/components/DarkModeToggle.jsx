import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function DarkModeToggle() {
  // Inicializamos el estado basado en lo que haya en localStorage o preferencia del sistema
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all shadow-sm border border-gray-200 dark:border-slate-700"
      title={isDark ? "Activar modo claro" : "Activar modo oscuro"}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
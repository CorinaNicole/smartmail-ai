import { Link, useLocation } from 'react-router-dom'
import { logout, getUsuario } from '../services/auth'
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Search, 
  History, 
  LogOut, 
  User as UserIcon 
} from 'lucide-react'
import DarkModeToggle from './DarkModeToggle'

export default function Navbar() {
  const location = useLocation()
  const usuario = getUsuario()
  const links = [
    { to: '/',          label: 'Panel',     icon: LayoutDashboard },
    { to: '/analizar',  label: 'Analizar',  icon: Search },
    { to: '/historial', label: 'Historial', icon: History },
  ]
  return (
    <nav className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="bg-primary p-2 rounded-xl transition-transform group-hover:scale-105 shadow-sm shadow-primary/20">
                <ShieldCheck size={20} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl text-slate-950 dark:text-white tracking-tight">
                SmartMail <span className="text-primary font-medium">AI</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/50 my-2.5 px-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            {links.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-primary shadow-sm dark:text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  {label}
                </Link>
              )
            })}
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <DarkModeToggle />
            <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-3 pl-1">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-slate-950 dark:text-white leading-tight">
                  {usuario?.nombre || 'Usuario'}
                </p>
                <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {usuario?.email?.split('@')[0]}
                </p>
              </div>
              
              {/* Avatar con inicial */}
              <div className="w-10 h-10 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-lg border border-primary/20 transition-transform hover:rotate-3">
                {usuario?.nombre?.charAt(0).toUpperCase() || <UserIcon size={18} />}
              </div>

              {/* Botón Salir */}
              <button
                onClick={logout}
                className="p-2.5 rounded-xl text-slate-400 hover:text-danger hover:bg-danger-light dark:hover:bg-danger/10 transition-all"
                title="Cerrar sesión"
              >
                <LogOut size={20} strokeWidth={2} />
              </button>
            </div>
          </div>

        </div>
      </div>
      <div className="md:hidden flex justify-around py-3 border-t border-slate-50 dark:border-slate-900 bg-white dark:bg-slate-950">
        {links.map(({ to, icon: Icon }) => (
          <Link 
            key={to} 
            to={to} 
            className={`${location.pathname === to ? 'text-primary' : 'text-slate-400'}`}
          >
            <Icon size={22} />
          </Link>
        ))}
      </div>
    </nav>
  )
}
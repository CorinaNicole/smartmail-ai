import { Routes, Route, Navigate } from 'react-router-dom'
import Login      from './pages/Login'
import Register   from './pages/Register'
import Dashboard  from './pages/Dashboard'
import Analizar   from './pages/Analizar'
import Historial  from './pages/Historial'
import Navbar     from './components/Navbar'

function RutaProtegida({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <RutaProtegida>
          <Layout><Dashboard /></Layout>
        </RutaProtegida>
      }/>
      
      <Route path="/analizar" element={
        <RutaProtegida>
          <Layout><Analizar /></Layout>
        </RutaProtegida>
      }/>
      
      <Route path="/historial" element={
        <RutaProtegida>
          <Layout><Historial /></Layout>
        </RutaProtegida>
      }/>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
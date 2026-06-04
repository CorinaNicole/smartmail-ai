import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function login(email, password) {
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)
  const { data } = await axios.post(`${BASE}/auth/login`, form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  localStorage.setItem('token',   data.access_token)
  localStorage.setItem('usuario', JSON.stringify({ nombre: data.nombre, email }))
  return data
}
export async function register(nombre, email, password) {
  const { data } = await axios.post(`${BASE}/auth/register`, { nombre, email, password })
  localStorage.setItem('token',   data.token)
  localStorage.setItem('usuario', JSON.stringify(data.usuario))
  return data
}
export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  window.location.href = '/login'
}
export function getUsuario() {
  const u = localStorage.getItem('usuario')
  return u ? JSON.parse(u) : null
}
export function isLoggedIn() {
  return !!localStorage.getItem('token')
}
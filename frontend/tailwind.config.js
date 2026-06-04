/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  
  content: ['./index.html', './src/**/*.{js,jsx}'],
  
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1D9E75',
          dark: '#0F6E56',
          light: '#D1F2E9', 
        },
        danger: {
          DEFAULT: '#E24B4A',
          light: '#FCEBEB',
        },
        dark: {
          bg: '#020617',     
          card: '#0f172a',  
          border: '#1e293b', 
        }
      },
      animation: {
        'shake': 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
        'pulse-soft': 'pulse-soft 2s infinite',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        }
      }
    }
  },
  plugins: []
}
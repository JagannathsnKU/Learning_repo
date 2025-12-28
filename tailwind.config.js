/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'glass-dark': 'rgba(255, 255, 255, 0.08)',
        'glass-light': 'rgba(255, 255, 255, 0.15)',
        'dream-blue': '#4F9FFF',
        'dream-purple': '#8B7BFF',
        'dream-dark': '#0A0A0A',
      },
      backgroundColor: {
        'glass-dark': 'rgba(255, 255, 255, 0.08)',
        'glass-light': 'rgba(255, 255, 255, 0.15)',
      },
      backdropFilter: {
        'glass': 'blur(10px)',
        'glass-lg': 'blur(20px)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(79, 159, 255, 0.2)',
        'glow-lg': '0 0 40px rgba(79, 159, 255, 0.3)',
      },
      fontFamily: {
        'sans': ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

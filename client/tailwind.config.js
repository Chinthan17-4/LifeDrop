/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#C62828', light: '#E53935', dark: '#8E0000' },
        secondary: '#FDECEC',
        success: '#16A34A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 4px 24px rgba(0,0,0,0.06)',
        'glass-lg': '0 8px 40px rgba(0,0,0,0.10)',
        'red-glow': '0 4px 20px rgba(198,40,40,0.35)',
        'red-glow-lg': '0 6px 32px rgba(198,40,40,0.45)',
      },
    },
  },
  plugins: [],
}

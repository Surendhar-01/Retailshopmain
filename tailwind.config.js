/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefcf7',
          100: '#d6f8ea',
          200: '#b0efd6',
          300: '#7fe1bc',
          400: '#46c999',
          500: '#20b07d',
          600: '#159064',
          700: '#147352',
          800: '#145b42',
          900: '#134b38'
        }
      },
      boxShadow: {
        soft: '0 12px 40px rgba(15, 23, 42, 0.12)'
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.14) 1px, transparent 0)'
      }
    }
  },
  plugins: []
};
